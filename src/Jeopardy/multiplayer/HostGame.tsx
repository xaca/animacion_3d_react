import gsap from "gsap";
import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import Board from "../Board";
import EndScreen from "../EndScreen";
import GameOverSplash from "../GameOverSplash";
import { TOPICS } from "../topics";
import HostLobby from "./HostLobby";
import HostQuestionView from "./HostQuestionView";
import HostSetup from "./HostSetup";
import ProfileMenu, { type MenuItem } from "./ProfileMenu";
import ScorePanel from "./ScorePanel";
import { toggleRoomDebug } from "./debugSwitch";
import { MOTION, usePanelMode } from "./panelMode";
import { applySettings, backToLobby, createRoom, deleteRoom, endGame, newGame, openTile, type Room } from "./roomService";
import { Message } from "./ui";
import { useRoom } from "./useRoom";

// Teacher's debug console: downloaded only when the room's debug switch is on
const DebugConsole = lazy(() => import("./DebugConsole"));

type Props = {
    code: string;
    onExit: () => void;
    onLogout: () => void;
    onNewRoom: (code: string) => void; // go to a freshly created room
};

export default function HostGame({ code, onExit, onLogout, onNewRoom }: Props) {
    const room = useRoom(code);
    const [panelMode, setPanelMode] = usePanelMode();

    // "Game over!" splash shown once when the game ends; rearmed when the status changes
    // (adjust-state-during-render pattern, see react.dev "You might not need an effect")
    const [splashDone, setSplashDone] = useState(false);
    const status = room ? room.status : null;
    const [prevStatus, setPrevStatus] = useState(status);
    if (status !== prevStatus) {
        setPrevStatus(status);
        if (status !== "end") setSplashDone(false);
    }

    // "🎮 Next game!" splash while the room goes back to setup
    const [nextSplash, setNextSplash] = useState(false);

    // Time-limited game: when the limit passes, end it. Checked only on the board, so an
    // open question always finishes; "Next question" then lands on the podium.
    const boardExpiry = room && room.status === "board" ? room.gameEndsAt : null;
    useEffect(() => {
        if (boardExpiry == null) return;
        const check = () => {
            if (Date.now() >= boardExpiry) endGame(code);
        };
        check();
        const id = setInterval(check, 1000);
        return () => clearInterval(id);
    }, [boardExpiry, code]);

    // Every screen goes through this, so the tree shape is the same with debug on or off
    // (turning debug on never remounts the game)
    const withDebug = (screen: ReactNode) => (
        <>
            {screen}
            {room?.debug && (
                <Suspense fallback={null}>
                    <DebugConsole room={room} />
                </Suspense>
            )}
        </>
    );

    if (nextSplash) return withDebug(<GameOverSplash text="🎮 Next game!" onDone={() => setNextSplash(false)} />);
    if (room === undefined) return withDebug(<Message text="Loading…" />);
    if (room === null) return withDebug(<Message text="This room no longer exists." onBack={onExit} />);

    async function closeRoom() {
        await deleteRoom(code);
        onExit();
    }

    async function sameRoom() {
        setNextSplash(true);
        try {
            await newGame(code);
        } catch (e) {
            console.error("Could not start the next game", e);
            alert("Could not start the next game. Check your connection and try again.");
            setNextSplash(false);
        }
    }

    // A fresh room with this room's settings; created before the old one is deleted, so a
    // failure leaves the host where they were. We move first, then delete, so the host never
    // sees "room no longer exists". Players of the old room see "room closed".
    async function freshRoom(r: Room) {
        const next = await createRoom();
        await applySettings(next, {
            topic: r.topic,
            readSeconds: r.readSeconds,
            timerSeconds: r.timerSeconds,
            startSeconds: r.startSeconds,
            teamCount: r.teams.length,
            maxTeamSize: r.maxTeamSize,
        });
        onNewRoom(next);
        await deleteRoom(code).catch((e) => console.error(`Could not delete room ${code}`, e));
    }

    const newRoom = () =>
        freshRoom(room).catch((e) => {
            console.error("Could not create a new room", e);
            alert("Could not create a new room. Check your connection and try again.");
        });

    if (room.status === "setup") return withDebug(<HostSetup room={room} onExit={closeRoom} onLogout={onLogout} onNewRoom={newRoom} />);
    if (room.status === "lobby") return withDebug(<HostLobby room={room} onExit={closeRoom} onLogout={onLogout} />);
    if (room.status === "end") {
        if (!splashDone) return withDebug(<GameOverSplash onDone={() => setSplashDone(true)} />);
        const members = (i: number) =>
            Object.values(room.players)
                .filter((p) => p.team === room.teams[i].id)
                .map((p) => p.name);
        return withDebug(
            <EndScreen
                teams={room.teams}
                membersOf={members}
                actions={<EndActions players={Object.keys(room.players).length} onSameRoom={sameRoom} onNewRoom={newRoom} onClose={closeRoom} />}
            />
        );
    }

    const active = room.activeTile;
    const activeTile = active ? room.board[active.col].tiles[active.row] : null;
    const topic = TOPICS.find((t) => t.id === room.topic)?.name ?? room.topic;

    const humans = Object.values(room.players).filter((p) => !p.bot).length;
    const gameMenu: MenuItem[] = [
        { label: "🐞 Debug mode", on: room.debug === true, onClick: () => toggleRoomDebug(code, room.debug !== true) },
        {
            label: "↩ Restart game",
            separatorBefore: true,
            onClick: () =>
                confirm("Restart? This board and its scores are discarded; everyone goes back to the waiting room with their teams.") &&
                backToLobby(code),
        },
        {
            label: "Close room",
            danger: true,
            separatorBefore: true,
            onClick: () => (humans === 0 || confirm(`${humans} players will be disconnected. Continue?`)) && closeRoom(),
        },
    ];

    // Whole screen, no page scroll: score sidebar on the left, board (or question) in an
    // inset panel filling the rest
    return withDebug(
        <div className="h-dvh flex bg-[#1c2470] text-white overflow-hidden">
            <ScorePanel room={room} topic={topic} mode={panelMode} onMode={setPanelMode} />
            <main className="flex-1 min-w-0 min-h-0 p-2">
                <div className="relative h-full flex flex-col rounded-xl bg-[#2a3698] shadow-2xl p-2 overflow-hidden">
                    {/* The sidebar header shows topic + room when expanded; otherwise this corner label does */}
                    <div className="absolute top-1 right-1 z-20 flex items-center gap-3">
                        {room.gameEndsAt != null && <GameClock endsAt={room.gameEndsAt} />}
                        {panelMode !== "expanded" && (
                            <p className="text-sm opacity-80">
                                <b className="mr-2">{topic} ·</b>
                                Room <b className="tracking-widest">{room.code}</b>
                            </p>
                        )}
                        <ProfileMenu items={gameMenu} />
                    </div>
                    {room.status === "question" && active && activeTile && panelMode === "hidden" && room.revealed && (
                        <ResultToast key={`${active.col}-${active.row}`} room={room} />
                    )}
                    {room.status === "question" && active && activeTile ? (
                        <div className="flex-1 min-h-0 pt-5">
                            <HostQuestionView key={`${active.col}-${active.row}`} room={room} code={code} />
                        </div>
                    ) : (
                        <div className="flex-1 min-h-0 pt-4">
                            <Board board={room.board} onSelect={(col, row) => openTile(code, col, row)} />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

// Remaining time of a time-limited game, red in the last minute. Display only: the
// expiry effect in HostGame is what actually ends the game.
function GameClock({ endsAt }: { endsAt: number }) {
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 500);
        return () => clearInterval(id);
    }, []);
    const left = Math.max(0, endsAt - now);
    const m = Math.floor(left / 60_000);
    const s = Math.floor((left % 60_000) / 1000);
    return (
        <span className={`text-sm font-bold px-2 py-0.5 rounded ${left < 60_000 ? "bg-red-500" : "bg-black/30"}`}>
            ⏳ {m}:{String(s).padStart(2, "0")}
        </span>
    );
}

// Sidebar hidden: each team's result slides down for 3 s after the reveal. Keyed per question.
function ResultToast({ room }: { room: Room }) {
    const box = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        const tl = gsap
            .timeline()
            .fromTo(box.current, { y: -80, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4 * MOTION, ease: "back.out(1.6)" })
            .to(box.current, { y: -80, autoAlpha: 0, duration: 0.3 * MOTION, ease: "power2.in" }, "+=3");
        return () => {
            tl.kill();
        };
    }, []);
    const value = room.board[room.activeTile!.col].tiles[room.activeTile!.row].value;
    const teams = room.teams.filter((t) => Object.values(room.players).some((p) => p.team === t.id));
    return (
        <div
            ref={box}
            className="absolute top-6 left-1/2 -translate-x-1/2 z-20 bg-white text-black px-4 py-2 rounded-lg shadow-xl text-xl flex flex-wrap gap-x-4 opacity-0"
        >
            {teams.map((t) => {
                const a = room.answers.find((x) => x.team === t.id);
                return (
                    <span key={t.id} className="border-l-8 pl-2" style={{ borderLeftColor: t.color }}>
                        {t.name} <b>{!a ? "—" : a.correct ? `+${value}` : "✘"}</b>
                    </span>
                );
            })}
        </div>
    );
}


type EndActionsProps = {
    players: number;
    onSameRoom: () => Promise<void>;
    onNewRoom: () => Promise<void>;
    onClose: () => Promise<void>;
};

// After the podium the teacher decides: same room (players stay on their teams) or a new
// room (new code, players dropped). Rises in once the podium has finished. Enter = same room.
function EndActions({ players, onSameRoom, onNewRoom, onClose }: EndActionsProps) {
    const box = useRef<HTMLDivElement>(null);
    const [busy, setBusy] = useState(false);
    const busyRef = useRef(false);

    async function run(action: () => Promise<void>) {
        if (busyRef.current) return;
        busyRef.current = true;
        setBusy(true);
        try {
            await action();
        } finally {
            busyRef.current = false;
            setBusy(false);
        }
    }
    const runRef = useRef(run);
    const sameRef = useRef(onSameRoom);
    useEffect(() => {
        runRef.current = run;
        sameRef.current = onSameRoom;
    });

    useLayoutEffect(() => {
        const tween = gsap.fromTo(
            box.current,
            { y: 24, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, delay: 2.2 * MOTION, duration: 0.4 * MOTION, ease: "back.out(1.7)", clearProps: "transform" }
        );
        return () => {
            tween.kill();
        };
    }, []);

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            // A focused button handles its own Enter (e.g. "New room")
            if (e.key !== "Enter" || e.repeat || e.target instanceof HTMLButtonElement) return;
            e.preventDefault();
            runRef.current(() => sameRef.current());
        }
        addEventListener("keydown", onKey);
        return () => removeEventListener("keydown", onKey);
    }, []);

    const confirmed = () => players === 0 || confirm(`${players} ${players === 1 ? "player" : "players"} will be disconnected. Continue?`);
    const button = "text-2xl font-bold px-6 py-3 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
    return (
        <div ref={box} className="flex flex-col items-center gap-3 opacity-0">
            <div className="flex flex-wrap justify-center gap-3">
                <button type="button" disabled={busy} onClick={() => run(onSameRoom)} className={`${button} bg-yellow-300 text-black hover:bg-white`}>
                    🔁 Next game, same room
                </button>
                <button type="button" disabled={busy} onClick={() => confirmed() && run(onNewRoom)} className={`${button} bg-white text-[#2a3698] hover:bg-yellow-300`}>
                    ✨ New room
                </button>
            </div>
            <p className="text-sm opacity-70">
                Same room: players stay on their teams. New room: a new code for a new group. (Enter = same room)
            </p>
            <button type="button" disabled={busy} onClick={() => run(onClose)} className="text-white underline opacity-80 hover:opacity-100 cursor-pointer">
                Close room
            </button>
        </div>
    );
}
