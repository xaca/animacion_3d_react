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

export type TopicInfo = { id: string; name: string; tagline: string };

// Where the questions come from. The default reads `tingo_questions` (questionSource.ts);
// passing another source (e.g. one reading Jeopardy's collection) needs no changes here.
export type QuestionSource = {
    topics: TopicInfo[];
    load(topic: string): Promise<TingoQuestionDoc[]>;
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

// Strict ranking, no shared places (a single 1st, 2nd and 3rd on the podium):
// score desc, then whoever reached that score in an earlier round, then name.
export function rankPlayers(players: TingoPlayer[]): { player: TingoPlayer; place: number }[] {
    const sorted = [...players].sort(
        (a, b) =>
            b.score - a.score ||
            (a.scoredRound ?? Number.MAX_SAFE_INTEGER) - (b.scoredRound ?? Number.MAX_SAFE_INTEGER) ||
            a.name.localeCompare(b.name)
    );
    return sorted.map((player, i) => ({ player, place: i + 1 }));
}
