// Uploads src/TingoTango/content/ to the Firestore `tingo_questions` collection using
// the normal web SDK. firestore.rules blocks writes to `tingo_questions`, so seeding
// is three steps (same dance as Jeopardy's seed): temporarily set `allow write: if true`
// on tingo_questions, deploy rules, run this, revert the rules, deploy again. Usage:
//   npm run seed:tingo                      seed every topic
//   npm run seed:tingo -- java-fundamentos  seed one topic
import { collection, doc, getDocs, query, terminate, where, writeBatch } from "firebase/firestore";
import { db } from "../src/lib/firebase";
import { TINGO_CONTENT } from "../src/TingoTango/content";
import { slug, validateTopic } from "../src/TingoTango/contentValidation";
import type { TopicContent } from "../src/TingoTango/content/types";

function fail(message: string): never {
    console.error(`[seed:tingo] ${message}`);
    process.exit(1);
}

// Same validator as the in-app uploader: full 5×5 shape, 4 distinct options, no length giveaways
function validate(topic: TopicContent) {
    const errors = validateTopic(topic, topic.id);
    if (errors.length > 0) fail(errors[0]);
}

const only = process.argv[2];
const topics = only ? TINGO_CONTENT.filter((t) => t.id === only) : TINGO_CONTENT;
if (topics.length === 0) fail(`Unknown topic "${only}". Topics: ${TINGO_CONTENT.map((t) => t.id).join(", ")}`);

for (const topic of topics) validate(topic);

const questions = collection(db, "tingo_questions");
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
    console.log(`[seed:tingo] ${topic.id}: ${count} questions (${old.size} old deleted)`);
}

await terminate(db);
console.log("[seed:tingo] done");
