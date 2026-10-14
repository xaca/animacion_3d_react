import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";
import { MOTION } from "./multiplayer/panelMode";

// Full-screen "Game over!" moment between the last question and the podium,
// on the big screen and on the phones. Calls onDone when it finishes.
export default function GameOverSplash({ onDone }: { onDone: () => void }) {
    const card = useRef<HTMLDivElement>(null);
    const done = useRef(onDone);
    useLayoutEffect(() => {
        done.current = onDone;
    }, [onDone]);

    useLayoutEffect(() => {
        const tl = gsap
            .timeline({ onComplete: () => done.current() })
            .fromTo(card.current, { scale: 0.4, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.45 * MOTION, ease: "back.out(1.7)" })
            .to(card.current, { scale: 1.1, autoAlpha: 0, duration: 0.3 * MOTION, ease: "power2.in" }, `+=${0.8 * MOTION}`);
        return () => {
            tl.kill();
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 bg-[#1c2470] flex items-center justify-center">
            <div ref={card} className="bg-yellow-300 text-black font-bold text-5xl md:text-7xl px-12 py-8 rounded-2xl shadow-2xl opacity-0">
                🏁 Game over!
            </div>
        </div>
    );
}
