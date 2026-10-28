import gsap from "gsap";
import { lazy, Suspense, useLayoutEffect, useRef, useState } from "react";
import { staggerIn } from "./anim";
import { toggleRoomDebug } from "./debugSwitch";
import JoinQr from "./JoinQr";
import { MOTION } from "./motion";
import ProfileMenu, { type MenuItem } from "./ProfileMenu";
import { buildQueue, useTopics } from "./questionSource";
import {
    addBot,
    backToSetup,
    cleanRooms,
    listOldRooms,
    removeBots,
    questionCountOf,
    setTopic,
    startGame,
    startProblem,
    type TingoRoom,
} from "./roomService";
import { unlockSound } from "./sound";
import { TOPICS } from "./topics";
import type { QuestionSource } from "./types";
import { dotted, linkButton } from "./ui";

// Downloaded only when the teacher opens "📥 Subir tema"
const UploadTopicModal = lazy(() => import("./UploadTopicModal"));

type Props = {
    room: TingoRoom;
    questionSource: QuestionSource;
    basePath: string;
    onExit: () => void;
    onLogout: () => void;
};

// Waiting room on the big screen: QR + code, a summary of the settings chosen in setup
// (⚙ Ajustes goes back there) and the players arriving as cards.
export default function HostLobby({ room, questionSource, basePath, onExit, onLogout }: Props) {
    const [starting, setStarting] = useState(false);
    const [error, setError] = useState("");
    const [uploading, setUploading] = useState(false);
    const players = Object.values(room.players);
    const problem = startProblem(room);
    const debug = room.debug === true;
    const humans = players.filter((p) => !p.bot).length;

    // Guards against double Start (click + Enter)
    const startingRef = useRef(false);
    async function start() {
        if (startingRef.current) return;
        startingRef.current = true;
        setStarting(true);
        setError("");
        unlockSound(); // first user gesture: the AudioContext is ready before the show
        try {
            const queue = buildQueue(await questionSource.load(room.topic));
            await startGame(room.code, queue);
        } catch (e) {
            console.error("Could not start the game", e);
            setError(e instanceof Error ? e.message : "No se pudo empezar. Revisa la conexión e intenta de nuevo.");
        } finally {
            startingRef.current = false;
            setStarting(false);
        }
    }

    async function cleanOldRooms() {
        try {
            const old = await listOldRooms(room.code);
            if (old.length === 0) {
                alert("No hay salas viejas que limpiar ✨");
                return;
            }
            const oldest = Math.min(...old.map((r) => r.createdAt ?? Date.now()));
            const days = Math.max(1, Math.round((Date.now() - oldest) / 86_400_000));
            if (!confirm(`Se borrarán ${old.length} salas viejas (la más antigua tiene ~${days} d). Las preguntas no se tocan. ¿Continuar?`)) return;
            await cleanRooms(old.map((r) => r.code));
        } catch (e) {
            console.error("Could not clean old rooms", e);
            alert("No se pudieron limpiar las salas. Revisa la conexión.");
        }
    }

    const menu: MenuItem[] = [
        { label: "⚙ Ajustes del juego", onClick: () => backToSetup(room.code) },
        // Uploaded topics show up in ⚙ Ajustes (step 1 · Tema) right away
        { label: "📥 Subir tema (JSON)", onClick: () => setUploading(true) },
        { label: "🧪 Agregar jugador de prueba", onClick: () => addBot(room.code) },
        ...(players.some((p) => p.bot) ? [{ label: "🧹 Quitar jugadores de prueba", onClick: () => removeBots(room.code) }] : []),
        { label: "🐞 Modo debug", on: debug, onClick: () => toggleRoomDebug(room.code, !debug), separatorBefore: true },
        { label: "🧹 Limpiar salas viejas", onClick: cleanOldRooms },
        {
            label: "Cerrar sala",
            danger: true,
            separatorBefore: true,
            onClick: () => (humans === 0 || confirm(`${humans} jugadores quedarán por fuera. ¿Continuar?`)) && onExit(),
        },
        { label: "Cerrar sesión", onClick: onLogout },
    ];

    const topic = useTopics(questionSource).find((t) => t.id === room.topic);
    const count = questionCountOf(room);

    // Entrance: header and panels drop in, player cards pop as they arrive
    const root = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        const tween = staggerIn(root.current!.querySelectorAll(".lb-item"));
        return () => {
            tween.kill();
        };
        // Mount only
         
    }, []);

    return (
        // Natural flow on EVERY size: scroll appears only when the content doesn't fit
        // (never overflow-hidden on the root — a wide-but-short window must scroll too).
        // The sticky footer keeps ▶ ¡Empezar! always in view.
        <div ref={root} className={`min-h-dvh text-white flex flex-col gap-2 px-3 md:px-4 py-3 bg-slate-900 ${dotted}`}>
            <header className="shrink-0 flex items-start justify-between gap-4">
                <h1 className="lb-item text-2xl md:text-4xl font-bold">
                    Tingo Tango <span className="inline-block w-3 h-3 md:w-4 md:h-4 rounded-full bg-red-500" aria-hidden />
                </h1>
                <ProfileMenu items={menu} />
            </header>

            <section className="shrink-0 mt-1 flex flex-wrap items-start justify-center gap-4">
                {/* Join card: QR and code side by side, compact so short screens fit it */}
                <div className="lb-item bg-slate-800 rounded-2xl p-3 md:p-4 shadow-xl flex flex-wrap items-center justify-center gap-4 text-center">
                    <div className="bg-white rounded-xl p-2 shadow">
                        <JoinQr code={room.code} basePath={basePath} size={150} />
                    </div>
                    <div className="flex flex-col items-center gap-1 max-w-sm">
                        {/* Wraps only at the slash (never mid-word like "tingo/j·oin") */}
                        <p className="text-base md:text-xl break-words">
                            Entra a{" "}
                            <b>
                                {location.host}
                                <wbr />
                                {basePath}/join
                            </b>
                        </p>
                        <p className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[0.25em] bg-black/40 rounded-xl px-4 py-1">{room.code}</p>
                        <p className="text-sm opacity-80">con el código o escaneando el QR</p>
                    </div>
                </div>
                {/* Settings live in setup; this card only recaps them */}
                <div className="lb-item bg-slate-800 rounded-2xl p-4 shadow-xl flex flex-col items-start gap-1 text-left max-w-sm">
                    <p className="text-sm opacity-70">Tema</p>
                    <p className="text-2xl font-bold leading-tight">{topic?.name ?? "Tema no encontrado"}</p>
                    {topic?.tagline && <p className="text-xs opacity-60">{topic.tagline}</p>}
                    <p className="mt-2 opacity-90">
                        {count === 0 ? "Todas las preguntas" : `${count} preguntas`} · {room.readSeconds} s para leer + {room.answerSeconds} s para responder
                    </p>
                    <button
                        type="button"
                        onClick={() => backToSetup(room.code)}
                        className="mt-2 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-1.5 font-bold cursor-pointer"
                    >
                        ⚙ Ajustes
                    </button>
                </div>
            </section>

            <p className="lb-item shrink-0 text-center text-xl md:text-2xl font-bold">
                👥 {players.length} {players.length === 1 ? "jugador" : "jugadores"} en la sala
            </p>

            <main className="flex-1 w-full max-w-6xl mx-auto flex flex-wrap content-center justify-center gap-3 py-2">
                {players.length === 0 ? (
                    <p className="opacity-70 text-xl">Esperando jugadores…</p>
                ) : (
                    players.map((p) => <PlayerCard key={p.id} name={p.name} />)
                )}
            </main>

            {/* Sticky: even when the page scrolls, Start never leaves the screen */}
            <footer className="sticky bottom-0 z-30 shrink-0 -mx-3 md:-mx-4 px-3 md:px-4 py-2 bg-slate-900/90 backdrop-blur border-t border-white/10 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <p className="hidden sm:block bg-black/30 rounded-full px-4 py-1.5 text-xs md:text-sm opacity-90">
                    {count === 0 ? "Todas las preguntas" : `${count} preguntas`} · {room.readSeconds} s para leer + {room.answerSeconds} s para responder ·
                    nadie repite hasta que todos pasen
                </p>
                <div className="flex-1 min-w-40 text-center">
                    {problem && players.length === 0 && <p className="text-yellow-300 text-sm">{problem}</p>}
                    {error && <p className="text-yellow-300 font-bold">{error}</p>}
                </div>
                <div className="flex items-center gap-3">
                    <StartButton onClick={start} disabled={starting || problem !== null} starting={starting} />
                    <button className={`${linkButton} text-xs`} onClick={() => toggleRoomDebug(room.code, !debug)}>
                        🐞 {debug ? "on" : "off"}
                    </button>
                </div>
            </footer>
            {uploading && (
                <Suspense fallback={null}>
                    <UploadTopicModal
                        onClose={() => setUploading(false)}
                        // The room pointed at the topic just deleted: back to the first seeded one
                        onDeleted={(id) => id === room.topic && setTopic(room.code, TOPICS[0].id)}
                    />
                </Suspense>
            )}
        </div>
    );
}

// Big yellow Start with a slow breathing pulse, so the main action glows on the projector
function StartButton({ onClick, disabled, starting }: { onClick: () => void; disabled: boolean; starting: boolean }) {
    const el = useRef<HTMLButtonElement>(null);
    useLayoutEffect(() => {
        if (MOTION === 0 || disabled || !el.current) return;
        const node = el.current;
        const tween = gsap.to(node, { scale: 1.05, duration: 1.1, yoyo: true, repeat: -1, ease: "sine.inOut" });
        return () => {
            tween.kill();
            gsap.set(node, { clearProps: "transform" });
        };
    }, [disabled]);
    return (
        <button
            ref={el}
            onClick={onClick}
            disabled={disabled}
            className="bg-yellow-300 text-black text-xl md:text-3xl font-bold px-6 md:px-10 py-2.5 md:py-3 rounded-xl shadow-lg cursor-pointer hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
        >
            {starting ? "Cargando preguntas…" : "▶ ¡Empezar!"}
        </button>
    );
}

// Small device card per player, bouncing in when they join
function PlayerCard({ name }: { name: string }) {
    const el = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        const tween = gsap.fromTo(
            el.current,
            { scale: 0.5, autoAlpha: 0 },
            { scale: 1, autoAlpha: 1, duration: 0.3 * MOTION, ease: "back.out(1.8)", clearProps: "transform,opacity,visibility" }
        );
        return () => {
            tween.kill();
        };
    }, []);
    return (
        <div ref={el} className="w-20 h-24 md:w-24 md:h-28 rounded-xl border-2 border-slate-900 bg-white text-slate-900 shadow-md flex flex-col items-center justify-end p-2">
            <span className="text-2xl" aria-hidden>
                📱
            </span>
            <p className="w-full text-center text-sm font-bold leading-tight truncate">{name}</p>
        </div>
    );
}
