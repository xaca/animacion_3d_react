import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { TOPICS } from "./topics";
import type { QuestionSource, RoomQuestion, TingoQuestionDoc } from "./types";
import { shuffle } from "./types";

// Default question source: the `tingo_questions` collection, read-only for the app and
// uploaded by `npm run seed:tingo`. TingoTango takes any QuestionSource as a prop, so a
// future integration (e.g. reading Jeopardy's `questions`) is just another source.
export const firestoreQuestionSource: QuestionSource = {
    topics: TOPICS,
    async load(topic: string): Promise<TingoQuestionDoc[]> {
        const snap = await getDocs(query(collection(db, "tingo_questions"), where("topic", "==", topic)));
        return snap.docs.map((d) => d.data() as TingoQuestionDoc);
    },
};

// The round queue: every question of the topic, shuffled, options shuffled per question
export function buildQueue(questions: TingoQuestionDoc[]): RoomQuestion[] {
    if (questions.length === 0) throw new Error("No questions found for this topic");
    return shuffle(questions).map((q) => {
        const item: RoomQuestion = { question: q.question, answer: q.answer, options: shuffle([q.answer, ...q.wrong]) };
        if (q.code) item.code = q.code; // never store undefined: Firestore rejects it
        return item;
    });
}
