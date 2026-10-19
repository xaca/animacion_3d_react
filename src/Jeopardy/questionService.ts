import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { pickOne, shuffle, VALUES, type Category, type Tile } from "./questions";

// One Firestore document per question in `questions`, uploaded by `npm run seed`
// from src/Jeopardy/content/. Read-only for the app (see firestore.rules).
export type QuestionDoc = {
    topic: string;
    category: string;
    level: number; // 1 (200 points) … 5 (1000)
    question: string;
    code?: string;
    answer: string;
    wrong: string[];
};

export async function loadQuestions(topic: string): Promise<QuestionDoc[]> {
    const snap = await getDocs(query(collection(db, "questions"), where("topic", "==", topic)));
    return snap.docs.map((d) => d.data() as QuestionDoc);
}

// Short games keep the difficulty spread: a 3×3 board plays levels 1, 3 and 5;
// 2×2 one easy and one decider; 1×1 is a single mid-level lightning question
const LEVELS_BY_SIZE: Record<number, number[]> = { 1: [3], 2: [1, 5], 3: [1, 3, 5], 4: [1, 2, 4, 5], 5: [1, 2, 3, 4, 5] };

// `size` random categories of the topic, one random question per picked level
export function buildBoardFrom(questions: QuestionDoc[], size = 5): Category[] {
    const byCategory = new Map<string, QuestionDoc[]>();
    for (const q of questions) byCategory.set(q.category, [...(byCategory.get(q.category) ?? []), q]);
    if (byCategory.size === 0) throw new Error("No questions found for this topic");
    const levels = LEVELS_BY_SIZE[size] ?? LEVELS_BY_SIZE[5];

    return shuffle([...byCategory.entries()])
        .slice(0, size)
        .map(([name, qs]) => ({
        name,
        tiles: levels.map((level) => {
            const value = VALUES[level - 1];
            const pool = qs.filter((q) => q.level === level);
            if (pool.length === 0) throw new Error(`${name} has no level ${level} questions`);
            const q = pickOne(pool);
            const tile: Tile = { question: q.question, answer: q.answer, options: shuffle([q.answer, ...q.wrong]), value, used: false };
            if (q.code) tile.code = q.code; // never store undefined: Firestore rejects it
            return tile;
        }),
        }));
}
