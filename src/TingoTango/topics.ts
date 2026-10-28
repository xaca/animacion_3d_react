import type { TopicInfo } from "./types";

// Topics shown in the host lobby. Ids must match content/ (and so `tingo_questions`).
// Kept apart from content/ so the bundle never ships the questions.
export const TOPICS: TopicInfo[] = [
    { id: "java-fundamentos", name: "Java: Fundamentos", tagline: "Variables, operadores, condicionales y ciclos — en español" },
    { id: "design-thinking-empatia", name: "Design Thinking: Empatía", tagline: "Entrevistas, observación y mapa de empatía — la primera etapa" },
];
