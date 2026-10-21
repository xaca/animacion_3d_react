import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef } from "react";
import Countdown from "./Countdown";
import { MOTION } from "./motion";
import { correctSound, popSound, tick, wrongSound } from "./sound";
import { isLastQuestion, nextRound, optionsVisible, reveal, selectedPlayer, showOptions, type TingoRoom } from "./roomService";
import { LETTERS, POINTS } from "./types";
import { useBots } from "./useBots";
import { useFitText } from "./useFitText";
import { useServerCheck } from "./useServerCheck";

// Extra time after the host's countdown before closing, so a phone that received the
// options late (through its server check when the live push lags) still gets its time
const CLOSE_GRACE_MS = 3000;
// While the answer is open, the host also reads the room directly every 3 s, so a late
// push doesn't delay "answered → reveal"
const ANSWERS_CHECK_MS = 3000;

const yellowButton = "bg-yellow-300 text-black font-bold text-2xl px-8 py-3 rounded-lg shadow-lg cursor-pointer hover:bg-yellow-200";
const outlineButton = "border-4 border-white/60 text-white font-bold text-xl px-5 py-2 rounded-lg cursor-pointer hover:bg-white/10";

// Host's question screen (status tango, keyed per round by the caller). Fixed layout that
// always fills the stage with no scrolling: top bar, auto-fitting question, 2×2 options,
// bottom bar with one main action. This screen is the game's clock: its countdowns reveal
// the options and close the question, so the host tab must stay open.
export default function TangoQuestionView({ room, code }: { room: TingoRoom; code: string }) {
    const question = room.question!;
    const selected = selectedPlayer(room);
    const reading = !optionsVisible(room) && !room.revealed;
    const revealed = room.revealed;
    const answered = room.choice !== null;
    const correct = answered && room.choice === question.answer;
    const last = isLastQuestion(room);
    useBots(room);
    useServerCheck(code, !reading && !revealed, ANSWERS_CHECK_MS, ANSWERS_CHECK_MS);

    // No need to wait for the timer once the chosen player answered
    useEffect(() => {
        if (answered && !revealed) reveal(code);
    }, [answered, revealed, code]);

    // One main action per moment; the busy ref swallows double clicks and double keys
    const busy = useRef(false);
    async function mainAction() {
        if (busy.current) return;
        busy.current = true;
        try {
            if (reading) await showOptions(code);
            else if (!revealed) await reveal(code);
            else await nextRound(code);
        } finally {
            busy.current = false;
        }
    }

    // Space / Enter / → press the main button (keyboard or presentation clicker)
    const mainRef = useRef(mainAction);
    useEffect(() => {
        mainRef.current = mainAction;
    });
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if ((e.key !== "Enter" && e.key !== "ArrowRight" && e.key !== " ") || e.repeat) return;
            if (
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement ||
                e.target instanceof HTMLSelectElement ||
                e.target instanceof HTMLButtonElement
            )
                return;
            e.preventDefault();
            mainRef.current();
        }
        addEventListener("keydown", onKey);
        return () => removeEventListener("keydown", onKey);
    }, []);

    // `reading` is a dependency: the question area is taller during the reading time
    const fitRef = useFitText<HTMLDivElement>(60, 20, [question.question, question.code, reading]);

    // Options slide in together when they appear (with reading time 0: on mount)
    const optionsBox = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        if (reading || !optionsBox.current) return;
        popSound();
        const tween = gsap.fromTo(
            optionsBox.current.querySelectorAll(".tq-option"),
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: 0.3 * MOTION, stagger: 0.06 * MOTION }
        );
        return () => {
            tween.kill();
        };
    }, [reading]);

    // Tick-tock during the last seconds of the answer time (host clock, display only)
    const ticking = !reading && !revealed && room.questionEndsAt !== null;
    const endsAt = room.questionEndsAt;
    useEffect(() => {
        if (!ticking || endsAt === null) return;
        const id = setInterval(() => {
            const left = endsAt - Date.now();
            if (left > 0 && left <= 3500) tick();
        }, 1000);
        return () => clearInterval(id);
    }, [ticking, endsAt]);

    // Reveal: sound + flash the correct option + bring in the yellow button
    const btnBox = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        if (!revealed) return;
        if (correct) correctSound();
        else wrongSound();
        const tl = gsap.timeline();
        const good = optionsBox.current?.querySelector(".tq-correct");
        if (good) tl.fromTo(good, { scale: 1 }, { scale: 1.06, duration: 0.18 * MOTION, yoyo: true, repeat: 1, ease: "power1.inOut" });
        if (btnBox.current) {
            tl.fromTo(btnBox.current, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35 * MOTION, ease: "back.out(1.8)" }, 0.1 * MOTION);
            tl.fromTo(
                btnBox.current.querySelector("button"),
                { boxShadow: "0 0 0 0 rgba(253, 224, 71, 0.9)" },
                { boxShadow: "0 0 0 14px rgba(253, 224, 71, 0)", duration: 0.7 * MOTION, repeat: 1 },
                "<"
            );
        }
        return () => {
            tl.kill();
        };
        // `correct` is fixed by the time revealed flips
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [revealed]);

    return (
        <div className="h-full flex flex-col gap-3 text-white">
            <header className="shrink-0 flex items-center gap-4 flex-wrap">
                <p className="text-xl">
                    <span className="opacity-80">Ronda {room.round} ·</span> 🎯 Le tocó a <b className="text-yellow-300">{selected?.name ?? "…"}</b>
                </p>
                {last && <span className="bg-yellow-300 text-black font-bold text-sm px-2 py-0.5 rounded">⭐ Última pregunta</span>}
                <div className="ml-auto w-40 sm:w-56 md:w-80">
                    {reading && room.readEndsAt !== null ? (
                        <Countdown endsAt={room.readEndsAt} totalSeconds={room.readSeconds} label="Opciones en" onDone={() => showOptions(code)} />
                    ) : !revealed && room.questionEndsAt !== null ? (
                        <Countdown
                            endsAt={room.questionEndsAt}
                            totalSeconds={room.answerSeconds}
                            onDone={() => setTimeout(() => reveal(code), CLOSE_GRACE_MS)}
                        />
                    ) : null}
                </div>
            </header>

            {/* Children use em sizes, so useFitText scales question and code together */}
            <div
                ref={fitRef}
                className={`${reading ? "flex-[5]" : "flex-[2]"} min-h-0 overflow-hidden flex flex-col items-center justify-center text-center gap-[0.4em] px-4`}
            >
                <p className="shrink-0 font-bold leading-tight max-w-full">{question.question}</p>
                {question.code && (
                    <pre className="shrink-0 bg-black/40 rounded-lg text-left text-[0.45em] leading-snug px-6 py-3 max-w-full overflow-hidden">{question.code}</pre>
                )}
            </div>

            {reading ? (
                <div className="flex-[1] min-h-0 flex items-center justify-center">
                    <p className="text-2xl opacity-70">Todos leen la pregunta… ya vienen las opciones.</p>
                </div>
            ) : (
                <div ref={optionsBox} className="flex-[3] min-h-0 grid grid-cols-1 grid-rows-4 md:grid-cols-2 md:grid-rows-2 gap-2 md:gap-3">
                    {question.options.map((option, i) => (
                        <Option key={option} letter={LETTERS[i]} text={option} revealed={revealed} correct={option === question.answer} />
                    ))}
                </div>
            )}

            <footer className="shrink-0 min-h-16 flex flex-wrap items-end justify-between gap-4">
                {reading ? (
                    <p className="text-xl opacity-80">Primero se lee — aún no se puede responder.</p>
                ) : !revealed ? (
                    <p className="text-2xl font-bold">{answered ? `${selected?.name ?? "Ya"} respondió ✋` : `Esperando a ${selected?.name ?? "…"}…`}</p>
                ) : (
                    <p className={`text-2xl md:text-3xl font-bold ${correct ? "text-yellow-300" : "text-red-400"}`}>
                        {correct
                            ? `✅ ¡${selected?.name ?? "Alguien"} acierta! +${POINTS}`
                            : answered
                              ? `❌ ${selected?.name ?? "Alguien"} no acertó esta vez.`
                              : `⏰ ${selected?.name ?? "Alguien"} no alcanzó a responder.`}
                    </p>
                )}
                {revealed ? (
                    <div ref={btnBox} className="flex flex-col items-end gap-1 opacity-0">
                        <button onClick={mainAction} className={yellowButton}>
                            {last ? "🏆 Ver resultados" : "Siguiente ronda →"}
                        </button>
                        <p className="text-sm opacity-70">
                            {last ? "¡Era la última pregunta!" : `${room.queue.length} pregunta${room.queue.length === 1 ? "" : "s"} en la bolsa`}
                        </p>
                    </div>
                ) : (
                    <button onClick={mainAction} className={outlineButton}>
                        {reading ? "Mostrar opciones ya" : "Mostrar respuesta"}
                    </button>
                )}
            </footer>
        </div>
    );
}

function Option({ letter, text, revealed, correct }: { letter: string; text: string; revealed: boolean; correct: boolean }) {
    const ref = useFitText<HTMLButtonElement>(30, 14, [text]);
    return (
        <button
            ref={ref}
            tabIndex={-1}
            className={`tq-option min-h-0 overflow-hidden rounded-lg border-4 px-4 py-2 text-left font-bold flex items-center gap-3 ${
                revealed && correct ? "tq-correct bg-yellow-300 text-black border-black" : revealed ? "border-white/20 opacity-40" : "border-white/40"
            }`}
        >
            <span className="opacity-60">{letter}</span>
            <span>{text}</span>
        </button>
    );
}
