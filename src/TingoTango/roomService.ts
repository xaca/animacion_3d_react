import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, runTransaction, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { isLogging, logEvent, setStatus } from "./debug";
import { clearDebugReports } from "./debugReports";
import { resolveTies } from "./tiebreak";
import { TOPICS } from "./topics";
import type { RoomQuestion, Tiebreak, TingoPlayer } from "./types";
import { pickOne, POINTS, QUESTION_COUNT_CHOICES, READ_SECONDS_CHOICES, ANSWER_SECONDS_CHOICES } from "./types";

// ⚠️ TODO framework: this file is the SECOND copy of the Firestore room pattern born in
// src/Jeopardy/multiplayer/roomService.ts (transactional mutate + rev, publish/subscribe
// of own writes, fetchRoom as a read-only transaction, room codes, old-rooms cleanup).
// Before copying it a third time for a new game, extract the generic half to
// src/lib/gameRoom/ and make Jeopardy and TingoTango consume it. See README.md.

// setup: host configures, code hidden, joins rejected. lobby: players join.
// tingo: the ball is jumping (host screen only). tango: it stopped on someone,
// question open. end: podium.
export type TingoStatus = "setup" | "lobby" | "tingo" | "tango" | "end";

// Build id (ms timestamp as a string). "dev" when not built by Vite (scripts).
export const APP_VERSION = typeof __APP_VERSION__ === "string" ? __APP_VERSION__ : "dev";

// Stored as the Firestore document tingo_rooms/{code}.
export type TingoRoom = {
    code: string;
    version: string; // APP_VERSION of the host that created the room
    status: TingoStatus;
    topic: string; // TOPICS id or an uploaded `custom-` one; the queue is built from its questions on start
    readSeconds: number; // question shown alone for this long before the options appear
    answerSeconds: number; // answer time, starts when the options appear
    players: Record<string, TingoPlayer>;
    playedIds: string[]; // picked in the current fairness cycle; resets when everyone played
    round: number; // 1-based, grows on every stopTango
    selectedId: string | null; // the player the ball stopped on
    question: RoomQuestion | null; // current question (from the queue)
    queue: RoomQuestion[]; // remaining questions, shuffled at startGame
    readEndsAt: number | null; // epoch ms on the host's clock; drives the host's reading countdown only
    optionsAt: number | null; // set by the host screen when the reading time ends; null = options hidden, answers rejected
    questionEndsAt: number | null; // epoch ms on the host's clock; drives the host's answer countdown only
    revealed: boolean; // answer shown; also locks answers. Points given once here
    choice: string | null; // the selected player's answer for the current question
    // The round's hop schedule: written ONCE when the round starts and replayed locally
    // by every phone (one write per round — the live push could never sync per-hop
    // writes, and phones never compare clocks). Visual theater only: the truth is
    // selectedId, drawn in stopTango. Optional: rooms from before the field.
    hops?: string[];
    hopMs?: number; // rhythm of the chant/ball, ms per hop
    questionCount?: number; // questions per game (startGame trims the queue); 0/missing = whole bank
    createdAt?: number; // epoch ms, for the old-rooms cleanup
    debug?: boolean; // teacher's debug switch: phones report to the debug console
    rev?: number; // +1 on every write (mutate); devices keep the copy with the highest rev
    tiebreaks?: Tiebreak[]; // ✊✋✌️ podium tie-breaks, played by finishGame; only while status is end
};

const DEFAULT_READ_SECONDS = 5;
const DEFAULT_ANSWER_SECONDS = 20;
const HOP_MS = 600;
const HOP_COUNT = 80; // ≈48 s of schedule; phones loop it if a round runs longer

export const hopsOf = (room: TingoRoom) => room.hops ?? [];
export const hopMsOf = (room: TingoRoom) => room.hopMs ?? HOP_MS;
export const questionCountOf = (room: TingoRoom) => room.questionCount ?? 0; // 0 = all

// Random walk over the players, no immediate repeats: the ball never stays put
function buildHops(playerIds: string[], length = HOP_COUNT): string[] {
    if (playerIds.length === 0) return [];
    const hops: string[] = [];
    let prev: string | null = null;
    for (let i = 0; i < length; i++) {
        const pool = playerIds.length > 1 ? playerIds.filter((id) => id !== prev) : playerIds;
        const next = pool[Math.floor(Math.random() * pool.length)];
        hops.push(next);
        prev = next;
    }
    return hops;
}

// ---------------------------------------------------------------------------
// Firestore backend: each room is one document, tingo_rooms/{code}. Every change
// runs in a transaction, so simultaneous writes never overwrite each other.
// ---------------------------------------------------------------------------

const CODE_LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ";

const roomRef = (code: string) => doc(db, "tingo_rooms", code);

// Where a device got a copy of the room from. The live push can arrive late (measured in
// Jeopardy: 14–26 s), so devices also use their own confirmed writes and direct server
// reads, and keep whichever copy has the highest rev (see useRoom).
export type RoomSource = "push" | "own write" | "check";
type RoomListener = (room: TingoRoom | null, source: RoomSource) => void;
const channels = new Map<string, Set<RoomListener>>();

export function subscribeRoomUpdates(code: string, cb: RoomListener): () => void {
    let set = channels.get(code);
    if (!set) channels.set(code, (set = new Set()));
    set.add(cb);
    return () => {
        set.delete(cb);
        if (set.size === 0) channels.delete(code);
    };
}

function publishRoom(code: string, room: TingoRoom | null, source: RoomSource) {
    for (const cb of channels.get(code) ?? []) {
        try {
            cb(room, source);
        } catch (e) {
            console.error("Room listener failed", e);
        }
    }
}

export const revOf = (room: TingoRoom | null | undefined) => room?.rev ?? 0;

// Should a device replace its copy (`before`) with `next`? Newest rev wins; only the
// push or a server read can say "deleted".
export function acceptCopy(before: TingoRoom | null | undefined, next: TingoRoom | null, source: RoomSource): boolean {
    if (next === null) return source !== "own write";
    if (before === undefined || before === null) return true;
    const rev = revOf(next);
    return rev > revOf(before) || (rev === 0 && source === "push");
}

async function mutate(code: string, change: (room: TingoRoom) => TingoRoom) {
    const result = await runTransaction(db, async (tx) => {
        const snap = await tx.get(roomRef(code));
        if (!snap.exists()) throw new Error(`Room ${code} not found`);
        const room = snap.data() as TingoRoom;
        const next = change(room);
        // Nothing to change: no write, but the fresh copy is still worth passing on
        if (next === room) return { room, source: "check" as const };
        const saved = { ...next, rev: revOf(room) + 1 };
        tx.set(roomRef(code), saved);
        return { room: saved, source: "own write" as const };
    });
    publishRoom(code, result.room, result.source);
}

function randomId(length: number, letters = "abcdefghijklmnopqrstuvwxyz0123456789") {
    return Array.from({ length }, () => letters[Math.floor(Math.random() * letters.length)]).join("");
}

// ----- Reading -------------------------------------------------------------

export function subscribeRoom(code: string, cb: (room: TingoRoom | null) => void): () => void {
    if (isLogging()) return subscribeRoomDebug(code, cb);
    return onSnapshot(
        roomRef(code),
        (snap) => cb(snap.exists() ? (snap.data() as TingoRoom) : null),
        (error) => {
            console.error(`Could not load room ${code}`, error);
            cb(null);
        }
    );
}

// One-shot read straight from the server. A read-only transaction, not getDocFromServer:
// with a live listener open, getDocFromServer can answer from that listener's (lagging)
// view. Transaction reads are separate requests. Writes nothing.
export async function fetchRoom(code: string): Promise<TingoRoom | null> {
    const room = await runTransaction(db, async (tx) => {
        const snap = await tx.get(roomRef(code));
        return snap.exists() ? (snap.data() as TingoRoom) : null;
    });
    publishRoom(code, room, "check");
    return room;
}

// Short text of what a device sees, for the debug log
export function describeRoom(room: TingoRoom | null): string {
    if (!room) return "room missing";
    return `status=${room.status} round=${room.round} selected=${room.selectedId ?? "-"} options=${room.optionsAt !== null ? "yes" : "no"} revealed=${room.revealed ? "yes" : "no"} queue=${room.queue.length} players=${Object.keys(room.players).length}`;
}

// Debug mode only: same listener plus metadata, so the log shows when the phone is
// running from its cache (offline). Metadata-only changes are logged, not passed on.
function subscribeRoomDebug(code: string, cb: (room: TingoRoom | null) => void): () => void {
    let lastJson: string | null = null;
    let lastRound = -1;
    logEvent("listen", `start ${code}`);
    setStatus({ code, error: null });
    const stop = onSnapshot(
        roomRef(code),
        { includeMetadataChanges: true },
        (snap) => {
            const room = snap.exists() ? (snap.data() as TingoRoom) : null;
            const json = JSON.stringify(room);
            const cache = snap.metadata.fromCache;
            const summary = describeRoom(room);
            if (json === lastJson) {
                logEvent("meta", `cache=${cache ? "yes" : "no"} pending=${snap.metadata.hasPendingWrites ? "yes" : "no"}`);
                setStatus({ fromCache: cache });
                return;
            }
            lastJson = json;
            const patch: Parameters<typeof setStatus>[0] = { fromCache: cache, error: null };
            // New question: the host set readEndsAt = its now + reading time, so this is
            // roughly host clock − this device's clock (minus the network delay)
            if (room && room.round !== lastRound && room.readEndsAt !== null) {
                patch.clockOffsetMs = room.readEndsAt - room.readSeconds * 1000 - Date.now();
                lastRound = room.round;
            }
            logEvent("push", `rev=${revOf(room)} ${summary} cache=${cache ? "yes" : "no"}`);
            setStatus(patch);
            cb(room);
        },
        (error) => {
            console.error(`Could not load room ${code}`, error);
            logEvent("error", `listener: ${error.code ?? ""} ${error.message}`);
            setStatus({ error: `${error.code ?? ""} ${error.message}` });
            cb(null);
        }
    );
    return () => {
        logEvent("listen", `stop ${code}`);
        stop();
    };
}

// Debug mode only: logs an action and whether Firestore confirmed it
async function traced(label: string, run: () => Promise<void>) {
    if (!isLogging()) return run();
    logEvent("send", label);
    const t0 = Date.now();
    try {
        await run();
        logEvent("ok", `${label} confirmed in ${Date.now() - t0} ms`);
    } catch (e) {
        logEvent("error", `${label} failed: ${e}`);
        throw e;
    }
}

// ----- Host actions --------------------------------------------------------

export async function createRoom(): Promise<string> {
    let code = randomId(4, CODE_LETTERS);
    while ((await getDoc(roomRef(code))).exists()) code = randomId(4, CODE_LETTERS);
    await setDoc(roomRef(code), {
        code,
        version: APP_VERSION,
        createdAt: Date.now(),
        status: "setup",
        topic: TOPICS[0].id,
        readSeconds: DEFAULT_READ_SECONDS,
        answerSeconds: DEFAULT_ANSWER_SECONDS,
        players: {},
        playedIds: [],
        round: 0,
        selectedId: null,
        question: null,
        queue: [], // built from the topic's questions in startGame
        readEndsAt: null,
        optionsAt: null,
        questionEndsAt: null,
        revealed: false,
        choice: null,
        hops: [],
        hopMs: HOP_MS,
        questionCount: 10, // ~6-8 min per game; "Todas" (0) is a setup choice
    });
    return code;
}

export type OldRoom = { code: string; createdAt?: number };

// Every room except `keep`: past games left behind when a host closed the tab.
// Cleaning them never touches the question bank, which is its own collection.
export async function listOldRooms(keep: string): Promise<OldRoom[]> {
    const snap = await getDocs(collection(db, "tingo_rooms"));
    return snap.docs.map((d) => ({ code: d.id, createdAt: (d.data() as TingoRoom).createdAt })).filter((r) => r.code !== keep);
}

export async function cleanRooms(codes: string[]) {
    for (const code of codes) await deleteRoom(code);
}

export async function deleteRoom(code: string) {
    // Debug reports live under the room; best effort, they're only test data
    await clearDebugReports(code).catch(() => {});
    await deleteDoc(roomRef(code));
}

// Teacher's debug switch. Only this write sets the field, so rooms keep working with
// rules that don't know it yet (only the switch would fail).
export async function setRoomDebug(code: string, on: boolean) {
    await mutate(code, (room) => ({ ...room, debug: on }));
    if (!on) await clearDebugReports(code).catch(() => {});
}

// Why the host can't press Start yet, or null when they can
export function startProblem(room: TingoRoom): string | null {
    if (Object.keys(room.players).length < 1) return "Necesitas al menos 1 jugador en la sala";
    return null;
}

// 🧪 Debug only (menu with debug mode on): everyone gets the top score, so ending the
// game now shows the ✊✋✌️ tie-break without playing for it
export async function forceTie(code: string) {
    await mutate(code, (room) => {
        if (room.status !== "tingo" && room.status !== "tango") return room;
        const top = Math.max(POINTS, ...Object.values(room.players).map((p) => p.score));
        return { ...room, players: Object.fromEntries(Object.entries(room.players).map(([id, p]) => [id, { ...p, score: top }])) };
    });
}

// Test player for trying the game alone: the host screen answers for it when the ball
// picks it (useBots). Lobby only, like joining the real game.
export async function addBot(code: string) {
    await mutate(code, (room) => {
        if (room.status !== "lobby") return room;
        const n = Object.values(room.players).filter((p) => p.bot).length + 1;
        const bot: TingoPlayer = { id: randomId(10), name: `🤖 Bot ${n}`, score: 0, bot: true };
        return { ...room, players: { ...room.players, [bot.id]: bot } };
    });
}

export async function removeBots(code: string) {
    await mutate(code, (room) => ({
        ...room,
        players: Object.fromEntries(Object.entries(room.players).filter(([, p]) => !p.bot)),
        playedIds: room.playedIds.filter((id) => !room.players[id]?.bot),
    }));
}

// Settings change only before the game (setup, or the lobby for old rooms)
const configurable = (room: TingoRoom) => room.status === "setup" || room.status === "lobby";
// Seeded topics, or one the teacher uploaded (its questions may be gone: Start says so)
const knownTopic = (topic: string) => TOPICS.some((t) => t.id === topic) || topic.startsWith("custom-");

export async function setTopic(code: string, topic: string) {
    await mutate(code, (room) => (configurable(room) && knownTopic(topic) ? { ...room, topic } : room));
}

export async function setReadSeconds(code: string, readSeconds: number) {
    await mutate(code, (room) => (configurable(room) ? { ...room, readSeconds } : room));
}

export async function setAnswerSeconds(code: string, answerSeconds: number) {
    await mutate(code, (room) => (configurable(room) ? { ...room, answerSeconds } : room));
}

export async function setQuestionCount(code: string, questionCount: number) {
    await mutate(code, (room) => (configurable(room) ? { ...room, questionCount } : room));
}

// Setup done: the code and QR show up and phones can join
export async function openRoom(code: string) {
    await mutate(code, (room) => (room.status === "setup" ? { ...room, status: "lobby" as const } : room));
}

// "⚙ Ajustes" from the lobby: players already in stay (their phones show "get ready"),
// new joins wait until the room opens again
export async function backToSetup(code: string) {
    await mutate(code, (room) => (room.status === "lobby" ? { ...room, status: "setup" as const } : room));
}

export type TingoSettings = { topic?: string; readSeconds?: number; answerSeconds?: number; questionCount?: number };

// Several settings in one write (New room copies the old one's). Values outside the
// usual choices are ignored, so the room stays valid.
export async function applySettings(code: string, s: TingoSettings) {
    const ok = (v: number | undefined, choices: number[]): v is number => v !== undefined && choices.includes(v);
    await mutate(code, (room) => {
        if (!configurable(room)) return room;
        const next = { ...room };
        if (s.topic !== undefined && knownTopic(s.topic)) next.topic = s.topic;
        if (ok(s.readSeconds, READ_SECONDS_CHOICES)) next.readSeconds = s.readSeconds;
        if (ok(s.answerSeconds, ANSWER_SECONDS_CHOICES)) next.answerSeconds = s.answerSeconds;
        if (ok(s.questionCount, QUESTION_COUNT_CHOICES)) next.questionCount = s.questionCount;
        return next;
    });
}

// Fresh game: scores AND the tie-breaker round start clean (never store undefined)
function resetScores(players: Record<string, TingoPlayer>): Record<string, TingoPlayer> {
    return Object.fromEntries(
        Object.entries(players).map(([id, p]) => {
            const { scoredRound: _drop, ...rest } = p;
            void _drop;
            return [id, { ...rest, score: 0 }];
        })
    );
}

const noQuestion = {
    selectedId: null,
    question: null,
    readEndsAt: null,
    optionsAt: null,
    questionEndsAt: null,
    revealed: false,
    choice: null,
} as const;

// Every way a game ends goes through here: podium ties are settled ✊✋✌️ right now, in
// this transaction, so all screens replay the same throws
function finishGame(room: TingoRoom): TingoRoom {
    return { ...room, status: "end", ...noQuestion, tiebreaks: resolveTies(Object.values(room.players)) };
}

// A new game forgets the last podium's tie-breaks (never store undefined)
function withoutTiebreaks(room: TingoRoom): TingoRoom {
    const { tiebreaks: _drop, ...rest } = room;
    void _drop;
    return rest;
}

// Starts the game with a freshly built queue (the questions query can't run inside the
// transaction, so the caller loads them first — see HostLobby). Scores reset, cycle clean.
// The queue is trimmed to questionCount, so the game ends at the podium after N questions
// (nextRound already sends to "end" when the queue runs out).
export async function startGame(code: string, queue: RoomQuestion[]) {
    await mutate(code, (room) => {
        const problem = startProblem(room);
        if (room.status !== "lobby") return room;
        if (problem) throw new Error(problem);
        const count = questionCountOf(room);
        return {
            ...withoutTiebreaks(room),
            status: "tingo" as const,
            queue: count > 0 ? queue.slice(0, count) : queue,
            round: 0,
            playedIds: [],
            players: resetScores(room.players),
            hops: buildHops(Object.keys(room.players)),
            hopMs: hopMsOf(room),
            ...noQuestion,
        };
    });
}

// THE moment of the game: the ball stops. One write picks the player (fair draw among
// those who haven't played this cycle — the ball on screen is theater, this is the truth),
// takes the next question from the queue and opens it. The reading time starts here.
export async function stopTango(code: string) {
    await traced("stopTango", () =>
        mutate(code, (room) => {
            if (room.status !== "tingo") return room;
            const ids = Object.keys(room.players);
            if (ids.length === 0 || room.queue.length === 0) return finishGame(room);
            const fresh = ids.filter((id) => !room.playedIds.includes(id));
            const pool = fresh.length > 0 ? fresh : ids; // everyone played: new cycle
            const selectedId = pickOne(pool);
            const [question, ...queue] = room.queue;
            const now = Date.now();
            const instant = room.readSeconds === 0;
            return {
                ...room,
                status: "tango" as const,
                round: room.round + 1,
                selectedId,
                question,
                queue,
                playedIds: fresh.length > 0 ? [...room.playedIds, selectedId] : [selectedId],
                readEndsAt: instant ? null : now + room.readSeconds * 1000,
                optionsAt: instant ? now : null,
                questionEndsAt: instant ? now + room.answerSeconds * 1000 : null,
                revealed: false,
                choice: null,
            };
        })
    );
}

// Called by the host screen when its reading countdown ends, or by "Mostrar opciones"
export async function showOptions(code: string) {
    await traced("showOptions", () =>
        mutate(code, (room) => {
            if (room.status !== "tango" || optionsVisible(room)) return room;
            const now = Date.now();
            return { ...room, optionsAt: now, questionEndsAt: now + room.answerSeconds * 1000 };
        })
    );
}

// Ends the question: locks the answer, shows the correct option everywhere and gives the
// points when the selected player got it right. Runs once, even if called twice.
export async function reveal(code: string) {
    await traced("reveal", () =>
        mutate(code, (room) => {
            if (room.status !== "tango" || room.revealed || !room.question) return room;
            const correct = room.choice !== null && room.choice === room.question.answer;
            const selected = room.selectedId !== null ? room.players[room.selectedId] : undefined;
            return {
                ...room,
                revealed: true,
                players:
                    correct && selected
                        ? // scoredRound: the podium tie-breaker (equal totals → earlier round wins)
                          { ...room.players, [selected.id]: { ...selected, score: selected.score + POINTS, scoredRound: room.round } }
                        : room.players,
            };
        })
    );
}

// After the reveal: back to the jumping ball (with a fresh hop schedule for the phones
// to replay), or the podium when the questions ran out
export async function nextRound(code: string) {
    await mutate(code, (room) => {
        if (room.status !== "tango" || !room.revealed) return room;
        const done = room.queue.length === 0 || Object.keys(room.players).length === 0;
        if (done) return finishGame({ ...room, hops: [] });
        return { ...room, status: "tingo" as const, hops: buildHops(Object.keys(room.players)), ...noQuestion };
    });
}

// Teacher ends the game early (menu): podium with the scores as they are
export async function endGame(code: string) {
    await mutate(code, (room) => {
        if (room.status !== "tingo" && room.status !== "tango") return room;
        return finishGame(room);
    });
}

// Same room, next game: players stay, scores and cycle reset, queue rebuilt on Start.
// Serves both "↩ Reiniciar" mid-game and "🔁 Otra partida" after the podium.
export async function backToLobby(code: string) {
    await mutate(code, (room) => ({
        ...withoutTiebreaks(room),
        status: "lobby" as const,
        round: 0,
        playedIds: [],
        queue: [],
        players: resetScores(room.players),
        ...noQuestion,
    }));
}

// ----- Player actions ------------------------------------------------------

export const ROOM_NOT_OPEN = "Room not open yet";

// Rejected while the host is still in setup (the code is hidden then, but a returning
// phone could still try): JoinScreen tells them to wait
export async function joinRoom(code: string, name: string): Promise<TingoPlayer> {
    const player: TingoPlayer = { id: randomId(10), name, score: 0 };
    await mutate(code, (room) => {
        if (room.status === "setup") throw new Error(ROOM_NOT_OPEN);
        return { ...room, players: { ...room.players, [player.id]: player } };
    });
    return player;
}

// Only the explicit "Salir" button lands here: a phone that closes the browser never says
// goodbye. If the selected player leaves mid-question, the question closes with no points;
// with nobody left the game ends.
export async function leaveRoom(code: string, playerId: string) {
    await mutate(code, (room) => {
        if (!room.players[playerId]) return room;
        const players = { ...room.players };
        delete players[playerId];
        let next: TingoRoom = { ...room, players, playedIds: room.playedIds.filter((id) => id !== playerId) };
        if (room.status === "tango" && room.selectedId === playerId && !room.revealed) {
            next = { ...next, revealed: true };
        }
        if (Object.keys(players).length === 0 && (room.status === "tingo" || room.status === "tango")) {
            next = finishGame(next);
        }
        return next;
    });
}

// Only the selected player answers, once. No clock is checked here: the window is open
// from the host's showOptions until the host's reveal, so phones with wrong clocks or
// slower networks play on equal terms.
export async function answer(code: string, playerId: string, choice: string) {
    await traced(`answer by ${playerId}: "${choice}"`, () =>
        mutate(code, (room) => {
            if (room.status !== "tango" || room.selectedId !== playerId || !room.question) return room;
            if (!optionsVisible(room) || room.revealed || room.choice !== null) return room;
            return { ...room, choice };
        })
    );
}

// ----- Helpers for the screens ---------------------------------------------

// False during the reading time. No clock involved: the host screen flips it with
// showOptions and Firestore pushes it to every phone.
export function optionsVisible(room: TingoRoom): boolean {
    return room.optionsAt !== null;
}

// True while the open question is the last one of the queue
export function isLastQuestion(room: TingoRoom): boolean {
    return room.status === "tango" && room.queue.length === 0;
}

export function selectedPlayer(room: TingoRoom): TingoPlayer | null {
    return room.selectedId !== null ? (room.players[room.selectedId] ?? null) : null;
}
