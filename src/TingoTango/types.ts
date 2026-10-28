// Shared types and constants for TingoTango. The Firestore room type lives in
// roomService.ts (same split as Jeopardy); here goes everything both sides of the
// question pipeline (content → seed → Firestore → room) agree on.

// One Firestore document in `tingo_questions`, uploaded by `npm run seed:tingo`.
// Same shape as Jeopardy's `questions` docs, so a future source could read those too.
export type TingoQuestionDoc = {
    topic: string;
    category: string;
    level: number; // 1 (easy) … 5 (hard); the queue mixes all levels
    question: string;
    code?: string;
    answer: string;
    wrong: string[];
};

// A question inside the room document: options already shuffled, ready to show
export type RoomQuestion = {
    question: string;
    code?: string;
    answer: string;
    options: string[];
};

// custom: uploaded by the teacher from the app (📥 Subir tema), not seeded
export type TopicInfo = { id: string; name: string; tagline: string; custom?: true };

// Where the questions come from. The default reads `tingo_questions` (questionSource.ts);
// passing another source (e.g. one reading Jeopardy's collection) needs no changes here.
// `subscribeTopics` (optional): topics that can appear live, added after the fixed ones.
export type QuestionSource = {
    topics: TopicInfo[];
    load(topic: string): Promise<TingoQuestionDoc[]>;
    subscribeTopics?(cb: (topics: TopicInfo[]) => void): () => void;
};

// Individual players, no teams: the ball picks one person.
// `scoredRound`: the round of their last correct answer — the podium tie-breaker
// (equal totals → whoever reached that score first).
export type TingoPlayer = { id: string; name: string; score: number; scoredRound?: number; bot?: true };

export const POINTS = 100; // per correct answer
export const READ_SECONDS_CHOICES = [0, 5, 10, 15];
export const ANSWER_SECONDS_CHOICES = [10, 15, 20, 30];
export const QUESTION_COUNT_CHOICES = [5, 10, 15, 20, 0]; // per game; 0 = the whole bank
export const LETTERS = ["A", "B", "C", "D"];

// Auto-stop window: the round stops itself at a random moment in this range
// unless the teacher presses ¡Tango! first
export const TINGO_MIN_MS = 4000;
export const TINGO_MAX_MS = 10000;

export function shuffle<T>(items: T[]): T[] {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

export function pickOne<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
}

// Did anyone score at all? When not, the end screens show "la bolita ganó" instead of
// celebrating a podium full of zeros
export function hasScores(players: TingoPlayer[]): boolean {
    return players.some((p) => p.score > 0);
}

// ✊✋✌️ tie-break for the podium (tiebreak.ts). Played ONCE inside the transaction that
// ends the game and stored in the room, so every screen replays the same throws.
export type Sign = "piedra" | "papel" | "tijera";
export type Tiebreak = {
    place: number; // the podium place this decided (1..3)
    score: number; // the tied score
    contenders: { id: string; name: string }[]; // names kept: someone may leave the podium screen
    throws: Record<string, Sign>[]; // one entry per throw, signs of the players still in
    winner: string; // player id
};

// Ranking: score desc; equal scores are ordered by the ✊✋✌️ tie-breaks when there are
// any (only podium places get one), otherwise they SHARE the place — no hidden criteria.
export function rankPlayers(players: TingoPlayer[], tiebreaks: Tiebreak[] = []): { player: TingoPlayer; place: number }[] {
    const won = new Map(tiebreaks.map((t) => [t.winner, t.place]));
    const key = (p: TingoPlayer) => won.get(p.id) ?? Number.MAX_SAFE_INTEGER;
    const sorted = [...players].sort((a, b) => b.score - a.score || key(a) - key(b) || a.name.localeCompare(b.name));
    return sorted.map((player) => {
        // Same score and same tie-break key as the first of its group → same place
        const first = sorted.findIndex((p) => p.score === player.score && key(p) === key(player));
        return { player, place: first + 1 };
    });
}
