import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, runTransaction, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { allUsed, markUsed, type Category } from "../questions";
import { buildBoardFrom, loadQuestions } from "../questionService";
import { TOPICS } from "../topics";
import type { Team } from "../teams";
import { pickTeamNames } from "../teamNames";
import { isLogging, logEvent, setStatus } from "./debug";
import { clearDebugReports } from "./debugReports";

// setup: host configures, nobody can join yet. lobby: code shown, players join and get ready.
export type RoomStatus = "setup" | "lobby" | "board" | "question" | "end";

// `team` is a Team id; a player is on at most one team. `bot`: test player answered by the host screen (useBots)
export type Player = { id: string; name: string; team: string | null; bot?: true };

// One per TEAM per question: whoever taps first answers for the whole team
export type Answer = { playerId: string; name: string; team: string | null; choice: string; correct: boolean; at: number };

// Build id (ms timestamp as a string). "dev" when not built by Vite (test scripts).
export const APP_VERSION = typeof __APP_VERSION__ === "string" ? __APP_VERSION__ : "dev";

// Stored as the Firestore document rooms/{code}.
export type Room = {
    code: string;
    version: string; // APP_VERSION of the host that created the room
    status: RoomStatus;
    topic: string; // TOPICS id; the board is built from its questions on start
    timerSeconds: number;
    maxTeamSize: number; // players per team, set by the host in setup
    startSeconds: number; // last call after the host presses Start, before empty teams are dropped
    readSeconds: number; // question shown alone for this long before the options appear
    teams: Team[]; // created by the host (count + random names); players only join them
    startsAt: number | null; // epoch ms; start countdown running when set (lobby only)
    board: Category[];
    activeTile: { col: number; row: number } | null;
    readEndsAt: number | null; // epoch ms on the host's clock; drives the host's reading countdown only
    optionsAt: number | null; // set by the host screen when the reading time ends; null = options hidden, answers rejected
    questionEndsAt: number | null; // epoch ms on the host's clock; drives the host's answer countdown only
    revealed: boolean; // answer shown to everyone; also locks answers
    answers: Answer[];
    players: Record<string, Player>;
    boardSize?: number; // 3 | 4 | 5 → N×N board. Missing (old rooms) = 5
    gameMinutes?: number; // time limit; 0 or missing = no limit
    gameEndsAt?: number | null; // epoch ms on the host's clock, set by startGame when gameMinutes > 0
    createdAt?: number; // epoch ms, for the old-rooms cleanup; rooms before the field may lack it
    debug?: boolean; // teacher's debug switch: phones report to the debug console. Missing = off
    rev?: number; // +1 on every write (mutate); devices keep the copy with the highest rev. Missing = 0
};

export const TIMER_CHOICES = [15, 20, 30];
export const TEAM_COUNT_CHOICES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const TEAM_SIZE_CHOICES = [1, 2, 3, 4, 5, 6];
export const START_SECONDS_CHOICES = [10, 15, 30, 60];
export const READ_SECONDS_CHOICES = [0, 5, 10, 15];
export const BOARD_SIZE_CHOICES = [1, 2, 3, 4, 5];
export const GAME_MINUTES_CHOICES = [0, 10, 15, 20];
const DEFAULT_TEAM_COUNT = 3;
const DEFAULT_TEAM_SIZE = 3;
const DEFAULT_START_SECONDS = 30;
const DEFAULT_READ_SECONDS = 10;

export const boardSizeOf = (room: Room) => room.boardSize ?? 5;
export const gameMinutesOf = (room: Room) => room.gameMinutes ?? 0;
// A team's spots: the room's max plus the host's "+1 slot" for that team
export const capacityOf = (room: Room, team: Team) => room.maxTeamSize + (team.bonus ?? 0);

// ---------------------------------------------------------------------------
// Firestore backend: each room is one document, rooms/{code}. Every change runs
// in a transaction, so simultaneous writes (e.g. two correct answers) never overwrite each other.
// ---------------------------------------------------------------------------

const CODE_LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ";

const roomRef = (code: string) => doc(db, "rooms", code);

// Where a device got a copy of the room from. The live push can arrive late (seen: 14–26 s
// for one change while writes kept working), so devices also use their own confirmed writes
// and direct server reads, and keep whichever copy has the highest rev (see useRoom).
export type RoomSource = "push" | "own write" | "check";
type RoomListener = (room: Room | null, source: RoomSource) => void;
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

function publishRoom(code: string, room: Room | null, source: RoomSource) {
    for (const cb of channels.get(code) ?? []) {
        try {
            cb(room, source);
        } catch (e) {
            console.error("Room listener failed", e);
        }
    }
}

export const revOf = (room: Room | null | undefined) => room?.rev ?? 0;

// Should a device replace its copy (`before`) with `next`? Newest rev wins; rooms without
// rev (rev 0) follow the push as before; only the push or a server read can say "deleted".
export function acceptCopy(before: Room | null | undefined, next: Room | null, source: RoomSource): boolean {
    if (next === null) return source !== "own write";
    if (before === undefined || before === null) return true;
    const rev = revOf(next);
    return rev > revOf(before) || (rev === 0 && source === "push");
}

async function mutate(code: string, change: (room: Room) => Room) {
    const result = await runTransaction(db, async (tx) => {
        const snap = await tx.get(roomRef(code));
        if (!snap.exists()) throw new Error(`Room ${code} not found`);
        const room = snap.data() as Room;
        const next = change(room);
        // Nothing to change (e.g. a second answer from the same team): no write, but the
        // fresh copy we just read is still worth passing on
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

export function subscribeRoom(code: string, cb: (room: Room | null) => void): () => void {
    if (isLogging()) return subscribeRoomDebug(code, cb);
    return onSnapshot(
        roomRef(code),
        (snap) => cb(snap.exists() ? (snap.data() as Room) : null),
        (error) => {
            console.error(`Could not load room ${code}`, error);
            cb(null);
        }
    );
}

// One-shot read straight from the server (debug "Check server now"). A read-only
// transaction, not getDocFromServer: with a live listener open, getDocFromServer can
// answer from that listener's view, so a stalled stream would look "up to date".
// Transaction reads are separate requests, independent of the listener. Writes nothing.
export async function fetchRoom(code: string): Promise<Room | null> {
    const room = await runTransaction(db, async (tx) => {
        const snap = await tx.get(roomRef(code));
        return snap.exists() ? (snap.data() as Room) : null;
    });
    publishRoom(code, room, "check");
    return room;
}

// Short text of what a device sees, for the debug log
export function describeRoom(room: Room | null): string {
    if (!room) return "room missing";
    const tile = room.activeTile ? `${room.activeTile.col},${room.activeTile.row}` : "-";
    return `status=${room.status} tile=${tile} options=${room.optionsAt !== null ? "yes" : "no"} revealed=${room.revealed ? "yes" : "no"} answers=${room.answers.length} players=${Object.keys(room.players).length}`;
}

// Debug mode only: same listener plus metadata, so the log shows when the phone is
// running from its cache (offline). Metadata-only changes are logged, not passed on,
// so the game sees exactly the same updates as without debug mode.
function subscribeRoomDebug(code: string, cb: (room: Room | null) => void): () => void {
    let lastJson: string | null = null;
    let lastTile = "";
    logEvent("listen", `start ${code}`);
    setStatus({ code, error: null });
    const stop = onSnapshot(
        roomRef(code),
        { includeMetadataChanges: true },
        (snap) => {
            const room = snap.exists() ? (snap.data() as Room) : null;
            const json = JSON.stringify(room);
            const cache = snap.metadata.fromCache;
            const summary = describeRoom(room);
            if (json === lastJson) {
                logEvent("meta", `cache=${cache ? "yes" : "no"} pending=${snap.metadata.hasPendingWrites ? "yes" : "no"}`);
                setStatus({ fromCache: cache });
                return;
            }
            lastJson = json;
            const tile = room?.activeTile ? `${room.activeTile.col},${room.activeTile.row}` : "";
            // What the device "sees" (summary, lastUpdateAt) is set by useRoom, which may already
            // have a newer copy from its own write or a server check
            const patch: Parameters<typeof setStatus>[0] = { fromCache: cache, error: null };
            // New question: the host set readEndsAt = its now + reading time, so this is
            // roughly host clock − this device's clock (minus the network delay)
            if (room && tile && tile !== lastTile && room.readEndsAt !== null) {
                patch.clockOffsetMs = room.readEndsAt - room.readSeconds * 1000 - Date.now();
            }
            lastTile = tile;
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

// Debug mode only: logs an action and whether Firestore confirmed it. Without debug
// mode it just runs the action.
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

// `count` new teams with random names not used by `existing`
function newTeams(count: number, existing: Team[]): Team[] {
    return pickTeamNames(count, existing.map((t) => t.name)).map((n) => ({ id: randomId(8), name: n.name, color: n.color, score: 0 }));
}

export async function createRoom(): Promise<string> {
    let code = randomId(4, CODE_LETTERS);
    while ((await getDoc(roomRef(code))).exists()) code = randomId(4, CODE_LETTERS);
    await setDoc(roomRef(code), {
        code,
        version: APP_VERSION,
        createdAt: Date.now(),
        status: "setup",
        topic: TOPICS[0].id,
        timerSeconds: 20,
        maxTeamSize: DEFAULT_TEAM_SIZE,
        startSeconds: DEFAULT_START_SECONDS,
        readSeconds: DEFAULT_READ_SECONDS,
        teams: newTeams(DEFAULT_TEAM_COUNT, []),
        startsAt: null,
        boardSize: 5,
        gameMinutes: 0,
        gameEndsAt: null,
        board: [], // built from the topic's questions in startGame
        activeTile: null,
        readEndsAt: null,
        optionsAt: null,
        questionEndsAt: null,
        revealed: false,
        answers: [],
        players: {},
    });
    return code;
}

export type OldRoom = { code: string; createdAt?: number };

// Every room except `keep`: past games left behind when a host closed the tab.
// Cleaning them never touches the question bank, which is its own collection.
export async function listOldRooms(keep: string): Promise<OldRoom[]> {
    const snap = await getDocs(collection(db, "rooms"));
    return snap.docs.map((d) => ({ code: d.id, createdAt: (d.data() as Room).createdAt })).filter((r) => r.code !== keep);
}

// Deletes exactly the given rooms (debug reports included via deleteRoom)
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

function teamSize(room: Room, teamId: string): number {
    return Object.values(room.players).filter((p) => p.team === teamId).length;
}

// Teams with at least one player: the ones that can play
function activeTeams(room: Room): Team[] {
    return room.teams.filter((t) => teamSize(room, t.id) > 0);
}

// Why the host can't press Start yet, or null when they can. Shared by UI and startGame.
// Minimum to play: one team with one player (solo practice is allowed).
export function startProblem(room: Room): string | null {
    if (activeTeams(room).length < 1) return "You need at least 1 team with a player";
    const over = room.teams.find((t) => teamSize(room, t.id) > capacityOf(room, t));
    if (over) return `${over.name} has more players than its ${capacityOf(room, over)} spots`;
    return null;
}

// Test player for trying the game with one phone: joins the team with fewest players
// that still has room. Ignored when every team is full.
export async function addBot(code: string) {
    await mutate(code, (room) => {
        const open = room.teams.filter((t) => teamSize(room, t.id) < capacityOf(room, t));
        if (room.status !== "lobby" || open.length === 0) return room;
        const team = open.reduce((a, b) => (teamSize(room, b.id) < teamSize(room, a.id) ? b : a));
        const n = Object.values(room.players).filter((p) => p.bot).length + 1;
        const bot: Player = { id: randomId(10), name: `🤖 Bot ${n}`, team: team.id, bot: true };
        return { ...room, players: { ...room.players, [bot.id]: bot } };
    });
}

export async function removeBots(code: string) {
    await mutate(code, (room) => ({
        ...room,
        players: Object.fromEntries(Object.entries(room.players).filter(([, p]) => !p.bot)),
    }));
}

export async function openRoom(code: string) {
    await mutate(code, (room) => (room.status === "setup" ? { ...room, status: "lobby" } : room));
}

// Players already in the room stay; new joins are refused until the host reopens it
export async function backToSetup(code: string) {
    await mutate(code, (room) => (room.status === "lobby" ? { ...room, status: "setup", startsAt: null } : room));
}

export async function setTopic(code: string, topic: string) {
    await mutate(code, (room) => ({ ...room, topic }));
}

export async function setTimerSeconds(code: string, timerSeconds: number) {
    await mutate(code, (room) => ({ ...room, timerSeconds }));
}

// Lowering the max doesn't move anyone: startProblem blocks until oversized teams shrink
export async function setMaxTeamSize(code: string, maxTeamSize: number) {
    await mutate(code, (room) => ({ ...room, maxTeamSize }));
}

export async function setStartSeconds(code: string, startSeconds: number) {
    await mutate(code, (room) => ({ ...room, startSeconds }));
}

export async function setBoardSize(code: string, boardSize: number) {
    await mutate(code, (room) => ({ ...room, boardSize }));
}

export async function setGameMinutes(code: string, gameMinutes: number) {
    await mutate(code, (room) => ({ ...room, gameMinutes }));
}

// "+1 slot" on one team (17 students in teams of 2 → one team of 3). bonus is 0 or 1.
export async function setTeamBonus(code: string, teamId: string, bonus: number) {
    await mutate(code, (room) => {
        if (!beforeGame(room)) return room;
        return {
            ...room,
            teams: room.teams.map((t) => {
                if (t.id !== teamId) return t;
                const { bonus: _drop, ...rest } = t;
                void _drop;
                return bonus > 0 ? { ...rest, bonus } : rest;
            }),
        };
    });
}

export async function setReadSeconds(code: string, readSeconds: number) {
    await mutate(code, (room) => ({ ...room, readSeconds }));
}

const beforeGame = (room: Room) => room.status === "setup" || room.status === "lobby";

// Adds teams at the end or removes them from the end; players on a removed team pick again.
// Pure, so setTeamCount and applySettings share it.
function withTeamCount(room: Room, count: number): Room {
    if (count >= room.teams.length) {
        return { ...room, teams: [...room.teams, ...newTeams(count - room.teams.length, room.teams)] };
    }
    const teams = room.teams.slice(0, count);
    const kept = new Set(teams.map((t) => t.id));
    return {
        ...room,
        teams,
        players: Object.fromEntries(
            Object.entries(room.players).map(([id, p]) => [id, p.team !== null && !kept.has(p.team) ? { ...p, team: null } : p])
        ),
    };
}

// Before the game only: mid-game the scores and answers refer to the current teams.
export async function setTeamCount(code: string, count: number) {
    await mutate(code, (room) => (!beforeGame(room) || count < 1 ? room : withTeamCount(room, count)));
}

export type SetupSettings = {
    topic?: string;
    readSeconds?: number;
    timerSeconds?: number;
    startSeconds?: number;
    maxTeamSize?: number;
    teamCount?: number;
    bonusTeams?: number; // how many teams get a +1 spot (class calculator leftovers)
    boardSize?: number;
    gameMinutes?: number;
};

// Several settings in one write (quick start, class calculator). Values outside the
// usual choices (e.g. from an old saved setup) are ignored, so the room stays valid.
export async function applySettings(code: string, s: SetupSettings) {
    const ok = (v: number | undefined, choices: number[]): v is number => v !== undefined && choices.includes(v);
    await mutate(code, (room) => {
        if (!beforeGame(room)) return room;
        let next = { ...room };
        if (s.topic !== undefined && TOPICS.some((t) => t.id === s.topic)) next.topic = s.topic;
        if (ok(s.readSeconds, READ_SECONDS_CHOICES)) next.readSeconds = s.readSeconds;
        if (ok(s.timerSeconds, TIMER_CHOICES)) next.timerSeconds = s.timerSeconds;
        if (ok(s.startSeconds, START_SECONDS_CHOICES)) next.startSeconds = s.startSeconds;
        if (ok(s.maxTeamSize, TEAM_SIZE_CHOICES)) next.maxTeamSize = s.maxTeamSize;
        if (ok(s.boardSize, BOARD_SIZE_CHOICES)) next.boardSize = s.boardSize;
        if (ok(s.gameMinutes, GAME_MINUTES_CHOICES)) next.gameMinutes = s.gameMinutes;
        if (ok(s.teamCount, TEAM_COUNT_CHOICES)) next = withTeamCount(next, s.teamCount);
        // The first `bonusTeams` teams get a +1 spot, the rest lose theirs
        if (s.bonusTeams !== undefined && s.bonusTeams >= 0) {
            next = {
                ...next,
                teams: next.teams.map((t, i) => {
                    const { bonus: _drop, ...rest } = t;
                    void _drop;
                    return i < s.bonusTeams! ? { ...rest, bonus: 1 } : rest;
                }),
            };
        }
        return next;
    });
}

// New random names for every team; ids (and so the players' choices) stay the same
export async function rerollTeamNames(code: string) {
    await mutate(code, (room) => {
        if (!beforeGame(room)) return room;
        const names = pickTeamNames(room.teams.length, room.teams.map((t) => t.name));
        return { ...room, teams: room.teams.map((t, i) => ({ ...t, name: names[i].name, color: names[i].color })) };
    });
}

// Host pressed Start: last call for players to pick a team before the game begins
export async function startCountdown(code: string) {
    await mutate(code, (room) => {
        if (room.status !== "lobby" || startProblem(room)) return room;
        return { ...room, startsAt: Date.now() + room.startSeconds * 1000 };
    });
}

export async function cancelCountdown(code: string) {
    await mutate(code, (room) => ({ ...room, startsAt: null }));
}

// Starts with the teams that have players; empty teams are eliminated. Players still
// without a team stay in the room and can pick a team with space mid-game.
export async function startGame(code: string) {
    // The questions query can't run inside the transaction, so build the board first
    const snap = await getDoc(roomRef(code));
    if (!snap.exists()) throw new Error(`Room ${code} not found`);
    const before = snap.data() as Room;
    const problem = startProblem(before);
    if (problem) throw new Error(problem);
    const board = buildBoardFrom(await loadQuestions(before.topic), boardSizeOf(before));
    await mutate(code, (room) => {
        const teams = activeTeams(room);
        const minutes = gameMinutesOf(room);
        return {
            ...room,
            status: "board",
            board,
            teams: teams.map((t) => ({ ...t, score: 0 })),
            startsAt: null,
            gameEndsAt: minutes > 0 ? Date.now() + minutes * 60_000 : null,
            activeTile: null,
            readEndsAt: null,
            optionsAt: null,
            questionEndsAt: null,
            revealed: false,
            answers: [],
        };
    });
}

// The question is shown alone first. The options appear (and the answer timer starts)
// only when the host screen calls showOptions, so every phone sees them at the same
// moment regardless of its clock. With readSeconds 0 they appear immediately.
export async function openTile(code: string, col: number, row: number) {
    await mutate(code, (room) => {
        const now = Date.now();
        const instant = room.readSeconds === 0;
        return {
            ...room,
            status: "question",
            activeTile: { col, row },
            readEndsAt: instant ? null : now + room.readSeconds * 1000,
            optionsAt: instant ? now : null,
            questionEndsAt: instant ? now + room.timerSeconds * 1000 : null,
            revealed: false,
            answers: [],
        };
    });
}

// Called by the host screen when its reading countdown ends, or by "Show options now"
export async function showOptions(code: string) {
    await traced("showOptions", () =>
        mutate(code, (room) => {
            if (room.status !== "question" || optionsVisible(room)) return room;
            const now = Date.now();
            return { ...room, optionsAt: now, questionEndsAt: now + room.timerSeconds * 1000 };
        })
    );
}

// Ends the question: locks answers, shows the correct option everywhere and gives the
// tile's points to EVERY team that answered correctly. Called by the host screen when
// all teams have answered, when its timer ends, or by "Show answer". Runs once: a
// second call (e.g. timer and "all answered" at the same moment) changes nothing.
export async function revealAnswer(code: string) {
    await traced("revealAnswer", () =>
        mutate(code, (room) => {
            const tile = activeTileOf(room);
            if (!tile || room.revealed) return room;
            const winners = new Set(room.answers.filter((a) => a.correct).map((a) => a.team));
            return {
                ...room,
                revealed: true,
                teams: room.teams.map((t) => (winners.has(t.id) ? { ...t, score: t.score + tile.value } : t)),
            };
        })
    );
}

export async function closeTile(code: string) {
    await mutate(code, (room) => {
        if (!room.activeTile) return room;
        const board = markUsed(room.board, room.activeTile.col, room.activeTile.row);
        const done = allUsed(board);
        return {
            ...room,
            board,
            status: done ? "end" : "board",
            ...(done ? { gameEndsAt: null } : {}),
            activeTile: null,
            readEndsAt: null,
            optionsAt: null,
            questionEndsAt: null,
            revealed: false,
            answers: [],
        };
    });
}

// Next game in the same room: back to setup with the same players on the same teams
// (scores reset), so nobody has to join or pick again. Ignored before a game started.
export async function newGame(code: string) {
    await mutate(code, (room) => {
        if (beforeGame(room)) return room;
        const next: Room = {
            ...room,
            status: "setup",
            board: [],
            teams: room.teams.map((t) => ({ ...t, score: 0 })),
            startsAt: null,
            gameEndsAt: null,
            activeTile: null,
            readEndsAt: null,
            optionsAt: null,
            questionEndsAt: null,
            revealed: false,
            answers: [],
        };
        // Everyone left last game (no teams): start again from the default teams
        return next.teams.length < 1 ? withTeamCount(next, DEFAULT_TEAM_COUNT) : next;
    });
}

// Time limit reached (fired by the host screen once the open question, if any, closed):
// podium with the scores as they are, remaining tiles unplayed.
export async function endGame(code: string) {
    await mutate(code, (room) => {
        if (room.status !== "board") return room;
        return { ...room, status: "end", gameEndsAt: null, activeTile: null, readEndsAt: null, optionsAt: null, questionEndsAt: null, revealed: false, answers: [] };
    });
}

export async function backToLobby(code: string) {
    await mutate(code, (room) => ({
        ...room,
        status: "lobby",
        startsAt: null,
        gameEndsAt: null,
        activeTile: null,
        readEndsAt: null,
        optionsAt: null,
        questionEndsAt: null,
        revealed: false,
        answers: [],
    }));
}

// ----- Player actions ------------------------------------------------------

export const ROOM_NOT_OPEN = "Room not open yet";

export async function joinRoom(code: string, name: string): Promise<Player> {
    const player: Player = { id: randomId(10), name, team: null };
    await mutate(code, (room) => {
        if (room.status === "setup") throw new Error(ROOM_NOT_OPEN);
        return { ...room, players: { ...room.players, [player.id]: player } };
    });
    return player;
}

// Puts the player on a team (leaving their current one). Ignored when the team is gone or full.
export async function chooseTeam(code: string, playerId: string, teamId: string) {
    await mutate(code, (room) => {
        const team = room.teams.find((t) => t.id === teamId);
        if (!room.players[playerId] || !team) return room;
        if (teamSize(room, teamId) >= capacityOf(room, team)) return room;
        return { ...room, players: { ...room.players, [playerId]: { ...room.players[playerId], team: teamId } } };
    });
}

// Mid-game, a team whose last member leaves disappears, score included; with no teams
// left the game is over. Only the explicit "Leave game" button lands here: a phone that
// just closes the browser never says goodbye, so its player (and team) stay.
export async function leaveRoom(code: string, playerId: string) {
    await mutate(code, (room) => {
        const players = { ...room.players };
        delete players[playerId];
        let next: Room = { ...room, players };
        if (room.status === "board" || room.status === "question") {
            const alive = next.teams.filter((t) => Object.values(players).some((p) => p.team === t.id));
            if (alive.length < next.teams.length) next = { ...next, teams: alive };
            if (alive.length === 0) {
                next = {
                    ...next,
                    status: "end",
                    gameEndsAt: null,
                    activeTile: null,
                    readEndsAt: null,
                    optionsAt: null,
                    questionEndsAt: null,
                    revealed: false,
                    answers: [],
                };
            }
        }
        return next;
    });
}

// Every team answers; the first teammate to tap answers for the whole team. Points are
// given in revealAnswer, so speed between teams doesn't matter. No clock is checked here:
// the window is open from the host's showOptions until the host's revealAnswer, which
// keeps phones with wrong clocks or slower networks on equal terms.
export async function answer(code: string, playerId: string, choice: string) {
    await traced(`answer by ${playerId}: "${choice}"`, () =>
        mutate(code, (room) => {
            const player = room.players[playerId];
            const tile = activeTileOf(room);
            if (!tile || !player || player.team === null) return room;
            if (!optionsVisible(room) || room.revealed) return room;
            if (room.answers.some((a) => a.team === player.team)) return room;

            const entry: Answer = { playerId, name: player.name, team: player.team, choice, correct: choice === tile.answer, at: Date.now() };
            return { ...room, answers: [...room.answers, entry] };
        })
    );
}

// ----- Helpers for the screens ---------------------------------------------

export function activeTileOf(room: Room) {
    if (room.status !== "question" || !room.activeTile) return null;
    return room.board[room.activeTile.col].tiles[room.activeTile.row];
}

export function tilesLeft(room: Room): number {
    return room.board.flatMap((c) => c.tiles).filter((t) => !t.used).length;
}

// True while the open question is the board's last unused tile (tiles are consumed by closeTile)
export function isLastTile(room: Room): boolean {
    return room.status === "question" && tilesLeft(room) === 1;
}

// False during the reading time at the start of a question. No clock involved:
// the host screen flips it with showOptions and Firestore pushes it to every phone.
export function optionsVisible(room: Room): boolean {
    return room.optionsAt !== null;
}

// The answer a team gave for the current question, if any
export function answerOf(room: Room, teamId: string | null): Answer | null {
    return teamId === null ? null : (room.answers.find((a) => a.team === teamId) ?? null);
}

// Teams with players, and how many of them have answered the current question
export function answerProgress(room: Room): { answered: number; total: number } {
    const teams = activeTeams(room);
    return { answered: teams.filter((t) => answerOf(room, t.id) !== null).length, total: teams.length };
}

// The host screen reveals as soon as this is true, so nobody waits for the timer
export function allTeamsAnswered(room: Room): boolean {
    const { answered, total } = answerProgress(room);
    return total > 0 && answered === total;
}
