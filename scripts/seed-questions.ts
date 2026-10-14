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

const words = (s: string) => s.trim().split(/\s+/).length;

// Players spot it when the correct answer is always the longest (or shortest) option.
// Flag it only when it's a clear giveaway: more words than every wrong option AND
// 1.5x the characters of the longest one (or the symmetric case).
function lengthGiveaway(answer: string, wrong: string[]): string | null {
    const aw = words(answer);
    const ac = answer.length;
    const ww = wrong.map(words);
    const wc = wrong.map((w) => w.length);
    if (ww.every((n) => aw > n) && ac > 1.5 * Math.max(...wc)) return "longest";
    if (ww.every((n) => aw < n) && 1.5 * ac < Math.min(...wc)) return "shortest";
    return null;
}

// Full board shape, 4 distinct options per question, no length giveaways
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
                const g = lengthGiveaway(qa.answer, qa.wrong);
                if (g) fail(`${where_}: the correct answer is clearly the ${g} option (balance the lengths)`);
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
