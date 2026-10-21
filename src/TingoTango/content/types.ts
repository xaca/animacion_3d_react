// Source format for the TingoTango seed script (scripts/seed-tingo.ts). Same structure
// as Jeopardy's content (5 categories × 5 levels × ≥2 questions) so the validator and a
// future shared source stay compatible, but the content itself is TingoTango's own.
export type SeedQA = {
    question: string;
    code?: string; // optional snippet shown in monospace under the question
    answer: string;
    wrong: string[]; // exactly 3 plausible wrong options, length-balanced with the answer
};

export type TopicContent = {
    id: string; // Firestore `topic` field, must match an id in ../topics.ts
    name: string;
    categories: Record<string, SeedQA[][]>;
};
