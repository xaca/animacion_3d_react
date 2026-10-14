import { deleteDoc, doc, getDoc, onSnapshot, runTransaction, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { allUsed, markUsed, type Category } from "../questions";
import { buildBoardFrom, loadQuestions } from "../questionService";
import { TOPICS } from "../topics";
import type { Team } from "../teams";
import { pickTeamNames } from "../teamNames";

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
};

export const TIMER_CHOICES = [15, 20, 30];
export const TEAM_COUNT_CHOICES = [2, 3, 4, 5, 6, 7, 8, 9, 10];
export const TEAM_SIZE_CHOICES = [1, 2, 3, 4, 5, 6];
export const START_SECONDS_CHOICES = [10, 15, 30, 60];
export const READ_SECONDS_CHOICES = [0, 5, 10, 15];
const DEFAULT_TEAM_COUNT = 3;
const DEFAULT_TEAM_SIZE = 3;
const DEFAULT_START_SECONDS = 30;
const DEFAULT_READ_SECONDS = 10;

// ---------------------------------------------------------------------------
// Firestore backend: each room is one document, rooms/{code}. Every change runs
// in a transaction, so simultaneous writes (e.g. two correct answers) never overwrite each other.
// ---------------------------------------------------------------------------

const CODE_LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ";

const roomRef = (code: string) => doc(db, "rooms", code);

async function mutate(code: string, change: (room: Room) => Room) {
    await runTransaction(db, async (tx) => {
        const snap = await tx.get(roomRef(code));
        if (!snap.exists()) throw new Error(`Room ${code} not found`);
        tx.set(roomRef(code), change(snap.data() as Room));
    });
}

function randomId(length: number, letters = "abcdefghijklmnopqrstuvwxyz0123456789") {
    return Array.from({ length }, () => letters[Math.floor(Math.random() * letters.length)]).join("");
}

// ----- Reading -------------------------------------------------------------

export function subscribeRoom(code: string, cb: (room: Room | null) => void): () => void {
    return onSnapshot(
        roomRef(code),
        (snap) => cb(snap.exists() ? (snap.data() as Room) : null),
        (error) => {
            console.error(`Could not load room ${code}`, error);
            cb(null);
        }
    );
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
        status: "setup",
        topic: TOPICS[0].id,
        timerSeconds: 20,
        maxTeamSize: DEFAULT_TEAM_SIZE,
        startSeconds: DEFAULT_START_SECONDS,
        readSeconds: DEFAULT_READ_SECONDS,
        teams: newTeams(DEFAULT_TEAM_COUNT, []),
        startsAt: null,
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

export async function deleteRoom(code: string) {
    await deleteDoc(roomRef(code));
}

function teamSize(room: Room, teamId: string): number {
    return Object.values(room.players).filter((p) => p.team === teamId).length;
}

// Teams with at least one player: the ones that can play
function activeTeams(room: Room): Team[] {
    return room.teams.filter((t) => teamSize(room, t.id) > 0);
}

// Why the host can't press Start yet, or null when they can. Shared by UI and startGame.
export function startProblem(room: Room): string | null {
    if (activeTeams(room).length < 2) return "You need at least 2 teams with players";
    if (room.teams.some((t) => teamSize(room, t.id) > room.maxTeamSize)) return `Teams can have at most ${room.maxTeamSize} players`;
    return null;
}

// Test player for trying the game with one phone: joins the team with fewest players
// that still has room. Ignored when every team is full.
export async function addBot(code: string) {
    await mutate(code, (room) => {
        const open = room.teams.filter((t) => teamSize(room, t.id) < room.maxTeamSize);
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

export async function setReadSeconds(code: string, readSeconds: number) {
    await mutate(code, (room) => ({ ...room, readSeconds }));
}

const beforeGame = (room: Room) => room.status === "setup" || room.status === "lobby";

// Adds teams at the end or removes them from the end; players on a removed team pick again.
// Before the game only: mid-game the scores and answers refer to the current teams.
export async function setTeamCount(code: string, count: number) {
    await mutate(code, (room) => {
        if (!beforeGame(room) || count < 2) return room;
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
    const board = buildBoardFrom(await loadQuestions(before.topic));
    await mutate(code, (room) => {
        const teams = activeTeams(room);
        return {
            ...room,
            status: "board",
            board,
            teams: teams.map((t) => ({ ...t, score: 0 })),
            startsAt: null,
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
    await mutate(code, (room) => {
        if (room.status !== "question" || optionsVisible(room)) return room;
        const now = Date.now();
        return { ...room, optionsAt: now, questionEndsAt: now + room.timerSeconds * 1000 };
    });
}

// Ends the question: locks answers, shows the correct option everywhere and gives the
// tile's points to EVERY team that answered correctly. Called by the host screen when
// all teams have answered, when its timer ends, or by "Show answer". Runs once: a
// second call (e.g. timer and "all answered" at the same moment) changes nothing.
export async function revealAnswer(code: string) {
    await mutate(code, (room) => {
        const tile = activeTileOf(room);
        if (!tile || room.revealed) return room;
        const winners = new Set(room.answers.filter((a) => a.correct).map((a) => a.team));
        return {
            ...room,
            revealed: true,
            teams: room.teams.map((t) => (winners.has(t.id) ? { ...t, score: t.score + tile.value } : t)),
        };
    });
}

export async function closeTile(code: string) {
    await mutate(code, (room) => {
        if (!room.activeTile) return room;
        const board = markUsed(room.board, room.activeTile.col, room.activeTile.row);
        return {
            ...room,
            board,
            status: allUsed(board) ? "end" : "board",
            activeTile: null,
            readEndsAt: null,
            optionsAt: null,
            questionEndsAt: null,
            revealed: false,
            answers: [],
        };
    });
}

export async function backToLobby(code: string) {
    await mutate(code, (room) => ({
        ...room,
        status: "lobby",
        startsAt: null,
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
        if (!room.players[playerId] || !room.teams.some((t) => t.id === teamId)) return room;
        if (teamSize(room, teamId) >= room.maxTeamSize) return room;
        return { ...room, players: { ...room.players, [playerId]: { ...room.players[playerId], team: teamId } } };
    });
}

export async function leaveRoom(code: string, playerId: string) {
    await mutate(code, (room) => {
        const players = { ...room.players };
        delete players[playerId];
        return { ...room, players };
    });
}

// Every team answers; the first teammate to tap answers for the whole team. Points are
// given in revealAnswer, so speed between teams doesn't matter. No clock is checked here:
// the window is open from the host's showOptions until the host's revealAnswer, which
// keeps phones with wrong clocks or slower networks on equal terms.
export async function answer(code: string, playerId: string, choice: string) {
    await mutate(code, (room) => {
        const player = room.players[playerId];
        const tile = activeTileOf(room);
        if (!tile || !player || player.team === null) return room;
        if (!optionsVisible(room) || room.revealed) return room;
        if (room.answers.some((a) => a.team === player.team)) return room;

        const entry: Answer = { playerId, name: player.name, team: player.team, choice, correct: choice === tile.answer, at: Date.now() };
        return { ...room, answers: [...room.answers, entry] };
    });
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
