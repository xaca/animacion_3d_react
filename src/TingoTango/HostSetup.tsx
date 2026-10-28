import gsap from "gsap";
import { lazy, Suspense, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { pulse, staggerIn } from "./anim";
import { toggleRoomDebug } from "./debugSwitch";
import { MOTION } from "./motion";
import ProfileMenu, { type MenuItem } from "./ProfileMenu";
import { useTopics } from "./questionSource";
import {
    cleanRooms,
    listOldRooms,
    openRoom,
    questionCountOf,
    setAnswerSeconds,
    setQuestionCount,
    setReadSeconds,
    setTopic,
    type TingoRoom,
} from "./roomService";
import Tabs from "./Tabs";
import { TOPICS } from "./topics";
import { ANSWER_SECONDS_CHOICES, QUESTION_COUNT_CHOICES, READ_SECONDS_CHOICES, type QuestionSource, type TopicInfo } from "./types";
import { dotted } from "./ui";

// Downloaded only when the teacher opens "📥 Subir tema"
const UploadTopicModal = lazy(() => import("./UploadTopicModal"));

type Props = {
    room: TingoRoom;
    questionSource: QuestionSource;
    onExit: () => void; // deletes the room and goes home
    onLogout: () => void;
};

const STEPS = ["Tema", "Tiempos", "Preguntas", "Resumen"];

// Host-only configuration as four free steps (tabs): topic → times → how many questions
// → summary with Abrir sala. The code is
// hidden on purpose: phones join from the lobby. Every value shown comes from the live
// room; only the step is local to this screen.
export default function HostSetup({ room, questionSource, onExit, onLogout }: Props) {
    const [step, setStep] = useState(0);
    const [visited, setVisited] = useState<Set<number>>(() => new Set([0]));
    const [uploading, setUploading] = useState(false);
    const [busy, setBusy] = useState(false);
    const busyRef = useRef(false);
    const topics = useTopics(questionSource);
    const topic = topics.find((t) => t.id === room.topic);
    const players = Object.values(room.players);
    const humans = players.filter((p) => !p.bot).length;

    function goTo(next: number) {
        const to = Math.min(STEPS.length - 1, Math.max(0, next));
        setStep(to);
        setVisited((v) => (v.has(to) ? v : new Set(v).add(to)));
    }

    // Guards against double opens (click + Enter)
    async function open() {
        if (busyRef.current) return;
        busyRef.current = true;
        setBusy(true);
        try {
            await openRoom(room.code);
        } catch (e) {
            console.error("Could not open the room", e);
            alert("No se pudo abrir la sala. Revisa la conexión e intenta de nuevo.");
        } finally {
            busyRef.current = false;
            setBusy(false);
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
        { label: "📥 Subir tema (JSON)", onClick: () => setUploading(true) },
        { label: "🐞 Modo debug", on: room.debug === true, onClick: () => toggleRoomDebug(room.code, room.debug !== true), separatorBefore: true },
        { label: "🧹 Limpiar salas viejas", onClick: cleanOldRooms },
        {
            label: "Cerrar sala",
            danger: true,
            separatorBefore: true,
            onClick: () => (humans === 0 || confirm(`${humans} jugadores quedarán por fuera. ¿Continuar?`)) && onExit(),
        },
        { label: "Cerrar sesión", onClick: onLogout },
    ];

    // Entrance: header and tabs fade down once
    const head = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        const tween = gsap.fromTo(
            head.current!.children,
            { autoAlpha: 0, y: -14 },
            { autoAlpha: 1, y: 0, duration: 0.35 * MOTION, stagger: 0.06 * MOTION, ease: "power2.out", clearProps: "transform,opacity,visibility" }
        );
        return () => {
            tween.kill();
        };
    }, []);

    // Step content slides in from the side we're moving toward (from below on the first one).
    // The panel is keyed by step, so a fast click just starts the next panel's tween.
    const panel = useRef<HTMLDivElement>(null);
    const prevStep = useRef<number | null>(null);
    useLayoutEffect(() => {
        const dir = prevStep.current === null ? 0 : Math.sign(step - prevStep.current);
        prevStep.current = step;
        if (!panel.current) return;
        const tween = staggerIn(panel.current.querySelectorAll(".su-item"), dir);
        return () => {
            tween.kill();
        };
    }, [step]);

    const count = questionCountOf(room);
    const steps = STEPS.map((label, i) => ({ value: i, label: `${visited.has(i) && i !== step ? "✓" : i + 1} · ${label}` }));
    const footerButton = "font-bold text-xl px-5 py-2 rounded-lg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

    return (
        <div className={`h-dvh flex flex-col bg-slate-900 text-white text-center overflow-hidden ${dotted}`}>
            <div ref={head} className="shrink-0 flex flex-col items-center gap-3 px-4 pt-4">
                <header className="w-full flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-2xl md:text-4xl font-bold">
                        Prepara el juego <span className="inline-block w-3 h-3 md:w-4 md:h-4 rounded-full bg-red-500" aria-hidden />
                    </h1>
                    <div className="flex flex-wrap items-center justify-center gap-2 text-base md:text-lg">
                        <Summary text={topic?.name ?? "Elige un tema"} strong />
                        <Summary text={`leer ${room.readSeconds} s · responder ${room.answerSeconds} s`} />
                        <Summary text={count === 0 ? "todas las preguntas" : `${count} preguntas`} />
                    </div>
                    <ProfileMenu items={menu} />
                </header>
                <Tabs label="Pasos de la configuración" items={steps} value={step} onChange={goTo} big />
            </div>

            <div ref={panel} key={step} role="tabpanel" className="flex-1 min-h-0 overflow-y-auto flex flex-col items-center gap-4 px-4 py-5">
                {step === 0 && (
                    <>
                        {players.length > 0 && (
                            <p className="su-item bg-yellow-300 text-black font-bold text-lg rounded-xl px-5 py-2">
                                🎉 {players.length} {players.length === 1 ? "jugador espera" : "jugadores esperan"} en la sala{" "}
                                <span className="tracking-widest">{room.code}</span> — siguen dentro mientras ajustas
                            </p>
                        )}
                        <TopicStep
                            topics={topics}
                            value={room.topic}
                            onPick={(id) => {
                                setTopic(room.code, id);
                                goTo(1);
                            }}
                            onUpload={() => setUploading(true)}
                        />
                    </>
                )}
                {step === 1 && (
                    <>
                        <Choice label="⏱️ Tiempo para leer" hint="La pregunta sale sola; luego aparecen las opciones.">
                            <Tabs
                                label="Tiempo para leer"
                                items={READ_SECONDS_CHOICES.map((s) => ({ value: s, label: `${s} s` }))}
                                value={room.readSeconds}
                                onChange={(s) => setReadSeconds(room.code, s)}
                                big
                            />
                        </Choice>
                        <Choice label="✋ Tiempo para responder" hint="Empieza cuando aparecen las opciones.">
                            <Tabs
                                label="Tiempo para responder"
                                items={ANSWER_SECONDS_CHOICES.map((s) => ({ value: s, label: `${s} s` }))}
                                value={room.answerSeconds}
                                onChange={(s) => setAnswerSeconds(room.code, s)}
                                big
                            />
                        </Choice>
                    </>
                )}
                {step === 2 && (
                    <Choice label="❓ Preguntas por partida" hint="10 preguntas ≈ 6–8 minutos. «Todas» usa el tema completo.">
                        <Tabs
                            label="Preguntas por partida"
                            items={QUESTION_COUNT_CHOICES.map((n) => ({ value: n, label: n === 0 ? "Todas" : `${n}` }))}
                            value={count}
                            onChange={(n) => setQuestionCount(room.code, n)}
                            big
                        />
                    </Choice>
                )}
                {step === 3 && (
                    <div className="su-item w-full max-w-xl bg-slate-800 border border-white/10 rounded-2xl p-5 text-left space-y-3">
                        <p className="text-2xl font-bold">Así queda la partida</p>
                        <SummaryRow label="Tema" value={topic?.name ?? "Sin tema — elige uno"} onChange={() => goTo(0)} />
                        <SummaryRow label="Tiempos" value={`${room.readSeconds} s para leer + ${room.answerSeconds} s para responder`} onChange={() => goTo(1)} />
                        <SummaryRow label="Preguntas" value={count === 0 ? "Todas las del tema" : `${count} por partida`} onChange={() => goTo(2)} />
                        <p className="text-sm opacity-70 pt-1">La bolita no repite estudiante hasta que todos hayan pasado. Al abrir la sala aparecen el código y el QR.</p>
                    </div>
                )}
            </div>

            <footer className="shrink-0 flex items-center justify-between gap-3 px-4 py-3 border-t border-white/10 bg-slate-900/90">
                <button type="button" disabled={step === 0} onClick={() => goTo(step - 1)} className={`${footerButton} bg-white/10 hover:bg-white/20`}>
                    ← Atrás
                </button>
                <span className="opacity-70 hidden sm:block">
                    Paso {step + 1} de {STEPS.length}
                </span>
                {step < STEPS.length - 1 ? (
                    <button type="button" onClick={() => goTo(step + 1)} className={`${footerButton} bg-white text-slate-900 hover:bg-yellow-300`}>
                        Siguiente →
                    </button>
                ) : (
                    <button type="button" disabled={busy || !topic} onClick={open} className={`${footerButton} bg-yellow-300 text-black hover:bg-white text-2xl`}>
                        {busy ? "Abriendo…" : "Abrir sala →"}
                    </button>
                )}
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

// Topic cards: the seeded ones, then the teacher's uploads (📥 badge), then "upload one"
function TopicStep({ topics, value, onPick, onUpload }: { topics: TopicInfo[]; value: string; onPick: (id: string) => void; onUpload: () => void }) {
    return (
        <div className="w-full max-w-5xl grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-3">
            {topics.map((t) => {
                const selected = t.id === value;
                return (
                    <button
                        key={t.id}
                        type="button"
                        onClick={() => onPick(t.id)}
                        aria-pressed={selected}
                        className={`su-item relative text-left rounded-2xl p-4 border-2 cursor-pointer transition-colors ${
                            selected ? "bg-yellow-300 text-black border-black" : "bg-slate-800 border-white/10 hover:border-white/40"
                        }`}
                    >
                        {t.custom && (
                            <span className={`absolute top-2 right-2 text-xs font-bold rounded-full px-2 py-0.5 ${selected ? "bg-black/15" : "bg-white/15"}`}>
                                📥 Subido
                            </span>
                        )}
                        <p className="text-xl font-bold pr-16">{t.name}</p>
                        {t.tagline && <p className={`text-sm mt-1 ${selected ? "opacity-80" : "opacity-60"}`}>{t.tagline}</p>}
                    </button>
                );
            })}
            <button
                type="button"
                onClick={onUpload}
                className="su-item rounded-2xl p-4 border-2 border-dashed border-white/30 hover:border-white/70 cursor-pointer text-left opacity-80 hover:opacity-100"
            >
                <p className="text-xl font-bold">📥 Subir tema nuevo</p>
                <p className="text-sm opacity-70 mt-1">Pega o elige un JSON con tus preguntas</p>
            </button>
        </div>
    );
}

function Choice({ label, hint, children }: { label: string; hint: string; children: ReactNode }) {
    return (
        <div className="su-item flex flex-col items-center gap-2">
            <p className="text-2xl font-bold">{label}</p>
            {children}
            <p className="text-sm opacity-60">{hint}</p>
        </div>
    );
}

// One line of the summary step, with a shortcut back to its step
function SummaryRow({ label, value, onChange }: { label: string; value: string; onChange: () => void }) {
    return (
        <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-3">
            <div className="min-w-0">
                <p className="text-sm opacity-60">{label}</p>
                <p className="text-lg font-bold">{value}</p>
            </div>
            <button type="button" onClick={onChange} className="shrink-0 underline opacity-80 hover:opacity-100 cursor-pointer">
                cambiar
            </button>
        </div>
    );
}

// Summary chip in the header; pulses when its value changes
function Summary({ text, strong }: { text: string; strong?: boolean }) {
    const el = useRef<HTMLSpanElement>(null);
    const mounted = useRef(false);
    useLayoutEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
            return;
        }
        const tween = pulse(el.current);
        return () => {
            tween.kill();
        };
    }, [text]);
    return (
        <span ref={el} className={`rounded-full px-3 py-1 ${strong ? "bg-yellow-300 text-black font-bold" : "bg-white/10"}`}>
            {text}
        </span>
    );
}
