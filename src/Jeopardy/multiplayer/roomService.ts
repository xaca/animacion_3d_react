import { deleteDoc, doc, getDoc, onSnapshot, runTransaction, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { allUsed, buildBoard, markUsed, type Category } from "../questions";
import { makeTeams, type Team } from "../teams";

export type RoomStatus = "lobby" | "board" | "question" | "end";

export type Player = { id: string; name: string; team: number | null };

// One per player per question: players get a single try
export type Answer = { playerId: string; name: string; team: number | null; choice: string; correct: boolean; at: number };

// Stored as the Firestore document rooms/{code}.
export type Room = {
    code: string;
    status: RoomStatus;
    teams: Team[];
    board: Category[];
    activeTile: { col: number; row: number } | null;
    answers: Answer[];
    players: Record<string, Player>;
};

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

export async function createRoom(): Promise<string> {
    let code = randomId(4, CODE_LETTERS);
    while ((await getDoc(roomRef(code))).exists()) code = randomId(4, CODE_LETTERS);
    await setDoc(roomRef(code), {
        code,
        status: "lobby",
        teams: makeTeams(3),
        board: buildBoard(),
        activeTile: null,
        answers: [],
        players: {},
    });
    return code;
}

export async function deleteRoom(code: string) {
    await deleteDoc(roomRef(code));
}

export async function setTeamCount(code: string, count: number) {
    await mutate(code, (room) => ({
        ...room,
        teams: makeTeams(count),
        // Players on a team that no longer exists must pick again
        players: Object.fromEntries(
            Object.entries(room.players).map(([id, p]) => [
                id,
                p.team !== null && p.team >= count ? { ...p, team: null } : p,
            ])
        ),
    }));
}

export async function startGame(code: string) {
    await mutate(code, (room) => ({
        ...room,
        status: "board",
        board: buildBoard(),
        teams: makeTeams(room.teams.length),
        activeTile: null,
        answers: [],
    }));
}

export async function openTile(code: string, col: number, row: number) {
    await mutate(code, (room) => ({ ...room, status: "question", activeTile: { col, row }, answers: [] }));
}

export async function closeTile(code: string) {
    await mutate(code, (room) => {
        if (!room.activeTile) return room;
        const board = markUsed(room.board, room.activeTile.col, room.activeTile.row);
        return { ...room, board, status: allUsed(board) ? "end" : "board", activeTile: null, answers: [] };
    });
}

export async function changeScore(code: string, teamIndex: number, delta: number) {
    await mutate(code, (room) => ({
        ...room,
        teams: room.teams.map((t, i) => (i === teamIndex ? { ...t, score: t.score + delta } : t)),
    }));
}

export async function backToLobby(code: string) {
    await mutate(code, (room) => ({ ...room, status: "lobby", activeTile: null, answers: [] }));
}

// ----- Player actions ------------------------------------------------------

export async function joinRoom(code: string, name: string): Promise<Player> {
    const player: Player = { id: randomId(10), name, team: null };
    await mutate(code, (room) => ({ ...room, players: { ...room.players, [player.id]: player } }));
    return player;
}

export async function chooseTeam(code: string, playerId: string, team: number) {
    await mutate(code, (room) => ({
        ...room,
        players: { ...room.players, [playerId]: { ...room.players[playerId], team } },
    }));
}

export async function leaveRoom(code: string, playerId: string) {
    await mutate(code, (room) => {
        const players = { ...room.players };
        delete players[playerId];
        return { ...room, players };
    });
}

// The first correct answer wins the tile's points for the player's team.
// Runs in a transaction, so if two players are right at the same moment only one wins.
export async function answer(code: string, playerId: string, choice: string) {
    await mutate(code, (room) => {
        const player = room.players[playerId];
        const tile = activeTileOf(room);
        if (!tile || !player || winnerOf(room) || room.answers.some((a) => a.playerId === playerId)) return room;

        const correct = choice === tile.answer;
        const entry: Answer = { playerId, name: player.name, team: player.team, choice, correct, at: Date.now() };
        return {
            ...room,
            answers: [...room.answers, entry],
            teams: room.teams.map((t, i) => (correct && i === player.team ? { ...t, score: t.score + tile.value } : t)),
        };
    });
}

// ----- Helpers for the screens ---------------------------------------------

export function activeTileOf(room: Room) {
    if (room.status !== "question" || !room.activeTile) return null;
    return room.board[room.activeTile.col].tiles[room.activeTile.row];
}

export function winnerOf(room: Room): Answer | null {
    return room.answers.find((a) => a.correct) ?? null;
}

// True when every player on a team has answered and nobody got it right
export function nobodyGotIt(room: Room): boolean {
    const playing = Object.values(room.players).filter((p) => p.team !== null);
    return !winnerOf(room) && playing.length > 0 && playing.every((p) => room.answers.some((a) => a.playerId === p.id));
}
