import { collection, doc, getDocs, onSnapshot, query, where, writeBatch } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { slug, type FlatQuestion } from "./contentValidation";
import type { TopicInfo } from "./types";

// Teacher-uploaded topics ("📥 Subir tema (JSON)" in the setup). Their questions live in
// the SAME `tingo_questions` collection with a `custom-` id/topic prefix — the only ids
// the Firestore rules let the browser write — so the question source needs no changes
// and the seeded bank stays locked. The topic cards live in `tingo_custom_topics`.

export type CustomTopicDoc = {
    id: string; // custom-<slug>
    name: string;
    tagline: string;
    createdAt: number;
};

const topicsCol = () => collection(db, "tingo_custom_topics");
const questionsCol = () => collection(db, "tingo_questions");

// One shared listener feeding every host screen; starts on first use and stays on
// (the collection is tiny). Phones never subscribe: they don't show the topic.
let cache: CustomTopicDoc[] = [];
let started = false;
const listeners = new Set<(topics: CustomTopicDoc[]) => void>();

function ensureListening() {
    if (started) return;
    started = true;
    onSnapshot(
        topicsCol(),
        (snap) => {
            cache = snap.docs.map((d) => d.data() as CustomTopicDoc).sort((a, b) => b.createdAt - a.createdAt);
            for (const l of listeners) l(cache);
        },
        (e) => console.warn("Could not read custom topics", e)
    );
}

// The uploaded topics, newest first; `cb` runs now and on every change
export function subscribeCustomTopics(cb: (topics: CustomTopicDoc[]) => void): () => void {
    ensureListening();
    listeners.add(cb);
    cb(cache);
    return () => {
        listeners.delete(cb);
    };
}

export function useCustomTopics(): CustomTopicDoc[] {
    const [topics, setTopics] = useState(cache);
    useEffect(() => subscribeCustomTopics(setTopics), []);
    return topics;
}

export const asTopicInfo = (t: CustomTopicDoc): TopicInfo => ({ id: t.id, name: t.name, tagline: t.tagline, custom: true });

export const customTopicId = (nameOrId: string) => (nameOrId.startsWith("custom-") ? nameOrId : `custom-${slug(nameOrId)}`);

export type UploadMeta = { id?: string; name: string; tagline: string };

// Uploads (or replaces) one topic: deletes the previous docs of that topic id, then
// writes the questions and the card in a batch. Questions must come from parseUpload
// with no errors — the rules also reject malformed or non-custom docs.
export async function uploadTopic(questions: FlatQuestion[], meta: UploadMeta): Promise<{ id: string; count: number }> {
    const id = customTopicId(meta.id || meta.name);

    // Old docs out first (their own batch: deletes + writes could pass the 500-op cap)
    const old = await getDocs(query(questionsCol(), where("topic", "==", id)));
    if (old.size > 0) {
        const deletes = writeBatch(db);
        old.docs.forEach((d) => deletes.delete(d.ref));
        await deletes.commit();
    }

    const batch = writeBatch(db);
    questions.forEach(({ category, level, qa }, i) =>
        batch.set(doc(questionsCol(), `${id}__${i + 1}`), {
            topic: id,
            category,
            level,
            question: qa.question,
            answer: qa.answer,
            wrong: qa.wrong,
            ...(qa.code ? { code: qa.code } : {}),
        })
    );
    const card: CustomTopicDoc = { id, name: meta.name, tagline: meta.tagline, createdAt: Date.now() };
    batch.set(doc(topicsCol(), id), card);
    await batch.commit();
    return { id, count: questions.length };
}

// Removes the topic card and all its questions
export async function deleteCustomTopic(id: string) {
    const old = await getDocs(query(questionsCol(), where("topic", "==", id)));
    const batch = writeBatch(db);
    old.docs.forEach((d) => batch.delete(d.ref));
    batch.delete(doc(topicsCol(), id));
    await batch.commit();
}
