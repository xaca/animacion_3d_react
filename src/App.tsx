import Jeopardy from "./Jeopardy/Jeopardy.tsx";
import TingoTango from "./TingoTango/TingoTango.tsx";

// Two independent games in one deploy: /tingo/* is TingoTango, everything else is
// Jeopardy (the live site). Each game routes internally under its own prefix.
export default function App() {
    return location.pathname.startsWith("/tingo") ? <TingoTango basePath="/tingo" /> : <Jeopardy />;
}
