import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef } from "react";
import Countdown from "../Countdown";
import { LETTERS } from "../questions";
import { useFitText } from "../useFitText";
import { MOTION } from "./panelMode";
import { useBots } from "./useBots";
import { useServerCheck } from "./useServerCheck";
import {
    allTeamsAnswered,
    answerProgress,
    closeTile,
    isLastTile,
    optionsVisible,
    revealAnswer,
    showOptions,
    tilesLeft,
    type Room,
} from "./roomService";

// Extra time after the host's countdown before closing, so a phone that received the
// options late (through its 2 s server check when the live push lags) still gets its time
const CLOSE_GRACE_MS = 3000;
// While answers come in, the host also reads the room directly every 3 s, so a late push
// doesn't delay "everyone answered → reveal" or the "N/M answered" counter
const ANSWERS_CHECK_MS = 3000;

const yellowButton = "bg-yellow-300 text-black font-bold text-2xl px-8 py-3 rounded-lg shadow-lg cursor-pointer hover:bg-yellow-200";
const outlineButton = "border-4 border-white/60 text-white font-bold text-xl px-5 py-2 rounded-lg cursor-pointer hover:bg-white/10";

// Host's question screen, keyed per tile by the caller (local mode keeps QuestionModal).
// Fixed layout that always fills the board panel with no scrolling: top bar, auto-fitting
// question, 2×2 options, bottom bar with the status and one main action. This screen is
// the game's clock: its countdowns reveal the options and close the question, so the
// host tab must stay open.
export default function HostQuestionView({ room, code }: { room: Room; code: string }) {
    const active = room.activeTile!;
    const tile = room.board[active.col].tiles[active.row];
    const reading = !optionsVisible(room) && !room.revealed;
    const revealed = room.revealed;
    const last = isLastTile(room);
    const left = tilesLeft(room) - 1; // after this one
    const { answered, total } = answerProgress(room);
    const winners = room.teams.filter((t) => room.answers.some((a) => a.team === t.id && a.correct));
    useBots(room);
    useServerCheck(code, !reading && !revealed, ANSWERS_CHECK_MS, ANSWERS_CHECK_MS);

    // No need to wait for the timer once every team has answered
    const everyoneAnswered = allTeamsAnswered(room);
    useEffect(() => {
        if (everyoneAnswered && !revealed) revealAnswer(code);
    }, [everyoneAnswered, revealed, code]);

    // One main action per moment; the busy ref swallows double clicks and double Enters
    const busy = useRef(false);
    async function mainAction() {
        if (busy.current) return;
        busy.current = true;
        try {
            if (reading) await showOptions(code);
            else if (!revealed) await revealAnswer(code);
            else await closeTile(code);
        } finally {
            busy.current = false;
        }
    }

    // Enter / → press the main button (keyboard or presentation clicker)
    const mainRef = useRef(mainAction);
    useEffect(() => {
        mainRef.current = mainAction;
    });
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if ((e.key !== "Enter" && e.key !== "ArrowRight") || e.repeat) return;
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;
            e.preventDefault();
            mainRef.current();
        }
        addEventListener("keydown", onKey);
        return () => removeEventListener("keydown", onKey);
    }, []);

    // `reading` is a dependency: the question area is taller during the reading time
    const fitRef = useFitText<HTMLDivElement>(60, 20, [tile.question, tile.code, reading]);

    // Options slide in together when they appear (with reading time 0: on mount)
    const optionsBox = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        if (reading || !optionsBox.current) return;
        const tween = gsap.fromTo(
            optionsBox.current.querySelectorAll(".hq-option"),
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: 0.3 * MOTION, stagger: 0.06 * MOTION }
        );
        return () => {
            tween.kill();
        };
    }, [reading]);

    // Reveal: flash the correct option and bring in the yellow button with a glow pulse
    const btnBox = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        if (!revealed) return;
        const tl = gsap.timeline();
        const correct = optionsBox.current?.querySelector(".hq-correct");
        if (correct) tl.fromTo(correct, { scale: 1 }, { scale: 1.06, duration: 0.18 * MOTION, yoyo: true, repeat: 1, ease: "power1.inOut" });
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
    }, [revealed]);

    return (
        <div className="h-full flex flex-col gap-3 text-white">
            <header className="shrink-0 flex items-center gap-4 flex-wrap">
                <p className="text-xl opacity-80">
                    {room.board[active.col].name} — {tile.value}
                </p>
                {last && <span className="bg-yellow-300 text-black font-bold text-sm px-2 py-0.5 rounded">⭐ Final question</span>}
                <div className="ml-auto w-56 md:w-80">
                    {reading && room.readEndsAt !== null ? (
                        <Countdown endsAt={room.readEndsAt} totalSeconds={room.readSeconds} label="Options in" onDone={() => showOptions(code)} />
                    ) : !revealed && room.questionEndsAt !== null ? (
                        <Countdown
                            endsAt={room.questionEndsAt}
                            totalSeconds={room.timerSeconds}
                            onDone={() => setTimeout(() => revealAnswer(code), CLOSE_GRACE_MS)}
                        />
                    ) : null}
                </div>
            </header>

            {/* Children use em sizes, so useFitText scales question and code together. They are
                shrink-0: if flex squeezed them, the code would clip internally and the fit hook
                would never see the overflow (code snippets showed only their first line). During
                the reading time the question takes most of the height; the placeholder needs none. */}
            <div
                ref={fitRef}
                className={`${reading ? "flex-[5]" : "flex-[2]"} min-h-0 overflow-hidden flex flex-col items-center justify-center text-center gap-[0.4em] px-4`}
            >
                <p className="shrink-0 font-bold leading-tight max-w-full">{tile.question}</p>
                {tile.code && (
                    <pre className="shrink-0 bg-black/40 rounded-lg text-left text-[0.45em] leading-snug px-6 py-3 max-w-full overflow-hidden">{tile.code}</pre>
                )}
            </div>

            {reading ? (
                <div className="flex-[1] min-h-0 flex items-center justify-center">
                    <p className="text-2xl opacity-70">Read the question… the options are coming.</p>
                </div>
            ) : (
                <div ref={optionsBox} className="flex-[3] min-h-0 grid grid-cols-2 grid-rows-2 gap-3">
                    {tile.options.map((option, i) => (
                        <Option key={option} letter={LETTERS[i]} text={option} revealed={revealed} correct={option === tile.answer} />
                    ))}
                </div>
            )}

            <footer className="shrink-0 min-h-16 flex items-end justify-between gap-4">
                {reading ? (
                    <p className="text-xl opacity-80">Everyone reads first — no answers yet.</p>
                ) : !revealed ? (
                    <p className="text-2xl font-bold">
                        {answered}/{total} teams answered
                    </p>
                ) : (
                    <p className="text-2xl md:text-3xl font-bold text-yellow-300">
                        {winners.length === 0 ? "Nobody got it!" : `Correct: ${winners.map((t) => t.name).join(", ")}`}
                    </p>
                )}
                {revealed ? (
                    <div ref={btnBox} className="flex flex-col items-end gap-1 opacity-0">
                        <button onClick={mainAction} className={yellowButton}>
                            {last ? "🏆 See final results" : "Next question →"}
                        </button>
                        <p className="text-sm opacity-70">{last ? "That was the last question!" : `${left} question${left === 1 ? "" : "s"} left`}</p>
                    </div>
                ) : (
                    <button onClick={mainAction} className={outlineButton}>
                        {reading ? "Show options now" : "Show answer"}
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
            className={`hq-option min-h-0 overflow-hidden rounded-lg border-4 px-4 py-2 text-left font-bold flex items-center gap-3 ${
                revealed && correct ? "hq-correct bg-yellow-300 text-black border-black" : revealed ? "border-white/20 opacity-40" : "border-white/40"
            }`}
        >
            <span className="opacity-60">{letter}</span>
            <span>{text}</span>
        </button>
    );
}
