import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { localDebug } from "./debug";
import HomeScreen from "./HomeScreen";
import HostGame from "./HostGame";
import HostLogin from "./HostLogin";
import { isHostUnlocked, lockHost } from "./hostAuth";
import JoinScreen from "./JoinScreen";
import PlayerGame from "./PlayerGame";
import { firestoreQuestionSource } from "./questionSource";
import { createRoom } from "./roomService";
import type { QuestionSource } from "./types";
import { Message } from "./ui";

// Per-device debug window (?debug=1, fallback for the teacher's console): downloaded only then
const DebugPanel = lazy(() => import("./DebugPanel"));

// Self-contained game component. `basePath` lets it live next to other games (mounted
// under /tingo by src/App.tsx, or at "" standalone); `questionSource` decouples it from
// its own question bank (see README.md).
export type TingoTangoProps = {
    basePath?: string;
    questionSource?: QuestionSource;
};

// Each screen has its own URL (under basePath):
//   /             home (host or join)
//   /join         join form (/join?code=ABCD from the QR prefills the code)
//   /host         creates a room and goes to it (host PIN required)
//   /host/ABCD    host view of room ABCD (host PIN required)
//   /play/ABCD    player view of room ABCD
type View =
    | { kind: "home" }
    | { kind: "join"; code: string }
    | { kind: "host-new" }
    | { kind: "host"; code: string }
    | { kind: "player"; code: string; playerId: string | null };

// sessionStorage is per tab, so each tab can be a different player and survives a refresh
const playerKey = (code: string) => `tingo-player:${code}`;

function readPlayerId(code: string): string | null {
    try {
        return sessionStorage.getItem(playerKey(code));
    } catch {
        return null;
    }
}

function viewFromPath(basePath: string, url: string): View {
    const [fullPath, query = ""] = url.split("?");
    const path = fullPath.startsWith(basePath) ? fullPath.slice(basePath.length) : fullPath;
    const [, first, code] = path.split("/");
    if (first === "join") return { kind: "join", code: (new URLSearchParams(query).get("code") ?? "").toUpperCase() };
    if (first === "host") return code ? { kind: "host", code: code.toUpperCase() } : { kind: "host-new" };
    if (first === "play" && code) return { kind: "player", code: code.toUpperCase(), playerId: readPlayerId(code.toUpperCase()) };
    return { kind: "home" };
}

export default function TingoTango({ basePath = "", questionSource = firestoreQuestionSource }: TingoTangoProps) {
    const screen = <Screens basePath={basePath} questionSource={questionSource} />;
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

function Screens({ basePath, questionSource }: { basePath: string; questionSource: QuestionSource }): ReactNode {
    const [view, setView] = useState<View>(() => viewFromPath(basePath, location.pathname + location.search));
    const [hostUnlocked, setHostUnlocked] = useState(isHostUnlocked);

    // Browser back/forward buttons
    useEffect(() => {
        const onPop = () => setView(viewFromPath(basePath, location.pathname + location.search));
        addEventListener("popstate", onPop);
        return () => removeEventListener("popstate", onPop);
    }, [basePath]);

    // The tab's title says where you are, handy with several test tabs open
    useEffect(() => {
        const base = "Tingo Tango 🔴";
        document.title = view.kind === "host" || view.kind === "player" ? `Sala ${view.code} · ${base}` : base;
    }, [view]);

    function go(path: string, replace = false) {
        const full = `${basePath}${path}` || "/";
        if (replace) history.replaceState(null, "", full);
        else history.pushState(null, "", full);
        setView(viewFromPath(basePath, full));
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
        case "join":
            return <JoinScreen initialCode={view.code} onBack={goHome} onJoined={joined} />;
        case "host-new":
            if (!hostUnlocked) return <HostLogin onUnlock={() => setHostUnlocked(true)} onBack={goHome} />;
            // replace: the back button must not land on /host and create another room
            return <NewRoom onCreated={(code) => go(`/host/${code}`, true)} onFailed={goHome} />;
        case "host":
            if (!hostUnlocked) return <HostLogin onUnlock={() => setHostUnlocked(true)} onBack={goHome} />;
            // replace: "Nueva sala" swaps rooms; back must not return to the deleted one
            return (
                <HostGame
                    key={view.code}
                    code={view.code}
                    questionSource={questionSource}
                    basePath={basePath}
                    onExit={goHome}
                    onLogout={logout}
                    onNewRoom={(code) => go(`/host/${code}`, true)}
                />
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
            alert("No se pudo crear la sala. Revisa la conexión e intenta de nuevo.");
            onFailed();
        });
    }, [onCreated, onFailed]);
    return <Message text="Creando tu sala…" />;
}
