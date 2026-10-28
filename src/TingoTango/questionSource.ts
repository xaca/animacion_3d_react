import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { db } from "../lib/firebase";
import { asTopicInfo, subscribeCustomTopics } from "./customTopics";
import { TOPICS } from "./topics";
import type { QuestionSource, RoomQuestion, TingoQuestionDoc, TopicInfo } from "./types";
import { shuffle } from "./types";

// Default question source: the `tingo_questions` collection, read-only for the app and
// uploaded by `npm run seed:tingo`, plus the teacher's uploaded `custom-` topics (same
// collection). TingoTango takes any QuestionSource as a prop, so a future integration
// (e.g. reading Jeopardy's `questions`) is just another source.
export const firestoreQuestionSource: QuestionSource = {
    topics: TOPICS,
    async load(topic: string): Promise<TingoQuestionDoc[]> {
        const snap = await getDocs(query(collection(db, "tingo_questions"), where("topic", "==", topic)));
        return snap.docs.map((d) => d.data() as TingoQuestionDoc);
    },
    subscribeTopics: (cb) => subscribeCustomTopics((list) => cb(list.map(asTopicInfo))),
};

// Every topic of a source: the fixed ones first, then the live ones (host screens only)
export function useTopics(source: QuestionSource): TopicInfo[] {
    const [live, setLive] = useState<TopicInfo[]>([]);
    useEffect(() => source.subscribeTopics?.(setLive), [source]);
    return useMemo(() => [...source.topics, ...live], [source.topics, live]);
}

// The round queue: every question of the topic, shuffled, options shuffled per question
export function buildQueue(questions: TingoQuestionDoc[]): RoomQuestion[] {
    if (questions.length === 0) throw new Error("Este tema no tiene preguntas (¿lo borraron?). Elige otro en ⚙ Ajustes.");
    return shuffle(questions).map((q) => {
        const item: RoomQuestion = { question: q.question, answer: q.answer, options: shuffle([q.answer, ...q.wrong]) };
        if (q.code) item.code = q.code; // never store undefined: Firestore rejects it
        return item;
    });
}
