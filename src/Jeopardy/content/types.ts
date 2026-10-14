// Source format for the question seed script (scripts/seed-questions.ts).
// Each topic has 5 categories; each category has 5 levels (index 0 = 200 points,
// index 4 = 1000) with at least 2 questions per level.
export type SeedQA = {
    question: string;
    code?: string; // optional snippet shown in monospace under the question
    answer: string;
    wrong: string[]; // exactly 3 plausible wrong options
};

export type TopicContent = {
    id: string; // Firestore `topic` field, must match an id in ../topics.ts
    name: string;
    categories: Record<string, SeedQA[][]>;
};
