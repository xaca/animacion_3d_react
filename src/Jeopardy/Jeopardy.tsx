import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import LocalGame from "./LocalGame";
import HomeScreen from "./multiplayer/HomeScreen";
import HostGame from "./multiplayer/HostGame";
import HostLogin from "./multiplayer/HostLogin";
import JoinScreen from "./multiplayer/JoinScreen";
import PlayerGame from "./multiplayer/PlayerGame";
import { localDebug } from "./multiplayer/debug";
import { isHostUnlocked, lockHost } from "./multiplayer/hostAuth";
import { createRoom } from "./multiplayer/roomService";
import { Message } from "./multiplayer/ui";

// Per-device debug window (?debug=1, fallback for the teacher's console): downloaded only then
const DebugPanel = lazy(() => import("./multiplayer/DebugPanel"));

// Each screen has its own URL:
//   /             home (choose a mode)
//   /local        one-screen game
//   /join         join form (/join?code=ABCD from the QR prefills the code)
//   /host         creates a room and goes to its setup (host PIN required)
//   /host/ABCD    host view of room ABCD (host PIN required)
//   /play/ABCD    player view of room ABCD
type View =
    | { kind: "home" }
    | { kind: "local" }
    | { kind: "join"; code: string }
    | { kind: "host-new" }
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

function viewFromPath(url: string): View {
    const [path, query = ""] = url.split("?");
    const [, first, code] = path.split("/");
    if (first === "local") return { kind: "local" };
    if (first === "join") return { kind: "join", code: (new URLSearchParams(query).get("code") ?? "").toUpperCase() };
    if (first === "host") return code ? { kind: "host", code: code.toUpperCase() } : { kind: "host-new" };
    if (first === "play" && code) return { kind: "player", code: code.toUpperCase(), playerId: readPlayerId(code.toUpperCase()) };
    return { kind: "home" };
}

export default function Jeopardy() {
    const screen = <Screens />;
    if (!localDebug) return screen;
    return (
        <>
            {screen}
            <Suspense fallback={null}>
                <DebugPanel />
            </Suspense>
        </>
    );
}

function Screens(): ReactNode {
    const [view, setView] = useState<View>(() => viewFromPath(location.pathname + location.search));
    const [hostUnlocked, setHostUnlocked] = useState(isHostUnlocked);

    // Browser back/forward buttons
    useEffect(() => {
        const onPop = () => setView(viewFromPath(location.pathname + location.search));
        addEventListener("popstate", onPop);
        return () => removeEventListener("popstate", onPop);
    }, []);

    // The tab's title says where you are, handy with several test tabs open
    useEffect(() => {
        const base = "Classroom Jeopardy 🎓";
        document.title = view.kind === "host" || view.kind === "player" ? `Sala ${view.code} · ${base}` : base;
    }, [view]);

    function go(path: string, replace = false) {
        if (replace) history.replaceState(null, "", path);
        else history.pushState(null, "", path);
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

    function logout() {
        lockHost();
        setHostUnlocked(false);
    }

    switch (view.kind) {
        case "home":
            return <HomeScreen onHost={() => go("/host")} onJoin={() => go("/join")} />;
        case "local":
            return <LocalGame />;
        case "join":
            return <JoinScreen initialCode={view.code} onBack={goHome} onJoined={joined} />;
        case "host-new":
            if (!hostUnlocked) return <HostLogin onUnlock={() => setHostUnlocked(true)} onBack={goHome} />;
            // replace: the back button must not land on /host and create another room
            return <NewRoom onCreated={(code) => go(`/host/${code}`, true)} onFailed={goHome} />;
        case "host":
            if (!hostUnlocked) return <HostLogin onUnlock={() => setHostUnlocked(true)} onBack={goHome} />;
            // replace: "New room" swaps rooms; back must not return to the deleted one
            return (
                <HostGame key={view.code} code={view.code} onExit={goHome} onLogout={logout} onNewRoom={(code) => go(`/host/${code}`, true)} />
            );
        case "player": {
            // Opening /play/CODE without having joined from this tab: send them to the join form
            if (!view.playerId) return <JoinScreen initialCode={view.code} onBack={goHome} onJoined={joined} />;
            // Leaving (or losing) a game lands back on the join form with the code ready
            const backToJoin = () => go(`/join?code=${view.code}`);
            return <PlayerGame key={view.code} code={view.code} playerId={view.playerId} onExit={backToJoin} />;
        }
    }
}

function NewRoom({ onCreated, onFailed }: { onCreated: (code: string) => void; onFailed: () => void }) {
    // Ref so React StrictMode's double effect in dev doesn't create two rooms
    const started = useRef(false);
    useEffect(() => {
        if (started.current) return;
        started.current = true;
        createRoom().then(onCreated, (error) => {
            console.error("Could not create a room", error);
            alert("Could not create a room. Check your connection and try again.");
            onFailed();
        });
    }, [onCreated, onFailed]);
    return <Message text="Creating your room…" />;
}
