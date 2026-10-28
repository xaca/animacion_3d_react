import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";
import { fanfare } from "./sound";
import { MOTION } from "./motion";
import { placeLabel, signLabel } from "./tiebreak";
import { rankPlayers, type Tiebreak, type TingoPlayer } from "./types";

type Props = {
    players: TingoPlayer[];
    tiebreaks?: Tiebreak[]; // ✊✋✌️ results: order the tied steps and get recapped below
    withSound?: boolean; // host only: the fanfare plays on the classroom speakers
};

const HEIGHTS: Record<number, string> = { 1: "h-40", 2: "h-28", 3: "h-16" };
const MEDALS: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };
const CONFETTI = ["#dc2626", "#2563eb", "#16a34a", "#eab308", "#9333ea", "#ec4899"];
// Card accents, one per player in ranking order (individuals have no team color)
const ACCENTS = ["#ef4444", "#3b82f6", "#22c55e", "#eab308", "#a855f7", "#ec4899", "#14b8a6", "#f97316", "#64748b", "#84cc16"];

export default function Podium({ players, tiebreaks = [], withSound = false }: Props) {
    const root = useRef<HTMLDivElement>(null);
    // Only players who scored get a step (a 🥈 for 0 points reads as a joke); the rest
    // are listed below. Callers skip the podium entirely when NOBODY scored (hasScores).
    const zeros = players.filter((p) => p.score <= 0);
    const ranked = rankPlayers(
        players.filter((p) => p.score > 0),
        tiebreaks
    );
    const viaTiebreak = new Set(tiebreaks.flatMap((t) => t.contenders.map((c) => c.id)));
    // Classic podium order: 2nd, 1st, 3rd. Unresolved ties (old rooms) share a step.
    const columns = [2, 1, 3]
        .map((place) => ({ place, entries: ranked.filter((r) => r.place === place) }))
        .filter((c) => c.entries.length > 0);
    const rest = ranked.filter((r) => r.place > 3);

    // Steps rise 3rd → 2nd → 1st, then a confetti burst over the winner. Runs once on mount.
    useLayoutEffect(() => {
        const el = root.current!;
        const tl = gsap.timeline();
        for (const place of [3, 2, 1]) {
            const col = el.querySelector(`[data-place="${place}"]`);
            if (!col) continue;
            tl.fromTo(
                col.querySelector(".pd-bar"),
                { scaleY: 0, transformOrigin: "bottom" },
                { scaleY: 1, duration: 0.35 * MOTION, ease: "power2.out" }
            );
            tl.fromTo(col.querySelectorAll(".pd-card"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.25 * MOTION }, "<0.12");
        }
        tl.fromTo(".pd-rest", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 * MOTION });
        const bits = el.querySelectorAll(".pd-confetti");
        tl.add(() => {
            if (withSound) fanfare();
            bits.forEach((bit) => {
                gsap.fromTo(
                    bit,
                    { x: 0, y: 0, autoAlpha: 1 },
                    {
                        x: gsap.utils.random(-140, 140),
                        y: gsap.utils.random(-160, 70),
                        rotation: gsap.utils.random(-360, 360),
                        autoAlpha: 0,
                        duration: (1 + Math.random()) * MOTION,
                        ease: "power2.out",
                    }
                );
            });
        });
        return () => {
            tl.kill();
            gsap.killTweensOf(bits);
        };
        // Mount only: the podium plays once per end screen
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div ref={root} className="flex flex-col items-center gap-4 w-full">
            <div className="flex items-end justify-center gap-3 w-full max-w-3xl">
                {columns.map(({ place, entries }) => (
                    <div key={place} data-place={place} className="relative flex flex-col items-center gap-2 flex-1 max-w-56">
                        {entries.map(({ player }, i) => (
                            <div
                                key={player.id}
                                className="pd-card bg-white text-black w-full p-2 text-center border-t-8 rounded-b"
                                style={{ borderTopColor: ACCENTS[(place + i) % ACCENTS.length] }}
                            >
                                <p className="font-bold text-xl leading-tight">{player.name}</p>
                                <p className="text-2xl font-bold text-slate-800">{player.score}</p>
                                {viaTiebreak.has(player.id) && <p className="text-xs font-bold text-slate-500">✊✋✌️ desempate</p>}
                            </div>
                        ))}
                        <div className={`pd-bar w-full ${HEIGHTS[place]} bg-yellow-300 border-4 border-black flex items-start justify-center`}>
                            <span className="text-4xl">{MEDALS[place]}</span>
                        </div>
                        {place === 1 && (
                            <span className="pointer-events-none absolute left-1/2 top-4 z-10" aria-hidden>
                                {CONFETTI.flatMap((color) =>
                                    [0, 1, 2, 3].map((i) => (
                                        <span key={color + i} className="pd-confetti absolute w-2 h-3 rounded-sm opacity-0" style={{ background: color }} />
                                    ))
                                )}
                            </span>
                        )}
                    </div>
                ))}
            </div>
            {rest.length > 0 && (
                <ul className="pd-rest text-xl opacity-80">
                    {rest.map(({ player, place }) => (
                        <li key={player.id}>
                            {place}. {player.name} — {player.score}
                        </li>
                    ))}
                </ul>
            )}
            {tiebreaks.length > 0 && (
                // Recap of the ✊✋✌️ show (or of what the teacher skipped)
                <ul className="pd-rest text-base md:text-lg opacity-90 text-center space-y-0.5">
                    {tiebreaks.map((t) => {
                        const winner = t.contenders.find((c) => c.id === t.winner);
                        const sign = t.throws[t.throws.length - 1]?.[t.winner];
                        return (
                            <li key={t.place}>
                                🤝 Empate en el {placeLabel(t.place)} ({t.score} pts): lo ganó <b>{winner?.name}</b>
                                {sign && <> con {signLabel(sign)}</>} en piedra, papel o tijera
                            </li>
                        );
                    })}
                </ul>
            )}
            {zeros.length > 0 && (
                <p className="pd-rest text-lg opacity-70 max-w-2xl text-center">
                    Sin puntos esta vez: {zeros.map((p) => p.name).join(", ")}
                </p>
            )}
        </div>
    );
}
