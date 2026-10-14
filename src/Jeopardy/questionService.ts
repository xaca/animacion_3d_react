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

// Every category of the topic (in random order), one random question per value
export function buildBoardFrom(questions: QuestionDoc[]): Category[] {
    const byCategory = new Map<string, QuestionDoc[]>();
    for (const q of questions) byCategory.set(q.category, [...(byCategory.get(q.category) ?? []), q]);
    if (byCategory.size === 0) throw new Error("No questions found for this topic");

    return shuffle([...byCategory.entries()]).map(([name, qs]) => ({
        name,
        tiles: VALUES.map((value, i) => {
            const pool = qs.filter((q) => q.level === i + 1);
            if (pool.length === 0) throw new Error(`${name} has no level ${i + 1} questions`);
            const q = pickOne(pool);
            const tile: Tile = { question: q.question, answer: q.answer, options: shuffle([q.answer, ...q.wrong]), value, used: false };
            if (q.code) tile.code = q.code; // never store undefined: Firestore rejects it
            return tile;
        }),
    }));
}
