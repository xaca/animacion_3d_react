// Topic content validation, shared by the seed script (scripts/seed-questions.ts) and the
// in-app JSON uploader (UploadTopicModal). One source of truth for what a playable topic
// looks like: 5 categories × 5 levels × ≥2 questions, 3 distinct wrong options, no empty
// text, no length giveaways.

export type UploadQA = {
    question: string;
    code?: string;
    answer: string;
    wrong: string[];
};

// What the uploader accepts as JSON (id/name/tagline/group travel with the file;
// the modal lets the teacher override them before uploading)
export type UploadTopicContent = {
    id?: string;
    name?: string;
    tagline?: string;
    group?: string;
    categories: Record<string, UploadQA[][]>;
};

export const CATEGORIES_PER_TOPIC = 5;
export const LEVELS_PER_CATEGORY = 5;
export const MIN_PER_LEVEL = 2;
// Size caps mirrored in firestore.rules (isCustomQuestion)
export const MAX_QUESTION_CHARS = 500;
export const MAX_OPTION_CHARS = 300;
export const MAX_CODE_CHARS = 1000;

const words = (s: string) => s.trim().split(/\s+/).length;

// Players spot it when the correct answer is always the longest (or shortest) option.
// Flag it only when it's a clear giveaway: more words than every wrong option AND
// 1.5x the characters of the longest one (or the symmetric case).
export function lengthGiveaway(answer: string, wrong: string[]): string | null {
    const aw = words(answer);
    const ac = answer.length;
    const ww = wrong.map(words);
    const wc = wrong.map((w) => w.length);
    if (ww.every((n) => aw > n) && ac > 1.5 * Math.max(...wc)) return "longest";
    if (ww.every((n) => aw < n) && 1.5 * ac < Math.min(...wc)) return "shortest";
    return null;
}

// Every problem found, as human-readable lines (empty array = valid). The seed script
// fails on the first one; the uploader shows them all.
export function validateTopic(topic: { categories: Record<string, UploadQA[][]> }, label = "topic"): string[] {
    const errors: string[] = [];
    const categories = topic.categories;
    if (!categories || typeof categories !== "object") return [`${label}: falta el objeto "categories"`];
    const names = Object.keys(categories);
    if (names.length !== CATEGORIES_PER_TOPIC) errors.push(`${label}: se esperan ${CATEGORIES_PER_TOPIC} categorías, hay ${names.length}`);
    for (const [name, levels] of Object.entries(categories)) {
        if (!Array.isArray(levels)) {
            errors.push(`${label} / ${name}: debe ser una lista de ${LEVELS_PER_CATEGORY} niveles`);
            continue;
        }
        if (levels.length !== LEVELS_PER_CATEGORY) errors.push(`${label} / ${name}: se esperan ${LEVELS_PER_CATEGORY} niveles, hay ${levels.length}`);
        levels.forEach((qas, level) => {
            if (!Array.isArray(qas)) {
                errors.push(`${label} / ${name} nivel ${level + 1}: debe ser una lista de preguntas`);
                return;
            }
            if (qas.length < MIN_PER_LEVEL) errors.push(`${label} / ${name} nivel ${level + 1}: necesita al menos ${MIN_PER_LEVEL} preguntas`);
            for (const qa of qas) {
                const where = `${label} / ${name}: "${String(qa?.question ?? "").slice(0, 50)}"`;
                if (typeof qa?.question !== "string" || typeof qa?.answer !== "string" || !Array.isArray(qa?.wrong)) {
                    errors.push(`${where} no tiene la forma {question, answer, wrong[3]}`);
                    continue;
                }
                if (qa.wrong.length !== 3 || qa.wrong.some((w) => typeof w !== "string")) {
                    errors.push(`${where} necesita exactamente 3 opciones incorrectas`);
                    continue;
                }
                const options = [qa.answer, ...qa.wrong].map((o) => o.trim());
                if (options.some((o) => !o) || !qa.question.trim()) errors.push(`${where} tiene textos vacíos`);
                if (new Set(options.map((o) => o.toLowerCase())).size !== 4) errors.push(`${where} tiene opciones repetidas`);
                if (qa.question.length > MAX_QUESTION_CHARS) errors.push(`${where}: pregunta de más de ${MAX_QUESTION_CHARS} caracteres`);
                if (options.some((o) => o.length > MAX_OPTION_CHARS)) errors.push(`${where}: una opción pasa de ${MAX_OPTION_CHARS} caracteres`);
                if (qa.code !== undefined && (typeof qa.code !== "string" || qa.code.length > MAX_CODE_CHARS)) {
                    errors.push(`${where}: el campo code debe ser texto de hasta ${MAX_CODE_CHARS} caracteres`);
                }
                const g = lengthGiveaway(qa.answer, qa.wrong);
                if (g) errors.push(`${where}: la respuesta correcta es claramente la ${g === "longest" ? "más larga" : "más corta"} (balancea las longitudes)`);
            }
        });
    }
    return errors;
}

export const slug = (text: string) =>
    text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
