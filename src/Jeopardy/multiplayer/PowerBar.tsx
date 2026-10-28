import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Team } from "../teams";
import { MOTION } from "./panelMode";
import {
    activatePower,
    effectOf,
    optionsVisible,
    placeOf,
    POWER_INFO,
    POWER_KEYS,
    powerReadyIn,
    rechargeOf,
    rescuedNow,
    TARGET_POWERS,
    targetsOf,
    type PowerId,
    type Room,
} from "./roomService";

const PLACE_LABEL = { last: "you're last", middle: "you're in the middle", leader: "you lead" } as const;

// 🃏 The team's power-up buttons on the phone (only while the extra is on, gated by the
// caller). Usable during the reading time; once the options appear only the active-effect
// line remains. First tap arms a button ("Tap again!"), the second spends the power — a
// two-tap confirm instead of a popup, so an accidental brush never burns a power-up. For
// 🏴‍☠️/🧊 the second tap is picking the team (only teams ahead of yours are offered).
export default function PowerBar({ room, playerId, team }: { room: Room; playerId: string; team: Team }) {
    const reading = !optionsVisible(room) && !room.revealed;
    const active = effectOf(room, team.id);
    const hasActive = active !== null;
    const [rawArmed, setArmed] = useState<PowerId | null>(null);
    // Derived, not synced: an armed button only counts while the window is still open
    const armed = reading && !hasActive ? rawArmed : null;
    const aiming = armed !== null && TARGET_POWERS.includes(armed);

    // An armed button disarms itself after a moment (longer while picking a team)
    useEffect(() => {
        if (armed === null) return;
        const t = setTimeout(() => setArmed(null), aiming ? 6000 : 3000);
        return () => clearTimeout(t);
    }, [armed, aiming]);

    // Buttons pop in together; the active line pulses once when a power lands
    const box = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        if (!box.current) return;
        const tween = gsap.fromTo(
            box.current.children,
            { autoAlpha: 0, scale: 0.85 },
            { autoAlpha: 1, scale: 1, duration: 0.25 * MOTION, stagger: 0.05 * MOTION, ease: "back.out(1.6)", clearProps: "transform,opacity,visibility" }
        );
        return () => {
            tween.kill();
        };
    }, [hasActive]);

    const nameOf = (id: string | undefined) => room.teams.find((t) => t.id === id)?.name ?? "";
    // Others aiming at this team: a reason to raise the 🛡️ while there's still time
    const threats = room.revealed ? [] : (room.effects ?? []).filter((e) => e.target === team.id);
    const threatLines = threats.length > 0 && (
        <div className="w-full max-w-md flex flex-col gap-1">
            {threats.map((e) => (
                <p key={e.team} className="bg-red-500/80 font-bold rounded-lg px-3 py-1.5">
                    {POWER_INFO[e.power].icon} {nameOf(e.team)} {e.power === "steal" ? "wants to steal from you!" : "is freezing you!"}
                    {reading && !hasActive && powerReadyIn(room, team, "shield") === 0 && " 🛡️ can block it"}
                </p>
            ))}
        </div>
    );

    if (rescuedNow(room, team)) {
        return (
            <div ref={box} className="w-full max-w-md">
                <p className="bg-yellow-300 text-black font-bold text-lg rounded-lg px-3 py-2">🆘 Rescue! All your power-ups are ready again</p>
            </div>
        );
    }
    if (active !== null) {
        const { icon, name } = POWER_INFO[active.power];
        return (
            <>
                {threatLines}
                <div ref={box} className="w-full max-w-md">
                    <p className="bg-yellow-300 text-black font-bold text-lg rounded-lg px-3 py-2">
                        {icon} {name}
                        {active.target && ` on ${nameOf(active.target)}`} active for your team this question
                    </p>
                </div>
            </>
        );
    }
    if (!reading) return threatLines || null;

    const targets = targetsOf(room, team);
    return (
        <>
            {threatLines}
            <div className="w-full max-w-md">
                <p className="text-sm uppercase tracking-wider opacity-70 text-left mb-1">🃏 Your power-ups — use one before the options appear</p>
                <div ref={box} className="grid grid-cols-5 gap-1.5">
                    {POWER_KEYS.map((p) => {
                        const { icon, name } = POWER_INFO[p];
                        const readyIn = powerReadyIn(room, team, p);
                        const noTarget = TARGET_POWERS.includes(p) && targets.length === 0;
                        const disabled = readyIn > 0 || noTarget;
                        const isArmed = armed === p;
                        const state = readyIn > 0 ? `♻ in ${readyIn}` : noTarget ? "nobody ahead" : isArmed ? (aiming ? "Pick ↓" : "Tap again!") : "ready";
                        return (
                            <button
                                key={p}
                                disabled={disabled}
                                onClick={() => {
                                    if (isArmed && !aiming) {
                                        setArmed(null);
                                        activatePower(room.code, playerId, p);
                                    } else {
                                        setArmed(isArmed ? null : p); // tapping an aiming button again cancels
                                    }
                                }}
                                className={`rounded-lg border-2 px-0.5 py-2 text-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${
                                    isArmed ? "bg-yellow-300 text-black border-black" : "bg-white/10 border-white/40 hover:bg-white/20"
                                }`}
                            >
                                <span className="block text-2xl leading-none">{icon}</span>
                                <span className="block font-bold text-xs">{name}</span>
                                <span className={`block text-[0.7rem] leading-tight ${isArmed ? "font-bold" : "opacity-70"}`}>{state}</span>
                            </button>
                        );
                    })}
                </div>
                {aiming && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {targets.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => {
                                    setArmed(null);
                                    activatePower(room.code, playerId, armed, t.id);
                                }}
                                className="rounded-lg border-2 border-black bg-yellow-300 text-black font-bold px-3 py-1.5 cursor-pointer"
                            >
                                {POWER_INFO[armed].icon} {t.name} · {t.score}
                            </button>
                        ))}
                    </div>
                )}
                <p className="text-sm opacity-80 text-left mt-1 min-h-5">
                    {armed !== null
                        ? POWER_INFO[armed].hint
                        : `One per question · used ones come back in ${rechargeOf(room, team)} questions (${PLACE_LABEL[placeOf(room, team)]})`}
                </p>
            </div>
        </>
    );
}
