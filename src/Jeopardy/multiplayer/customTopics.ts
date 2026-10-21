import { collection, doc, getDocs, onSnapshot, query, updateDoc, where, writeBatch } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { slug, type UploadTopicContent } from "../contentValidation";
import type { TopicInfo } from "../topics";

// Teacher-uploaded topics ("📥 Subir tema (JSON)" in the setup menu). Their questions live
// in the SAME `questions` collection with a `custom-` id/topic prefix — the only ids the
// Firestore rules let the browser write — so loadQuestions/buildBoardFrom need no changes
// and the seeded bank stays locked. The topic cards live in `custom_topics`.

export type CustomTopicDoc = {
    id: string; // custom-<slug>
    name: string;
    tagline: string;
    group: string; // GROUPS id
    isNew: boolean; // the ✨ badge, toggled from the uploader without any deploy
    createdAt: number;
};

const topicsCol = () => collection(db, "custom_topics");
const questionsCol = () => collection(db, "questions");

// One shared listener feeding every host screen; starts on first use and stays on
// (the collection is tiny). Phones never subscribe: they read the name from the room.
let cache: CustomTopicDoc[] = [];
let started = false;
const listeners = new Set<() => void>();

function ensureListening() {
    if (started) return;
    started = true;
    onSnapshot(
        topicsCol(),
        (snap) => {
            cache = snap.docs
                .map((d) => d.data() as CustomTopicDoc)
                .sort((a, b) => b.createdAt - a.createdAt);
            for (const l of listeners) l();
        },
        (e) => console.warn("Could not read custom topics", e)
    );
}

// The uploaded topics, newest first (host screens only)
export function useCustomTopics(): CustomTopicDoc[] {
    const [topics, setTopics] = useState(cache);
    useEffect(() => {
        ensureListening();
        const l = () => setTopics(cache);
        listeners.add(l);
        l();
        return () => {
            listeners.delete(l);
        };
    }, []);
    return topics;
}

export const asTopicInfo = (t: CustomTopicDoc): TopicInfo => ({ id: t.id, name: t.name, tagline: t.tagline, group: t.group, isNew: t.isNew || undefined });

export const customTopicId = (nameOrId: string) => (nameOrId.startsWith("custom-") ? nameOrId : `custom-${slug(nameOrId)}`);

export type UploadMeta = { name: string; tagline: string; group: string; isNew: boolean };

// Uploads (or replaces) one topic: deletes the previous docs of that topic id, then
// writes the questions and the card in a batch. Content must be validated first
// (validateTopic) — the rules also reject malformed or non-custom docs.
export async function uploadTopic(content: UploadTopicContent, meta: UploadMeta): Promise<{ id: string; count: number }> {
    const id = customTopicId(content.id || meta.name);

    // Old docs out first (their own batch: deletes + writes could pass the 500-op cap)
    const old = await getDocs(query(questionsCol(), where("topic", "==", id)));
    if (old.size > 0) {
        const deletes = writeBatch(db);
        old.docs.forEach((d) => deletes.delete(d.ref));
        await deletes.commit();
    }

    const batch = writeBatch(db);
    let count = 0;
    for (const [category, levels] of Object.entries(content.categories)) {
        levels.forEach((qas, level) =>
            qas.forEach((qa, i) => {
                batch.set(doc(questionsCol(), `${id}__${slug(category)}__${level + 1}-${i + 1}`), {
                    topic: id,
                    category,
                    level: level + 1,
                    question: qa.question,
                    answer: qa.answer,
                    wrong: qa.wrong,
                    ...(qa.code ? { code: qa.code } : {}),
                });
                count++;
            })
        );
    }
    const card: CustomTopicDoc = { id, name: meta.name, tagline: meta.tagline, group: meta.group, isNew: meta.isNew, createdAt: Date.now() };
    batch.set(doc(topicsCol(), id), card);
    await batch.commit();
    return { id, count };
}

// The ✨ badge on/off, no deploys involved
export async function setTopicIsNew(id: string, isNew: boolean) {
    await updateDoc(doc(topicsCol(), id), { isNew });
}

// Removes the topic card and all its questions
export async function deleteCustomTopic(id: string) {
    const old = await getDocs(query(questionsCol(), where("topic", "==", id)));
    const batch = writeBatch(db);
    old.docs.forEach((d) => batch.delete(d.ref));
    batch.delete(doc(topicsCol(), id));
    await batch.commit();
}
