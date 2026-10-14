// Uploads src/Jeopardy/content/ to the Firestore `questions` collection using
// the normal web SDK. firestore.rules blocks writes to `questions`, so seeding
// is three steps (see .claude/skills/jeopardy): temporarily set `allow write: if true`
// on questions, deploy rules, run this, revert the rules, deploy again. Usage:
//   npm run seed            seed every topic
//   npm run seed -- java    seed one topic
import { collection, doc, getDocs, query, terminate, where, writeBatch } from "firebase/firestore";
import { db } from "../src/lib/firebase";
import { TOPIC_CONTENT } from "../src/Jeopardy/content";
import type { TopicContent } from "../src/Jeopardy/content/types";

const CATEGORIES = 5;
const LEVELS = 5;
const MIN_PER_LEVEL = 2;

function fail(message: string): never {
    console.error(`[seed] ${message}`);
    process.exit(1);
}

// Full board shape and 4 distinct options per question
function validate(topic: TopicContent) {
    const names = Object.keys(topic.categories);
    if (names.length !== CATEGORIES) fail(`${topic.id}: expected ${CATEGORIES} categories, got ${names.length}`);
    for (const [name, levels] of Object.entries(topic.categories)) {
        if (levels.length !== LEVELS) fail(`${topic.id} / ${name}: expected ${LEVELS} levels, got ${levels.length}`);
        levels.forEach((qas, level) => {
            if (qas.length < MIN_PER_LEVEL) fail(`${topic.id} / ${name} level ${level + 1}: needs at least ${MIN_PER_LEVEL} questions`);
            for (const qa of qas) {
                const where_ = `${topic.id} / ${name}: "${qa.question}"`;
                if (qa.wrong.length !== 3) fail(`${where_} needs exactly 3 wrong options`);
                const options = [qa.answer, ...qa.wrong].map((o) => o.trim());
                if (options.some((o) => !o) || !qa.question.trim()) fail(`${where_} has empty text`);
                if (new Set(options.map((o) => o.toLowerCase())).size !== 4) fail(`${where_} has duplicate options`);
            }
        });
    }
}

const slug = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const only = process.argv[2];
const topics = only ? TOPIC_CONTENT.filter((t) => t.id === only) : TOPIC_CONTENT;
if (topics.length === 0) fail(`Unknown topic "${only}". Topics: ${TOPIC_CONTENT.map((t) => t.id).join(", ")}`);

for (const topic of topics) validate(topic);

const questions = collection(db, "questions");
for (const topic of topics) {
    // Delete the topic's old questions first, so removed ones don't linger
    const old = await getDocs(query(questions, where("topic", "==", topic.id)));
    const batch = writeBatch(db);
    old.docs.forEach((d) => batch.delete(d.ref));

    let count = 0;
    for (const [category, levels] of Object.entries(topic.categories)) {
        levels.forEach((qas, level) =>
            qas.forEach((qa, i) => {
                const id = `${topic.id}__${slug(category)}__${level + 1}-${i + 1}`;
                batch.set(doc(questions, id), {
                    topic: topic.id,
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
    await batch.commit();
    console.log(`[seed] ${topic.id}: ${count} questions (${old.size} old deleted)`);
}

await terminate(db);
console.log("[seed] done");
