import gsap from "gsap";
import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import ChantBoard from "./ChantBoard";
import { toggleRoomDebug } from "./debugSwitch";
import EndScreen from "./EndScreen";
import GameOverSplash from "./GameOverSplash";
import HostLobby from "./HostLobby";
import { MOTION } from "./motion";
import ProfileMenu, { type MenuItem } from "./ProfileMenu";
import {
    applySettings,
    backToLobby,
    createRoom,
    deleteRoom,
    endGame,
    hopMsOf,
    questionCountOf,
    selectedPlayer,
    stopTango,
    type TingoRoom,
} from "./roomService";
import { isSoundOn, setSoundOn } from "./sound";
import TangoQuestionView from "./TangoQuestionView";
import { hasScores, TINGO_MAX_MS, TINGO_MIN_MS, type QuestionSource } from "./types";
import { dotted, Message } from "./ui";
import { useRoom } from "./useRoom";

// Teacher's debug console: downloaded only when the room's debug switch is on
const DebugConsole = lazy(() => import("./DebugConsole"));

type Props = {
    code: string;
    questionSource: QuestionSource;
    basePath: string;
    onExit: () => void;
    onLogout: () => void;
    onNewRoom: (code: string) => void; // go to a freshly created room
};

export default function HostGame({ code, questionSource, basePath, onExit, onLogout, onNewRoom }: Props) {
    const room = useRoom(code);
    const status = room ? room.status : null;

    // "¡Se acabó!" splash shown once when the game ends; rearmed when the status changes
    // (adjust-state-during-render pattern, see react.dev "You might not need an effect")
    const [splashDone, setSplashDone] = useState(false);
    const [prevStatus, setPrevStatus] = useState(status);
    if (status !== prevStatus) {
        setPrevStatus(status);
        if (status !== "end") setSplashDone(false);
    }

    // The ball lands with its own animation AFTER the room already says tango; the
    // question view appears only once the landing of the current round finished
    const [landedRound, setLandedRound] = useState(0);

    // Round running: the ball stops by itself at a random moment (suspense!) unless the
    // teacher presses ¡Tango! (Space/Enter) first. Both go through the same stopTango,
    // and the transaction ignores whoever arrives second.
    const stopBusy = useRef(false);
    async function stop() {
        if (stopBusy.current) return;
        stopBusy.current = true;
        try {
            await stopTango(code);
        } catch (e) {
            console.error("Could not stop the round", e);
        } finally {
            stopBusy.current = false;
        }
    }
    const stopRef = useRef(stop);
    useEffect(() => {
        stopRef.current = stop;
    });
    const tingoRunning = status === "tingo";
    useEffect(() => {
        if (!tingoRunning) return;
        const delay = TINGO_MIN_MS + Math.random() * (TINGO_MAX_MS - TINGO_MIN_MS);
        const auto = setTimeout(() => stopRef.current(), delay);
        function onKey(e: KeyboardEvent) {
            if ((e.key !== "Enter" && e.key !== " " && e.key !== "ArrowRight") || e.repeat) return;
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLButtonElement) return;
            e.preventDefault();
            stopRef.current();
        }
        addEventListener("keydown", onKey);
        return () => {
            clearTimeout(auto);
            removeEventListener("keydown", onKey);
        };
    }, [tingoRunning, code]);

    // Every screen goes through this, so the tree shape is the same with debug on or off
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

    if (room === undefined) return withDebug(<Message text="Cargando…" />);
    if (room === null) return withDebug(<Message text="Esta sala ya no existe." onBack={onExit} />);

    async function closeRoom() {
        await deleteRoom(code);
        onExit();
    }

    // A fresh room with this room's settings; we move first, then delete, so the host
    // never sees "room no longer exists". Players of the old room see "room closed".
    async function freshRoom(r: TingoRoom) {
        const next = await createRoom();
        await applySettings(next, { topic: r.topic, readSeconds: r.readSeconds, answerSeconds: r.answerSeconds, questionCount: questionCountOf(r) });
        onNewRoom(next);
        await deleteRoom(code).catch((e) => console.error(`Could not delete room ${code}`, e));
    }

    const newRoom = () =>
        freshRoom(room).catch((e) => {
            console.error("Could not create a new room", e);
            alert("No se pudo crear la sala nueva. Revisa la conexión e intenta de nuevo.");
        });

    if (room.status === "lobby") {
        return withDebug(
            <HostLobby room={room} questionSource={questionSource} basePath={basePath} onExit={closeRoom} onLogout={onLogout} />
        );
    }

    if (room.status === "end") {
        if (!splashDone) return withDebug(<GameOverSplash onDone={() => setSplashDone(true)} />);
        const everyone = Object.values(room.players);
        return withDebug(
            <EndScreen
                players={everyone}
                actions={
                    <EndActions
                        players={everyone.length}
                        sameLabel={everyone.length > 0 && !hasScores(everyone) ? "🔁 ¡Revancha!" : "🔁 Otra partida, misma sala"}
                        onSameRoom={() => backToLobby(code)}
                        onNewRoom={newRoom}
                        onClose={closeRoom}
                    />
                }
            />
        );
    }

    // tingo or tango
    const humans = Object.values(room.players).filter((p) => !p.bot).length;
    const gameMenu: MenuItem[] = [
        { label: "🐞 Modo debug", on: room.debug === true, onClick: () => toggleRoomDebug(code, room.debug !== true) },
        {
            label: "↩ Reiniciar juego",
            separatorBefore: true,
            onClick: () =>
                confirm("¿Reiniciar? Se pierden los puntajes y todos vuelven a la sala de espera.") && backToLobby(code),
        },
        { label: "🏁 Terminar juego (ver podio)", onClick: () => endGame(code) },
        {
            label: "Cerrar sala",
            danger: true,
            separatorBefore: true,
            onClick: () => (humans === 0 || confirm(`${humans} jugadores quedarán por fuera. ¿Continuar?`)) && closeRoom(),
        },
    ];

    // Exact match: a stale landedRound from a previous game (rounds restart at 1) must
    // not skip the landing animation
    const questionOpen = room.status === "tango" && room.question !== null && landedRound === room.round;

    return withDebug(
        // Natural flow: short windows scroll instead of clipping (never overflow-hidden)
        <div className={`min-h-dvh flex flex-col bg-slate-900 text-white overflow-x-hidden px-3 py-2 ${dotted}`}>
            <header className="shrink-0 flex items-center justify-between gap-3">
                <p className="text-base md:text-lg font-bold">
                    Tingo Tango <span className="inline-block w-3 h-3 rounded-full bg-red-500" aria-hidden />{" "}
                    <span className="opacity-60 font-normal hidden sm:inline">
                        {/* total = opened (round) + still in the bag; while the ball jumps, show the upcoming one */}
                        · Sala {room.code} · Pregunta{" "}
                        {room.status === "tango" ? room.round : Math.min(room.round + room.queue.length, room.round + 1)} de {room.round + room.queue.length}
                    </span>
                </p>
                <div className="flex items-center gap-3">
                    <SoundToggle />
                    <ProfileMenu items={gameMenu} />
                </div>
            </header>

            {questionOpen ? (
                // Explicit height: the question layout needs a bounded box (useFitText),
                // with a floor so very short windows grow the page and scroll instead
                <main className="h-[calc(100dvh-3.5rem)] min-h-[30rem] pt-2">
                    <TangoQuestionView key={room.round} room={room} code={code} />
                </main>
            ) : (
                <>
                    <ChantBoard
                        playerCount={Object.keys(room.players).length}
                        // Fallback player: if the chosen one left right at the tango, the
                        // moment still plays and the question still opens
                        selected={room.status === "tango" ? (selectedPlayer(room) ?? { id: "gone", name: "…", score: 0 }) : null}
                        hopMs={hopMsOf(room)}
                        onLanded={() => setLandedRound(room.round)}
                    />
                    <footer className="shrink-0 flex items-center justify-center gap-6 py-2">
                        {room.status === "tingo" ? (
                            <>
                                <TangoButton onClick={stop} />
                                <p className="text-sm opacity-70 max-w-56 text-left">
                                    También puede detenerse sola… (o pulsa <b>Espacio</b>)
                                </p>
                            </>
                        ) : (
                            <p className="text-2xl font-bold text-yellow-300">🛑 ¡Tango!</p>
                        )}
                    </footer>
                </>
            )}
        </div>
    );
}

// 🔊/🔇 in the corner; remembered on this device. Sounds only play on this screen.
function SoundToggle() {
    const [on, setOn] = useState(isSoundOn);
    return (
        <button
            type="button"
            aria-label={on ? "Silenciar" : "Activar sonido"}
            onClick={() => {
                setSoundOn(!on);
                setOn(!on);
            }}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-xl cursor-pointer"
        >
            {on ? "🔊" : "🔇"}
        </button>
    );
}

// Big red stop button, pulsing like the ball
function TangoButton({ onClick }: { onClick: () => void }) {
    const el = useRef<HTMLButtonElement>(null);
    useLayoutEffect(() => {
        if (MOTION === 0 || !el.current) return;
        const node = el.current;
        const tween = gsap.to(node, { scale: 1.06, duration: 0.5, yoyo: true, repeat: -1, ease: "sine.inOut" });
        return () => {
            tween.kill();
            gsap.set(node, { clearProps: "transform" });
        };
    }, []);
    return (
        <button
            ref={el}
            onClick={onClick}
            className="bg-red-500 text-white text-3xl font-extrabold px-10 py-3 rounded-2xl shadow-[0_0_24px_rgba(239,68,68,0.6)] cursor-pointer hover:bg-red-400"
        >
            🛑 ¡Tango!
        </button>
    );
}

type EndActionsProps = {
    players: number;
    sameLabel: string; // "🔁 Otra partida, misma sala", or "🔁 ¡Revancha!" when nobody scored
    onSameRoom: () => Promise<void>;
    onNewRoom: () => Promise<void>;
    onClose: () => Promise<void>;
};

// After the podium the teacher decides: same room (players stay) or a new room (new code).
// Rises in once the podium has finished. Enter = same room.
function EndActions({ players, sameLabel, onSameRoom, onNewRoom, onClose }: EndActionsProps) {
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
            // A focused button handles its own Enter (e.g. "Nueva sala")
            if (e.key !== "Enter" || e.repeat || e.target instanceof HTMLButtonElement) return;
            e.preventDefault();
            runRef.current(() => sameRef.current());
        }
        addEventListener("keydown", onKey);
        return () => removeEventListener("keydown", onKey);
    }, []);

    const confirmed = () => players === 0 || confirm(`${players} ${players === 1 ? "jugador quedará" : "jugadores quedarán"} por fuera. ¿Continuar?`);
    const button = "text-2xl font-bold px-6 py-3 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
    return (
        <div ref={box} className="flex flex-col items-center gap-3 opacity-0">
            <div className="flex flex-wrap justify-center gap-3">
                <button type="button" disabled={busy} onClick={() => run(onSameRoom)} className={`${button} bg-yellow-300 text-black hover:bg-white`}>
                    {sameLabel}
                </button>
                <button type="button" disabled={busy} onClick={() => confirmed() && run(onNewRoom)} className={`${button} bg-white text-slate-900 hover:bg-yellow-300`}>
                    ✨ Nueva sala
                </button>
            </div>
            <p className="text-sm opacity-70">Misma sala: los jugadores siguen dentro. Nueva sala: código nuevo para otro grupo. (Enter = misma sala)</p>
            <button type="button" disabled={busy} onClick={() => run(onClose)} className="text-white underline opacity-80 hover:opacity-100 cursor-pointer">
                Cerrar sala
            </button>
        </div>
    );
}
