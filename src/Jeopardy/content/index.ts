import { java } from "./java";
import { javaDepth } from "./javaDepth";
import { csharp } from "./csharp";
import { javascript } from "./javascript";
import { htmlCss } from "./htmlCss";
import { oop } from "./oop";
import { ai } from "./ai";
import { uxUi } from "./uxUi";
import { graphicDesign } from "./graphicDesign";
import { designThinking } from "./designThinking";
import { popCulture } from "./popCulture";
import { englishA1 } from "./englishA1";
import { englishB1 } from "./englishB1";
import { technology } from "./technology";
import { videoGames } from "./videoGames";
import { books } from "./books";
import { rap } from "./rap";
import { reggaeton } from "./reggaeton";
import { pop } from "./pop";
import { rock } from "./rock";
import { sports } from "./sports";
import type { TopicContent } from "./types";

// Everything the seed script uploads. The app itself never imports this
// (questions reach it through Firestore), so answers stay out of the bundle.
export const TOPIC_CONTENT: TopicContent[] = [java, javaDepth, csharp, javascript, htmlCss, oop, ai, uxUi, graphicDesign, designThinking,
    popCulture, englishA1, englishB1, technology, videoGames, books, rap, reggaeton, pop, rock, sports];
