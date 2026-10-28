import gsap from "gsap";
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { popIn } from "./anim";
import { MOTION } from "./motion";
import { correctSound, popSound, tick } from "./sound";
import { BEAT_VERB, BEATS, placeLabel, SIGN_EMOJI, signLabel, survivorsOf } from "./tiebreak";
import type { Tiebreak } from "./types";
import { dotted } from "./ui";

type Props = {
    tiebreaks: Tiebreak[];
    onDone: () => void;
    canSkip?: boolean; // host: "Saltar ⏭" when there's no time for the show
    withSound?: boolean; // host only: the classroom speakers
};

// One screen of the show. Every device steps through the same frames from the stored
// throws at its own pace (nothing to sync: the result is already decided).
type Frame =
    | { kind: "announce"; tb: Tiebreak }
    | { kind: "faceoff"; tb: Tiebreak }
    | { kind: "shake"; tb: Tiebreak; t: number }
    | { kind: "reveal"; tb: Tiebreak; t: number }
    | { kind: "winner"; tb: Tiebreak };

const DURATION: Record<Frame["kind"], number> = { announce: 2800, faceoff: 1400, shake: 1500, reveal: 1600, winner: 2200 };

function framesOf(tiebreaks: Tiebreak[]): Frame[] {
    return tiebreaks.flatMap((tb): Frame[] => [
        { kind: "announce", tb },
        { kind: "faceoff", tb },
        ...tb.throws.flatMap((_, t): Frame[] => [
            { kind: "shake", tb, t },
            { kind: "reveal", tb, t },
        ]),
        { kind: "winner", tb },
    ]);
}

const names = (list: { name: string }[]) =>
    list.length <= 1 ? (list[0]?.name ?? "") : `${list.slice(0, -1).map((c) => c.name).join(", ")} y ${list[list.length - 1].name}`;

// ✊✋✌️ show between "¡Se acabó!" and the podium, only when a podium place was tied:
// announce the tie → face-off (VS) → fists shake "piedra… papel… tijera" → signs revealed
// (draws repeat) → winner. Then onDone shows the podium, which recaps it.
export default function TiebreakShow({ tiebreaks, onDone, canSkip = false, withSound = false }: Props) {
    const [frames] = useState(() => framesOf(tiebreaks));
    const [index, setIndex] = useState(0);
    const done = useRef(onDone);
    useLayoutEffect(() => {
        done.current = onDone;
    }, [onDone]);

    // Fixed reading times (not × MOTION: reduced motion still needs time to read)
    useEffect(() => {
        if (index >= frames.length) {
            done.current();
            return;
        }
        const timer = setTimeout(() => setIndex((i) => i + 1), DURATION[frames[index].kind]);
        return () => clearTimeout(timer);
    }, [index, frames]);

    const frame = frames[index];
    if (!frame) return null;
    return (
        <div className={`fixed inset-0 z-50 bg-slate-900 text-white flex flex-col items-center justify-center gap-6 p-4 text-center ${dotted}`}>
            <p className="text-lg md:text-xl opacity-70">🤝 Desempate · piedra, papel o tijera automático</p>
            <FrameView key={index} frame={frame} withSound={withSound} />
            {canSkip && (
                <button
                    type="button"
                    onClick={() => done.current()}
                    className="fixed bottom-4 right-4 bg-white/10 hover:bg-white/20 rounded-lg px-4 py-2 font-bold cursor-pointer"
                >
                    Saltar ⏭
                </button>
            )}
        </div>
    );
}

function FrameView({ frame, withSound }: { frame: Frame; withSound: boolean }) {
    const root = useRef<HTMLDivElement>(null);
    const { tb } = frame;

    useLayoutEffect(() => {
        const el = root.current!;
        const q = (selector: string) => [...el.querySelectorAll<HTMLElement>(selector)];
        const tl = gsap.timeline();
        if (frame.kind === "faceoff") {
            // Each side slides in from its edge, then the VS slams down between them
            const far = window.innerWidth * 0.6;
            tl.from(q(".tb-left"), { x: -far, autoAlpha: 0, duration: 0.5 * MOTION, ease: "power3.out" }, 0)
                .from(q(".tb-right"), { x: far, autoAlpha: 0, duration: 0.5 * MOTION, ease: "power3.out" }, 0)
                .from(q(".tb-vs"), { scale: 0, rotation: -25, autoAlpha: 0, duration: 0.4 * MOTION, ease: "back.out(2.5)" }, 0.4 * MOTION)
                .to(q(".tb-vs"), { x: 4, duration: 0.05 * MOTION, yoyo: true, repeat: 5 }, ">");
            if (withSound) tl.call(() => popSound(), [], 0.45 * MOTION);
        } else if (frame.kind === "shake") {
            // Three beats: fists bounce while "¡Piedra!" → "¡Papel!" → "¡Tijera!" replace each other
            tl.fromTo(q(".tb-hand"), { y: 0 }, { y: -26, duration: 0.18 * MOTION, yoyo: true, repeat: 5, ease: "power1.inOut" }, 0);
            q(".tb-word").forEach((word, i, all) => {
                const at = i * 0.36 * MOTION;
                tl.fromTo(word, { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1.15, duration: 0.15 * MOTION, ease: "back.out(2)" }, at);
                if (i < all.length - 1) tl.to(word, { autoAlpha: 0, duration: 0.08 * MOTION }, at + 0.28 * MOTION);
                if (withSound) tl.call(() => tick(), [], at);
            });
        } else if (frame.kind === "reveal") {
            // Signs flip in, the winning hands lunge toward the middle (a draw: everyone
            // clashes), the losers shake and grey out
            tl.from(q(".tb-hand"), { scale: 0.2, rotation: -30, duration: 0.3 * MOTION, ease: "back.out(2)" }, 0);
            const box = q(".tb-row")[0].getBoundingClientRect();
            const cx = box.left + box.width / 2;
            const cy = box.top + box.height / 2;
            const winners = q(".tb-win .tb-hand");
            (winners.length ? winners : q(".tb-hand")).forEach((hand) => {
                const r = hand.getBoundingClientRect();
                const dx = cx - (r.left + r.width / 2);
                const dy = cy - (r.top + r.height / 2);
                const k = Math.min(70, Math.hypot(dx, dy) * 0.4) / (Math.hypot(dx, dy) || 1);
                tl.to(hand, { x: dx * k, y: dy * k, duration: 0.18 * MOTION, yoyo: true, repeat: 1, ease: "power2.in" }, 0.45 * MOTION);
            });
            tl.to(q(".tb-lose"), { x: 6, duration: 0.05 * MOTION, yoyo: true, repeat: 5 }, 0.62 * MOTION).to(q(".tb-lose"), {
                opacity: 0.35,
                filter: "grayscale(1)",
                duration: 0.3 * MOTION,
            });
            if (withSound) tl.call(() => popSound(), [], 0.62 * MOTION);
        } else if (withSound && frame.kind === "winner") {
            correctSound();
        }
        const tween = popIn(q(".tb-pop"), frame.kind === "reveal" ? 0.7 : 0);
        return () => {
            tl.kill();
            tween.kill();
        };
    }, [frame.kind, withSound]);

    if (frame.kind === "announce") {
        return (
            <div ref={root} className="flex flex-col items-center gap-4">
                <p className="tb-pop text-4xl md:text-6xl font-bold text-yellow-300">¡Empate en el {placeLabel(tb.place)}!</p>
                <p className="tb-pop text-2xl md:text-3xl">
                    {names(tb.contenders)} empataron con {tb.score} puntos
                </p>
                <p className="tb-pop text-xl md:text-2xl opacity-80">Se define con piedra, papel o tijera automático ✊✋✌️</p>
            </div>
        );
    }

    if (frame.kind === "winner") {
        const winner = tb.contenders.find((c) => c.id === tb.winner);
        return (
            <div ref={root} className="flex flex-col items-center gap-4">
                <p className="tb-pop text-5xl md:text-7xl">🏆</p>
                <p className="tb-pop text-4xl md:text-6xl font-bold text-yellow-300">¡{winner?.name ?? "…"} gana el {placeLabel(tb.place)}!</p>
            </div>
        );
    }

    // faceoff / shake / reveal: only the players still in, face to face. Two players get the
    // big duel (VS in the middle, stacked on phones); three or more a row with VS chips.
    const t = frame.kind === "faceoff" ? -1 : frame.t;
    const signs = t >= 0 ? tb.throws[t] : null;
    const playing = signs ? tb.contenders.filter((c) => c.id in signs) : tb.contenders;
    const survivors = signs ? survivorsOf(signs) : [];
    const reveal = frame.kind === "reveal" && signs !== null;
    const draw = survivors.length === playing.length;
    const winningSign = reveal && !draw ? signs[survivors[0]] : null;
    const duel = playing.length === 2;
    const shake = frame.kind === "shake";
    return (
        <div ref={root} className="flex flex-col items-center gap-6 w-full">
            <p className="text-2xl md:text-3xl font-bold">
                {placeLabel(tb.place)}
                {t >= 0 && ` · ronda ${t + 1}`}
            </p>
            <div className={`tb-row flex items-center justify-center ${duel ? "flex-col md:flex-row gap-4 md:gap-10" : "flex-wrap gap-3"}`}>
                {playing.map((c, i) => {
                    const left = i < playing.length / 2;
                    const won = reveal && !draw && survivors.includes(c.id);
                    const lost = reveal && !draw && !won;
                    return (
                        <Fragment key={c.id}>
                            {i > 0 &&
                                (duel ? (
                                    <div className="w-64 md:w-80 h-20 md:h-32 grid place-items-center">
                                        {shake ? <Words /> : <span className="tb-vs text-5xl md:text-7xl font-black italic text-yellow-300">VS</span>}
                                    </div>
                                ) : (
                                    <span className="tb-vs rounded-full bg-yellow-300 text-slate-900 font-black italic px-2 py-1">VS</span>
                                ))}
                            <div
                                className={`${left ? "tb-left" : "tb-right"} ${won ? "tb-win" : ""} ${lost ? "tb-lose" : ""} ${
                                    duel ? "w-40 md:w-56" : "w-32 md:w-40"
                                } rounded-2xl p-3 flex flex-col items-center gap-2 border-2 bg-white text-slate-900 border-black`}
                            >
                                <span className={`tb-hand inline-block ${duel ? "text-7xl md:text-8xl" : "text-6xl md:text-7xl"}`} aria-hidden>
                                    {/* Left side mirrored so the hands face each other */}
                                    <span className="inline-block" style={left ? { transform: "scaleX(-1)" } : undefined}>
                                        {reveal ? SIGN_EMOJI[signs[c.id]] : "✊"}
                                    </span>
                                </span>
                                <p className="font-bold text-lg leading-tight truncate w-full">{c.name}</p>
                            </div>
                        </Fragment>
                    );
                })}
            </div>
            {shake && !duel && (
                <div className="h-20 md:h-32 mt-2 grid place-items-center">
                    <Words />
                </div>
            )}
            {reveal && (
                <p className="tb-pop text-2xl md:text-4xl font-bold text-yellow-300 leading-snug [word-spacing:0.3em] max-w-3xl min-h-12">
                    {winningSign
                        ? `${signLabel(winningSign)} ${BEAT_VERB[winningSign]} ${signLabel(BEATS[winningSign])}${
                              survivors.length > 1 ? ` · siguen ${names(playing.filter((c) => survivors.includes(c.id)))}` : ""
                          }`
                        : "¡Empate! Otra vez…"}
                </p>
            )}
        </div>
    );
}

// One word at a time, all stacked in the same grid cell (the shake timeline swaps them)
function Words() {
    return (
        <div className="grid place-items-center">
            {["¡Piedra!", "¡Papel!", "¡Tijera!"].map((word) => (
                <span key={word} className="tb-word invisible [grid-area:1/1] text-4xl md:text-6xl font-extrabold tracking-wider text-yellow-300 whitespace-nowrap">
                    {word}
                </span>
            ))}
        </div>
    );
}
