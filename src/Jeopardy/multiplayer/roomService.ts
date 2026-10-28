import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, runTransaction, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { allUsed, markUsed, shuffle, type Category } from "../questions";
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

// One per TEAM per question: whoever taps first answers for the whole team.
// `gained` and `bonuses` are stamped by revealAnswer: the points this answer moved
// (negative with 💀 on) and the extra labels ("🔥 ×2", "⚡ +100"), for the result screens.
export type Answer = {
    playerId: string;
    name: string;
    team: string | null;
    choice: string;
    correct: boolean;
    at: number;
    gained?: number;
    bonuses?: string[];
};

// Optional game modes, all off by default (missing = classic game). Set in the
// "Extras" setup step; revealAnswer applies them when giving points.
export type Extras = {
    speedBonus?: boolean; // ⚡ first correct team (Firestore commit order) gets +50% of the tile value
    streak?: boolean; // 🔥 3 correct in a row → the team's correct answers are worth double until it misses
    penalty?: boolean; // 💀 a wrong answer costs half the tile value (never below 0)
    comeback?: boolean; // 🚀 bottom-half teams earn +25% on correct answers, the strictly-last one +50%
    powerUps?: boolean; // 🃏 teams get one-shot powers on their phones, used during the reading time
    leaderTax?: boolean; // 👑 the leading team keeps 80% of what it gains
};
export const EXTRA_KEYS = ["speedBonus", "streak", "penalty", "comeback", "powerUps", "leaderTax"] as const;
export type ExtraKey = (typeof EXTRA_KEYS)[number];
export const EXTRA_INFO: Record<ExtraKey, { icon: string; name: string }> = {
    speedBonus: { icon: "⚡", name: "Speed bonus" },
    streak: { icon: "🔥", name: "Hot streak" },
    penalty: { icon: "💀", name: "Penalty" },
    comeback: { icon: "🚀", name: "Comeback" },
    powerUps: { icon: "🃏", name: "Power-ups" },
    leaderTax: { icon: "👑", name: "Leader tax" },
};
// Correct answers in a row to set a team "on fire"
export const STREAK_FIRE = 3;

// 🃏 team power-ups: declared from a phone during the reading time (one per team per
// question), applied by revealAnswer. A used power recharges after POWER_RECHARGE closed
// questions (room.playedCount — never real time, the host screen is the only clock); trailing
// teams recharge faster (RECHARGE). 🏴‍☠️ and 🧊 aim at a team the student picks, always one
// AHEAD of theirs, so the powers pull the class together instead of feeding the leader.
export const POWER_KEYS = ["fifty", "double", "shield", "steal", "freeze"] as const;
export type PowerId = (typeof POWER_KEYS)[number];
export const POWER_INFO: Record<PowerId, { icon: string; name: string; hint: string }> = {
    fifty: { icon: "🎯", name: "50/50", hint: "Strikes out 2 wrong options for your team" },
    double: { icon: "✖2", name: "Double", hint: "This question's points count double (×3 on fire)" },
    shield: { icon: "🛡️", name: "Shield", hint: "Your team can't lose points this question" },
    steal: { icon: "🏴‍☠️", name: "Steal", hint: "Pick a team ahead of you: answer right and take half the value from it (all of it if you're last)" },
    freeze: { icon: "🧊", name: "Freeze", hint: "Pick a team ahead of you: whatever it wins this question is cut in half" },
};
// Powers that need a target team (picked on the phone, validated in activatePower)
export const TARGET_POWERS: readonly PowerId[] = ["steal", "freeze"];
// Questions until a used power is back, by the team's place: the last recharges fastest
export const RECHARGE = { last: 2, middle: 3, leader: 5 } as const;
// 🆘 a team this many max-value questions behind the leader gets all its powers back (once per game)
export const RESCUE_GAP_TILES = 2;

// One activated power-up: `removed` carries the 50/50's struck options, picked when the
// power is used so the whole team sees the same two; `target` is the team 🏴‍☠️/🧊 aims at.
export type Effect = { team: string; power: PowerId; removed?: string[]; target?: string };

// Build id (ms timestamp as a string). "dev" when not built by Vite (test scripts).
export const APP_VERSION = typeof __APP_VERSION__ === "string" ? __APP_VERSION__ : "dev";

// Stored as the Firestore document rooms/{code}.
export type Room = {
    code: string;
    version: string; // APP_VERSION of the host that created the room
    status: RoomStatus;
    topic: string; // TOPICS id (or custom-… for uploaded topics); the board is built from its questions on start
    topicName?: string; // display name stored in the room, so phones never need the custom_topics collection
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
    extras?: Extras; // optional game modes ("Extras" setup step). Missing = all off, classic game
    effects?: Effect[]; // 🃏 power-ups declared for the current question; cleared with the answers
    playedCount?: number; // closed questions this game, the power-up recharge clock. Missing = 0
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
export const extrasOf = (room: Room): Extras => room.extras ?? {};
// The room's active extras, for the "what's on" icon rows on phones and host
export const activeExtras = (room: Room): ExtraKey[] => EXTRA_KEYS.filter((k) => extrasOf(room)[k] === true);

// ----- 🃏 power-up helpers (shared by the phone's PowerBar and usePower) -----
export const playedCountOf = (room: Room) => room.playedCount ?? 0;
// The power-up this team declared for the current question, if any
export function effectOf(room: Room, teamId: string | null): Effect | null {
    return teamId === null ? null : ((room.effects ?? []).find((e) => e.team === teamId) ?? null);
}
// The team's place for the balance rules. All tied (game start) counts as the middle.
export function placeOf(room: Room, team: Team): keyof typeof RECHARGE {
    const scores = room.teams.map((t) => t.score);
    const max = Math.max(...scores);
    const min = Math.min(...scores);
    if (max === min) return "middle";
    return team.score === max ? "leader" : team.score === min ? "last" : "middle";
}
export const rechargeOf = (room: Room, team: Team) => RECHARGE[placeOf(room, team)];
// Questions to wait until this power is usable again; 0 = ready now. Follows the team's
// CURRENT place, so falling behind also speeds up a power that is already recharging.
export function powerReadyIn(room: Room, team: Team, power: PowerId): number {
    const usedAt = team.powers?.[power];
    return usedAt === undefined ? 0 : Math.max(0, rechargeOf(room, team) - (playedCountOf(room) - usedAt));
}
// Teams 🏴‍☠️/🧊 may aim at: only those with more points (the leader has none to pick)
export const targetsOf = (room: Room, team: Team) => room.teams.filter((t) => t.id !== team.id && t.score > team.score);
// 🆘 gap to the leader that triggers the rescue: RESCUE_GAP_TILES × the board's top value
export function rescueGapOf(room: Room) {
    const top = Math.max(0, ...room.board.flatMap((c) => c.tiles.map((t) => t.value)));
    return RESCUE_GAP_TILES * top;
}
// 🆘 this team was rescued at the question being shown (rescued stamps the playedCount)
export const rescuedNow = (room: Room, team: Team) => room.revealed && team.rescued === playedCountOf(room);
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
        topicName: TOPICS[0].name,
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

// `topicName` keeps the display name in the room (uploaded topics aren't in topics.ts)
export async function setTopic(code: string, topic: string, topicName?: string) {
    const name = topicName ?? TOPICS.find((t) => t.id === topic)?.name ?? topic;
    await mutate(code, (room) => ({ ...room, topic, topicName: name }));
}

// What to call the room's topic on any screen, without consulting any collection
export function topicLabel(room: Room): string {
    return room.topicName ?? TOPICS.find((t) => t.id === room.topic)?.name ?? room.topic;
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

// Extras only change before the game: mid-game the scoring rules must not move
export async function setExtra(code: string, key: ExtraKey, on: boolean) {
    await mutate(code, (room) => (!beforeGame(room) ? room : { ...room, extras: { ...extrasOf(room), [key]: on } }));
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
    topicName?: string; // display name for uploaded (custom-) topics
    readSeconds?: number;
    timerSeconds?: number;
    startSeconds?: number;
    maxTeamSize?: number;
    teamCount?: number;
    bonusTeams?: number; // how many teams get a +1 spot (class calculator leftovers)
    boardSize?: number;
    gameMinutes?: number;
    extras?: Extras;
};

// Several settings in one write (quick start, class calculator). Values outside the
// usual choices (e.g. from an old saved setup) are ignored, so the room stays valid.
export async function applySettings(code: string, s: SetupSettings) {
    const ok = (v: number | undefined, choices: number[]): v is number => v !== undefined && choices.includes(v);
    await mutate(code, (room) => {
        if (!beforeGame(room)) return room;
        let next = { ...room };
        // Built-in topics or teacher-uploaded ones (custom- prefix, questions live in Firestore)
        if (s.topic !== undefined && (TOPICS.some((t) => t.id === s.topic) || s.topic.startsWith("custom-"))) {
            next.topic = s.topic;
            next.topicName = s.topicName ?? TOPICS.find((t) => t.id === s.topic)?.name ?? s.topic;
        }
        if (ok(s.readSeconds, READ_SECONDS_CHOICES)) next.readSeconds = s.readSeconds;
        if (ok(s.timerSeconds, TIMER_CHOICES)) next.timerSeconds = s.timerSeconds;
        if (ok(s.startSeconds, START_SECONDS_CHOICES)) next.startSeconds = s.startSeconds;
        if (ok(s.maxTeamSize, TEAM_SIZE_CHOICES)) next.maxTeamSize = s.maxTeamSize;
        if (ok(s.boardSize, BOARD_SIZE_CHOICES)) next.boardSize = s.boardSize;
        if (ok(s.gameMinutes, GAME_MINUTES_CHOICES)) next.gameMinutes = s.gameMinutes;
        // Only the known extras, only booleans (a saved setup could carry anything)
        if (s.extras !== undefined) {
            const extras: Extras = {};
            for (const k of EXTRA_KEYS) if (typeof s.extras[k] === "boolean") extras[k] = s.extras[k];
            next.extras = extras;
        }
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
// without a team stay in the room and wait: they pick a team when the next game opens.
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
            // Fresh game: scores, the tie-breaker seq, streaks and power-ups start clean
            teams: teams.map((t) => {
                const { scoredSeq: _a, streak: _b, bestStreak: _c, powers: _d, rescued: _e, ...rest } = t;
                void _a;
                void _b;
                void _c;
                void _d;
                void _e;
                return { ...rest, score: 0 };
            }),
            startsAt: null,
            gameEndsAt: minutes > 0 ? Date.now() + minutes * 60_000 : null,
            activeTile: null,
            readEndsAt: null,
            optionsAt: null,
            questionEndsAt: null,
            revealed: false,
            answers: [],
            effects: [],
            playedCount: 0,
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
            effects: [],
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
// With extras on, each correct team's gain is: value, ×2/×3 for the ✖2 power-up, ×2 on
// fire (🔥), +50% of the value for the first correct (⚡), +25% for the bottom half and
// +50% for the strictly-last team (🚀), 80% of it for the leader (👑), halved when frozen
// (🧊); then 🏴‍☠️ steals from the team the stealer picked and 🛡️ cancels the team's
// losses. A wrong answer with 💀 costs half the value, never below 0. Places are the ones
// BEFORE this question. The applied delta and labels are stamped on the answer
// (gained/bonuses), so every screen shows the same breakdown. With 🃏 on, a team that ends
// RESCUE_GAP_TILES top values behind the leader gets 🆘: all its powers back, once a game.
export async function revealAnswer(code: string) {
    await traced("revealAnswer", () =>
        mutate(code, (room) => {
            const tile = activeTileOf(room);
            if (!tile || room.revealed) return room;
            const x = extrasOf(room);
            // Winners in answers-array order: that's the commit order in Firestore, the
            // only clock-free "who was first" we have. scoredSeq breaks podium ties
            // later (equal totals → whoever reached its score first, see rankTeams).
            const order = room.answers.filter((a) => a.correct).map((a) => a.team);
            const seqBase = Math.max(0, ...room.teams.map((t) => t.scoredSeq ?? 0));
            const n = room.teams.length;
            const above = (t: Team) => room.teams.filter((v) => v.score > t.score).length;
            const strictlyLast = (t: Team) => placeOf(room, t) === "last" && room.teams.filter((v) => v.score === t.score).length === 1;
            const effects = room.effects ?? [];
            const powerOf = (teamId: string) => effectOf(room, teamId)?.power ?? null;
            const shielded = (teamId: string) => powerOf(teamId) === "shield";
            const onFire = (t: Team) => (t.streak ?? 0) >= STREAK_FIRE;
            // 🧊 aimed teams, unless they raised their 🛡️ (several freezes still halve once)
            const frozen = new Set(effects.filter((e) => e.power === "freeze" && e.target && !shielded(e.target)).map((e) => e.target!));

            const results = new Map<string, { delta: number; bonuses: string[] }>();
            for (const t of room.teams) {
                const a = room.answers.find((ans) => ans.team === t.id);
                if (!a) continue;
                const bonuses: string[] = [];
                let delta = 0;
                if (a.correct) {
                    delta = tile.value;
                    if (powerOf(t.id) === "double") {
                        const mult = onFire(t) ? 3 : 2; // the power-up upgrades while on fire
                        delta *= mult;
                        bonuses.push(`✖${mult}`);
                    }
                    if (x.streak && onFire(t)) {
                        delta *= 2;
                        bonuses.push("🔥 ×2");
                    }
                    if (x.speedBonus && order[0] === t.id) {
                        const extra = Math.round(tile.value / 2);
                        delta += extra;
                        bonuses.push(`⚡ +${extra}`);
                    }
                    // 🚀 the bottom half of the table (all tied = nobody above = nobody gets it)
                    if (x.comeback && n > 1 && above(t) * 2 >= n) {
                        const extra = Math.round(tile.value / (strictlyLast(t) ? 2 : 4));
                        delta += extra;
                        bonuses.push(`🚀 +${extra}`);
                    }
                    if (x.leaderTax && placeOf(room, t) === "leader") {
                        const cut = Math.round(delta / 5);
                        delta -= cut;
                        bonuses.push(`👑 −${cut}`);
                    }
                    if (frozen.has(t.id)) {
                        const cut = Math.floor(delta / 2);
                        delta -= cut;
                        bonuses.push(`🧊 −${cut}`);
                    }
                } else if (x.penalty) {
                    const loss = Math.min(Math.floor(tile.value / 2), t.score); // floor at 0
                    delta = -loss;
                    if (loss > 0) bonuses.push(`💀 −${loss}`);
                }
                results.set(t.id, { delta, bonuses });
            }
            // A 🧊 that hit a 🛡️ shows on the shielded team
            for (const e of effects) {
                if (e.power === "freeze" && e.target && shielded(e.target)) results.get(e.target)?.bonuses.push("🛡️ 🧊");
            }

            // 🏴‍☠️ a correct stealer takes half the value from the team it picked (the whole
            // value if the stealer is last), unless that team raised its 🛡️. Victims that
            // didn't answer have no results entry; their loss goes in lostTo.
            const lostTo = new Map<string, number>();
            for (const e of effects) {
                if (e.power !== "steal" || !e.target || !order.includes(e.team)) continue;
                const r = results.get(e.team);
                const thief = room.teams.find((t) => t.id === e.team);
                const victim = room.teams.find((t) => t.id === e.target);
                if (!r || !thief || !victim || victim.score <= 0) continue;
                if (shielded(victim.id)) {
                    r.bonuses.push(`🏴‍☠️ 🛡️ ${victim.name}`);
                    results.get(victim.id)?.bonuses.push("🛡️");
                    continue;
                }
                const amount = Math.min(placeOf(room, thief) === "last" ? tile.value : Math.floor(tile.value / 2), victim.score);
                r.delta += amount;
                r.bonuses.push(`🏴‍☠️ +${amount} (${victim.name})`);
                const vr = results.get(victim.id);
                if (vr) {
                    vr.delta -= amount;
                    vr.bonuses.push(`🏴‍☠️ −${amount}`);
                } else {
                    lostTo.set(victim.id, (lostTo.get(victim.id) ?? 0) + amount);
                }
            }

            // 🛡️ cancels whatever loss is left for the shielded team (💀 included)
            for (const t of room.teams) {
                if (!shielded(t.id)) continue;
                const r = results.get(t.id);
                if (r && r.delta < 0) {
                    r.delta = 0;
                    r.bonuses.push("🛡️");
                }
            }

            const trackStreak = x.streak || x.powerUps;
            let teams = room.teams.map((t) => {
                const i = order.indexOf(t.id);
                let base: Team = t;
                // Streak is tracked while 🔥 or 🃏 are on; no answer breaks it too
                if (trackStreak) {
                    const streak = i !== -1 ? (t.streak ?? 0) + 1 : 0;
                    base = { ...t, streak, bestStreak: Math.max(t.bestStreak ?? 0, streak) };
                }
                const delta = (results.get(t.id)?.delta ?? 0) - (lostTo.get(t.id) ?? 0);
                if (delta === 0) return base;
                // Max 0: two stealers (or 💀 + a steal) could otherwise push a team negative
                return { ...base, score: Math.max(0, t.score + delta), ...(i !== -1 ? { scoredSeq: seqBase + 1 + i } : {}) };
            });
            // 🆘 with the NEW scores: far behind → every power ready again (once per game)
            if (x.powerUps) {
                const gap = rescueGapOf(room);
                const top = Math.max(...teams.map((t) => t.score));
                teams = teams.map((t) => {
                    if (gap === 0 || t.rescued !== undefined || top - t.score < gap) return t;
                    const { powers: _p, ...rest } = t;
                    void _p;
                    return { ...rest, rescued: playedCountOf(room) };
                });
            }
            return {
                ...room,
                revealed: true,
                answers: room.answers.map((a) => {
                    const r = a.team !== null ? results.get(a.team) : undefined;
                    return r ? { ...a, gained: r.delta, bonuses: r.bonuses } : a;
                }),
                teams,
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
            effects: [],
            playedCount: playedCountOf(room) + 1, // the power-up recharge clock
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
            teams: room.teams.map((t) => {
                const { scoredSeq: _a, streak: _b, bestStreak: _c, powers: _d, rescued: _e, ...rest } = t;
                void _a;
                void _b;
                void _c;
                void _d;
                void _e;
                return { ...rest, score: 0 };
            }),
            startsAt: null,
            gameEndsAt: null,
            activeTile: null,
            readEndsAt: null,
            optionsAt: null,
            questionEndsAt: null,
            revealed: false,
            answers: [],
            effects: [],
            playedCount: 0,
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
        return { ...room, status: "end", gameEndsAt: null, activeTile: null, readEndsAt: null, optionsAt: null, questionEndsAt: null, revealed: false, answers: [], effects: [] };
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
        effects: [],
    }));
}

// ----- Player actions ------------------------------------------------------

export const ROOM_NOT_OPEN = "Room not open yet";
export const GAME_IN_PROGRESS = "Game in progress";

// Joining is only possible in the waiting room (start countdown included). Once the game
// started, and on the podium, nobody new gets in — not even someone who left: they wait
// for the teacher to open the next game. A refresh is not a rejoin (the player id
// survives in sessionStorage), so a reloaded phone keeps playing.
export async function joinRoom(code: string, name: string): Promise<Player> {
    const player: Player = { id: randomId(10), name, team: null };
    await mutate(code, (room) => {
        if (room.status === "setup") throw new Error(ROOM_NOT_OPEN);
        if (room.status !== "lobby") throw new Error(GAME_IN_PROGRESS);
        return { ...room, players: { ...room.players, [player.id]: player } };
    });
    return player;
}

// Puts the player on a team (leaving their current one). Only in the waiting room: teams
// are fixed from the start of the game until the next game opens (no switching mid-game
// or on the podium). Ignored when the team is gone or full.
export async function chooseTeam(code: string, playerId: string, teamId: string) {
    await mutate(code, (room) => {
        if (room.status !== "lobby") return room;
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

// 🃏 Declares a power-up for the player's team, only during the reading time (before the
// options appear) and one per team per question. The transaction re-checks everything, so
// two teammates tapping together still spend a single power. 🏴‍☠️/🧊 need a `target` that
// is ahead of the team right now. (Named activatePower, not usePower: the react-hooks lint
// treats any use* call inside a component as a hook.)
export async function activatePower(code: string, playerId: string, power: PowerId, target?: string) {
    await traced(`activatePower ${power} by ${playerId}`, () =>
        mutate(code, (room) => {
            const tile = activeTileOf(room);
            const player = room.players[playerId];
            if (!extrasOf(room).powerUps || !tile || !player || player.team === null) return room;
            if (optionsVisible(room) || room.revealed) return room; // reading time only
            const team = room.teams.find((t) => t.id === player.team);
            if (!team || effectOf(room, team.id) !== null) return room;
            if (powerReadyIn(room, team, power) > 0) return room;
            const effect: Effect = { team: team.id, power };
            if (TARGET_POWERS.includes(power)) {
                if (!targetsOf(room, team).some((t) => t.id === target)) return room;
                effect.target = target;
            }
            if (power === "fifty") effect.removed = shuffle(tile.options.filter((o) => o !== tile.answer)).slice(0, 2);
            return {
                ...room,
                effects: [...(room.effects ?? []), effect],
                teams: room.teams.map((t) => (t.id === team.id ? { ...t, powers: { ...t.powers, [power]: playedCountOf(room) } } : t)),
            };
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
