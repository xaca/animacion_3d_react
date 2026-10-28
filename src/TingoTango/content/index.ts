import { DESIGN_THINKING_EMPATIA } from "./designThinkingEmpatia";
import { JAVA_FUNDAMENTOS } from "./javaFundamentos";
import type { TopicContent } from "./types";

// Every topic the seed script uploads to `tingo_questions`. Never imported by the app,
// so the answers stay out of the bundle (same pattern as Jeopardy's content/).
export const TINGO_CONTENT: TopicContent[] = [JAVA_FUNDAMENTOS, DESIGN_THINKING_EMPATIA];
