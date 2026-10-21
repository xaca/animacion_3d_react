// Uploads src/Jeopardy/content/ to the Firestore `questions` collection using
// the normal web SDK. firestore.rules blocks writes to `questions`, so seeding
// is three steps (see .claude/skills/jeopardy): temporarily set `allow write: if true`
// on questions, deploy rules, run this, revert the rules, deploy again. Usage:
//   npm run seed            seed every topic
//   npm run seed -- java    seed one topic
import { collection, doc, getDocs, query, terminate, where, writeBatch } from "firebase/firestore";
import { db } from "../src/lib/firebase";
import { TOPIC_CONTENT } from "../src/Jeopardy/content";
import { slug, validateTopic } from "../src/Jeopardy/contentValidation";
import type { TopicContent } from "../src/Jeopardy/content/types";

function fail(message: string): never {
    console.error(`[seed] ${message}`);
    process.exit(1);
}

// Full board shape, 4 distinct options per question, no length giveaways — the same
// validator the in-app JSON uploader uses (src/Jeopardy/contentValidation.ts)
function validate(topic: TopicContent) {
    const errors = validateTopic(topic, topic.id);
    if (errors.length > 0) fail(errors.join("\n[seed] "));
}

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
