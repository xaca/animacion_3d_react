// Question validation, shared by the seed script (scripts/seed-tingo.ts) and the in-app
// JSON uploader (UploadTopicModal). Copied from Jeopardy's contentValidation and adapted
// (no imports from src/Jeopardy, see README.md). Tingo mixes every level in one queue, so
// uploads are a plain list of questions; the seeded bank keeps the 5×5 format.

export type UploadQA = {
    question: string;
    code?: string;
    answer: string;
    wrong: string[];
};

// What the uploader accepts: a flat `questions` list (the easy one for teachers) or a
// Jeopardy-style `categories` object, so the same file can serve both games.
// name/tagline travel with the file; the modal lets the teacher change them.
export type UploadTopicContent = {
    id?: string;
    name?: string;
    tagline?: string;
    questions?: UploadQA[];
    categories?: Record<string, UploadQA[][]>;
};

// One question ready to store, whatever the source format was
export type FlatQuestion = { category: string; level: number; qa: UploadQA };

export const MIN_UPLOAD_QUESTIONS = 5;
// One write batch holds 500 ops: the questions + the topic card must fit
export const MAX_UPLOAD_QUESTIONS = 400;
// Size caps mirrored in firestore.rules (isCustomQuestion)
export const MAX_QUESTION_CHARS = 500;
export const MAX_OPTION_CHARS = 300;
export const MAX_CODE_CHARS = 1000;
export const MAX_CATEGORY_CHARS = 60;
const DEFAULT_CATEGORY = "General";

// Seeded bank format (content/): 5 categories × 5 levels × ≥2 questions
const CATEGORIES_PER_TOPIC = 5;
const LEVELS_PER_CATEGORY = 5;
const MIN_PER_LEVEL = 2;

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

// Every problem of one question (empty = valid)
function validateQuestion(qa: UploadQA, where: string): string[] {
    if (typeof qa?.question !== "string" || typeof qa?.answer !== "string" || !Array.isArray(qa?.wrong)) {
        return [`${where} no tiene la forma {question, answer, wrong[3]}`];
    }
    if (qa.wrong.length !== 3 || qa.wrong.some((w) => typeof w !== "string")) return [`${where} necesita exactamente 3 opciones incorrectas`];
    const errors: string[] = [];
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
    return errors;
}

const label = (qa: UploadQA | undefined) => `"${String(qa?.question ?? "").slice(0, 50)}"`;

// The seeded bank: full 5×5 shape plus every question. The seed fails on the first error.
export function validateTopic(topic: { categories: Record<string, UploadQA[][]> }, name = "topic"): string[] {
    const errors: string[] = [];
    const entries = Object.entries(topic.categories ?? {});
    if (entries.length !== CATEGORIES_PER_TOPIC) errors.push(`${name}: se esperan ${CATEGORIES_PER_TOPIC} categorías, hay ${entries.length}`);
    for (const [category, levels] of entries) {
        if (levels.length !== LEVELS_PER_CATEGORY) errors.push(`${name} / ${category}: se esperan ${LEVELS_PER_CATEGORY} niveles, hay ${levels.length}`);
        levels.forEach((qas, level) => {
            if (qas.length < MIN_PER_LEVEL) errors.push(`${name} / ${category} nivel ${level + 1}: necesita al menos ${MIN_PER_LEVEL} preguntas`);
            for (const qa of qas) errors.push(...validateQuestion(qa, `${name} / ${category}: ${label(qa)}`));
        });
    }
    return errors;
}

// An upload, flattened to the questions it will store, plus every problem found
// (empty errors = ready to upload). Lenient on shape: any number of categories/levels.
export function parseUpload(content: UploadTopicContent): { questions: FlatQuestion[]; errors: string[] } {
    const questions: FlatQuestion[] = [];
    const errors: string[] = [];
    if (Array.isArray(content.questions)) {
        for (const qa of content.questions) questions.push({ category: DEFAULT_CATEGORY, level: 1, qa });
    } else if (content.categories && typeof content.categories === "object") {
        for (const [category, levels] of Object.entries(content.categories)) {
            if (!category.trim() || category.length > MAX_CATEGORY_CHARS) errors.push(`Categoría "${category.slice(0, 30)}": nombre vacío o de más de ${MAX_CATEGORY_CHARS} caracteres`);
            if (!Array.isArray(levels) || levels.some((l) => !Array.isArray(l))) {
                errors.push(`Categoría "${category}": debe ser una lista de niveles, cada uno una lista de preguntas`);
                continue;
            }
            // Levels past 5 share level 5 (the rules allow 1..5); Tingo mixes them anyway
            levels.forEach((qas, level) => qas.forEach((qa) => questions.push({ category, level: Math.min(level + 1, 5), qa })));
        }
    } else {
        return { questions: [], errors: ['Falta la lista "questions": [ { question, answer, wrong: [3] }, … ]'] };
    }
    if (questions.length < MIN_UPLOAD_QUESTIONS) errors.push(`Se necesitan al menos ${MIN_UPLOAD_QUESTIONS} preguntas, hay ${questions.length}`);
    if (questions.length > MAX_UPLOAD_QUESTIONS) errors.push(`Máximo ${MAX_UPLOAD_QUESTIONS} preguntas por tema, hay ${questions.length}`);
    questions.forEach(({ qa }, i) => errors.push(...validateQuestion(qa, `#${i + 1} ${label(qa)}`)));
    return { questions, errors };
}

export const slug = (text: string) =>
    text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "") // accents off: "Programación" → "programacion"
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
