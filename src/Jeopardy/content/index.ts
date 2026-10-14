import { java } from "./java";
import { csharp } from "./csharp";
import { javascript } from "./javascript";
import { htmlCss } from "./htmlCss";
import { oop } from "./oop";
import { ai } from "./ai";
import { uxUi } from "./uxUi";
import { popCulture } from "./popCulture";
import { englishA1 } from "./englishA1";
import { englishB1 } from "./englishB1";
import type { TopicContent } from "./types";

// Everything the seed script uploads. The app itself never imports this
// (questions reach it through Firestore), so answers stay out of the bundle.
export const TOPIC_CONTENT: TopicContent[] = [java, csharp, javascript, htmlCss, oop, ai, uxUi, popCulture, englishA1, englishB1];
