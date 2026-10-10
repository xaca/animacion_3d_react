import { useEffect, useState } from "react";
import LocalGame from "./LocalGame";
import HomeScreen from "./multiplayer/HomeScreen";
import HostGame from "./multiplayer/HostGame";
import JoinScreen from "./multiplayer/JoinScreen";
import PlayerGame from "./multiplayer/PlayerGame";
import { createRoom } from "./multiplayer/roomService";

// Each screen has its own URL:
//   /             home (choose a mode)
//   /local        one-screen game
//   /join         join form
//   /host/ABCD    host view of room ABCD
//   /play/ABCD    player view of room ABCD
type View =
    | { kind: "home" }
    | { kind: "local" }
    | { kind: "join" }
    | { kind: "host"; code: string }
    | { kind: "player"; code: string; playerId: string | null };

// sessionStorage is per tab, so each tab can be a different player and survives a refresh
const playerKey = (code: string) => `jeopardy-player:${code}`;

function readPlayerId(code: string): string | null {
    try {
        return sessionStorage.getItem(playerKey(code));
    } catch {
        return null;
    }
}

function viewFromPath(path: string): View {
    const [, first, code] = path.split("/");
    if (first === "local") return { kind: "local" };
    if (first === "join") return { kind: "join" };
    if (first === "host" && code) return { kind: "host", code: code.toUpperCase() };
    if (first === "play" && code) return { kind: "player", code: code.toUpperCase(), playerId: readPlayerId(code.toUpperCase()) };
    return { kind: "home" };
}

export default function Jeopardy() {
    const [view, setView] = useState<View>(() => viewFromPath(location.pathname));

    // Browser back/forward buttons
    useEffect(() => {
        const onPop = () => setView(viewFromPath(location.pathname));
        addEventListener("popstate", onPop);
        return () => removeEventListener("popstate", onPop);
    }, []);

    function go(path: string) {
        history.pushState(null, "", path);
        setView(viewFromPath(path));
    }

    const goHome = () => go("/");

    function joined(code: string, playerId: string) {
        try {
            sessionStorage.setItem(playerKey(code), playerId);
        } catch {
            // ignore unavailable storage
        }
        go(`/play/${code}`);
    }

    switch (view.kind) {
        case "home":
            return (
                <HomeScreen
                    onHost={async () => {
                        try {
                            go(`/host/${await createRoom()}`);
                        } catch (error) {
                            console.error("Could not create a room", error);
                            alert("Could not create a room. Check your connection and try again.");
                        }
                    }}
                    onJoin={() => go("/join")}
                    onLocal={() => go("/local")}
                />
            );
        case "local":
            return <LocalGame />;
        case "join":
            return <JoinScreen onBack={goHome} onJoined={joined} />;
        case "host":
            return <HostGame key={view.code} code={view.code} onExit={goHome} />;
        case "player":
            // Opening /play/CODE without having joined from this tab: send them to the join form
            if (!view.playerId) return <JoinScreen onBack={goHome} onJoined={joined} />;
            return <PlayerGame key={view.code} code={view.code} playerId={view.playerId} onExit={goHome} />;
    }
}
