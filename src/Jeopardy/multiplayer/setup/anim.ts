import gsap from "gsap";
import { MOTION } from "../panelMode";

// The game's GSAP vocabulary, shared by the setup screens (same eases and timings as
// HostQuestionView, Podium and ScorePanel). Every duration × MOTION (0 = reduced motion).
// Transform tweens end with clearProps so no leftover transform creates a stacking context.

// Cards rise in one after the other; `dir` slides them in from the side (step changes)
export function staggerIn(targets: gsap.TweenTarget, dir = 0) {
    return gsap.fromTo(
        targets,
        { autoAlpha: 0, y: dir === 0 ? 14 : 0, x: dir * 40 },
        { autoAlpha: 1, y: 0, x: 0, duration: 0.3 * MOTION, stagger: 0.06 * MOTION, ease: "power2.out", overwrite: true, clearProps: "transform,opacity,visibility" }
    );
}

// Quick "yes, that one" bump, like the correct option on reveal
export function pulse(target: gsap.TweenTarget) {
    return gsap.fromTo(
        target,
        { scale: 1 },
        { scale: 1.06, duration: 0.18 * MOTION, yoyo: true, repeat: 1, ease: "power1.inOut", overwrite: true, clearProps: "transform" }
    );
}

// Pops in from small, like the Game over card and the "+N" badge
export function popIn(target: gsap.TweenTarget, delay = 0) {
    return gsap.fromTo(
        target,
        { scale: 0.5, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.35 * MOTION, delay: delay * MOTION, ease: "back.out(1.7)", overwrite: true, clearProps: "transform,opacity,visibility" }
    );
}

// Expanding ring that fades out, like a team answering in the score panel
export function ring(target: gsap.TweenTarget, repeat = 0) {
    return gsap.fromTo(
        target,
        { scale: 1, autoAlpha: 0.9 },
        { scale: 1.9, autoAlpha: 0, duration: 0.7 * MOTION, ease: "power2.out", repeat, repeatDelay: 0.8 }
    );
}
