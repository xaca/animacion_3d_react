import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef } from "react";
import { MOTION } from "./motion";
import { blip, tangoSting } from "./sound";
import type { TingoPlayer } from "./types";

type Props = {
    playerCount: number;
    // null while the ball is jumping; the chosen player once the room stopped (status
    // tango). The ball itself lives on the PHONES (they replay the room's hop schedule);
    // this board only sings.
    selected: TingoPlayer | null;
    hopMs: number;
    onLanded: () => void; // the ¡Tango! moment finished → show the question
};

const MAX_WORDS = 24; // the sketch's "tingo, tingo, tingo…", capped so it never overflows
const HEAT_MS = 8000; // how long until the chant reaches full pitch

// The teacher's board during a round: ONLY the chant, like the sketch — a big card where
// "tingo, tingo, tingo…" piles up (red dot above = "sing it"), one word per hop at the
// same hopMs rhythm the phones replay, until ¡Tango! names the chosen player.
export default function ChantBoard({ playerCount, selected, hopMs, onLanded }: Props) {
    const chant = useRef<HTMLParagraphElement>(null);
    const dot = useRef<HTMLSpanElement>(null);
    const words = useRef<string[]>([]);
    const landed = selected !== null; // derived: the room already says tango

    const onLandedRef = useRef(onLanded);
    useEffect(() => {
        onLandedRef.current = onLanded;
    }, [onLanded]);

    // One effect keyed by the chosen id (the room object changes identity on every
    // snapshot): singing while it's null, ¡Tango! moment once set
    const selectedId = selected?.id ?? null;
    useEffect(() => {
        if (selectedId !== null) {
            tangoSting();
            const call = gsap.delayedCall(1.5 * MOTION + 0.3, () => onLandedRef.current());
            return () => {
                call.kill();
            };
        }
        const startedAt = Date.now();
        const sing = () => {
            words.current.push("tingo");
            if (words.current.length > MAX_WORDS) words.current.shift();
            // Written through the ref on purpose: React renders the <p> empty, so this
            // steady text stream never fights React over the node
            if (chant.current) chant.current.textContent = `${words.current.join(", ")}…`;
            blip(Math.min(1, (Date.now() - startedAt) / HEAT_MS));
            if (dot.current && MOTION) {
                gsap.fromTo(dot.current, { scale: 1 }, { scale: 1.5, duration: 0.12, yoyo: true, repeat: 1, overwrite: true, clearProps: "transform" });
            }
        };
        sing();
        const id = setInterval(sing, hopMs);
        return () => clearInterval(id);
    }, [selectedId, hopMs]);

    // Entrance pop for the card; ¡Tango! pops again when it lands
    const card = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        const tween = gsap.fromTo(
            card.current,
            { scale: 0.8, autoAlpha: 0 },
            { scale: 1, autoAlpha: 1, duration: 0.35 * MOTION, ease: "back.out(1.7)", clearProps: "transform,opacity,visibility" }
        );
        return () => {
            tween.kill();
        };
    }, [landed]);

    return (
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-4 px-4">
            <div
                ref={card}
                className="relative w-full max-w-4xl min-h-[32dvh] md:min-h-[42dvh] bg-white text-slate-900 rounded-3xl border-4 border-slate-900 shadow-xl px-5 py-5 md:px-10 md:py-8 flex items-center justify-center"
            >
                <span ref={dot} className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-red-500 border-2 border-white" aria-hidden />
                {landed ? (
                    <div className="text-center">
                        <p className="text-5xl sm:text-7xl md:text-8xl font-extrabold">¡Tango!</p>
                        <p className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold">
                            🎯 Le tocó a <span className="bg-yellow-300 px-3 py-1 rounded-lg">{selected?.name ?? "…"}</span>
                        </p>
                    </div>
                ) : (
                    <p ref={chant} className="text-2xl sm:text-3xl md:text-5xl font-bold leading-snug break-words text-center" />
                )}
            </div>
            <p className="shrink-0 text-lg opacity-70">
                🔴 La bolita está saltando en los celulares · 👥 {playerCount} {playerCount === 1 ? "jugador" : "jugadores"}
            </p>
        </div>
    );
}
