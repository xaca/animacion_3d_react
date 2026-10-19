import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { rankTeams, type Team } from "../teams";
import { MOTION, PANEL_WIDTH, type PanelMode } from "./panelMode";
import { activeTileOf, answerOf, type Room } from "./roomService";

type Props = {
    room: Room;
    topic: string;
    mode: PanelMode;
    onMode: (mode: PanelMode) => void;
};

// Host score sidebar (layout ideas from shadcn's Sidebar, built with plain Tailwind + GSAP).
// The width tweens between states; the content is swapped while it fits: before shrinking
// (after fading out) and after growing, so text is never squashed mid-animation.
export default function ScorePanel({ room, topic, mode, onMode }: Props) {
    const aside = useRef<HTMLElement>(null);
    const [shown, setShown] = useState<PanelMode>(mode); // content currently rendered
    const first = useRef(true);

    useLayoutEffect(() => {
        const el = aside.current!;
        const target = PANEL_WIDTH[mode];
        if (first.current) {
            first.current = false;
            gsap.set(el, { width: target });
            return;
        }
        const width = el.getBoundingClientRect().width;
        const growing = target > width;
        const shrinking = target < width;
        // Ends every transition visible, even when a quick second toggle interrupted the last
        // one. clearProps removes the leftover transform: it would create a stacking context
        // that traps the row's tooltip under the board panel.
        const fadeIn = () =>
            gsap.to(el.querySelectorAll(".sb-fade"), { autoAlpha: 1, x: 0, duration: 0.2 * MOTION, clearProps: "transform,opacity,visibility" });
        const tl = gsap.timeline();
        if (shrinking) {
            tl.to(el.querySelectorAll(".sb-fade"), { autoAlpha: 0, duration: 0.15 * MOTION });
            tl.call(() => setShown(mode));
        }
        if (growing || shrinking) tl.to(el, { width: target, duration: 0.4 * MOTION, ease: "power3.inOut" });
        if (!shrinking) tl.call(() => setShown(mode));
        tl.call(fadeIn);
        return () => {
            tl.kill();
        };
    }, [mode]);

    // New content fades in, one item after another
    useLayoutEffect(() => {
        const items = aside.current!.querySelectorAll(".sb-fade");
        const tween = gsap.fromTo(
            items,
            { autoAlpha: 0, x: -8 },
            { autoAlpha: 1, x: 0, duration: 0.25 * MOTION, stagger: 0.03 * MOTION, clearProps: "transform,opacity,visibility" }
        );
        return () => {
            tween.kill();
        };
    }, [shown]);

    const players = Object.values(room.players);
    const toggle = () => onMode(mode === "expanded" ? "rail" : "expanded");

    return (
        <>
            {/* z-20: tooltips and the "+N" badge must paint above the board panel next to it */}
        <aside ref={aside} className="relative z-20 shrink-0 h-full flex flex-col whitespace-nowrap">
                {shown === "expanded" && (
                    <div className="flex flex-col h-full p-3 gap-3">
                        <header className="sb-fade flex items-start justify-between gap-2">
                            <div className="min-w-0">
                                <p className="font-bold text-lg leading-tight truncate" title={topic}>
                                    {topic}
                                </p>
                                <p className="text-sm opacity-70">
                                    Room <b className="tracking-widest">{room.code}</b>
                                </p>
                            </div>
                            <button onClick={toggle} className={iconButton} aria-label="Collapse the scores" title="Ctrl+B">
                                «
                            </button>
                        </header>
                        <p className="sb-fade text-xs uppercase tracking-wider opacity-60">Leaderboard</p>
                        <TeamList room={room} variant="expanded" />
                        <footer className="sb-fade mt-auto text-xs opacity-60 flex justify-between">
                            <span>{players.length} players</span>
                            <span>Ctrl+B · S</span>
                        </footer>
                    </div>
                )}

                {shown === "rail" && (
                    <div className="flex flex-col items-center h-full py-3 gap-3">
                        <button onClick={toggle} className={`sb-fade ${iconButton}`} aria-label="Expand the scores" title="Ctrl+B">
                            »
                        </button>
                        <TeamList room={room} variant="rail" />
                    </div>
                )}

                {/* Rail: a thin clickable edge, like shadcn's SidebarRail */}
                {shown !== "hidden" && (
                    <button
                        onClick={toggle}
                        className="absolute top-0 -right-1 h-full w-2 cursor-pointer hover:bg-white/20 transition-colors"
                        aria-label="Toggle the scores"
                        tabIndex={-1}
                    />
                )}
            </aside>

            {shown === "hidden" && (
                <button
                    onClick={() => onMode("expanded")}
                    className="fixed left-0 top-1/2 -translate-y-1/2 z-20 bg-white text-[#2a3698] font-bold px-2 py-4 cursor-pointer shadow-lg rounded-r-lg [writing-mode:vertical-rl] rotate-180 hover:bg-yellow-300"
                    aria-label="Show the scores"
                >
                    Scores ›
                </button>
            )}
        </>
    );
}

const iconButton = "shrink-0 w-8 h-8 rounded-md bg-white/10 hover:bg-white/25 cursor-pointer text-lg leading-none";

// Ranked rows. When the order changes, rows slide from their old position (FLIP with plain GSAP).
function TeamList({ room, variant }: { room: Room; variant: "expanded" | "rail" }) {
    const rows = useRef(new Map<string, HTMLElement>());
    const tops = useRef(new Map<string, number>());
    const lastOrder = useRef<string | null>(null);
    const ranked = rankTeams(room.teams);
    const order = ranked.map((r) => r.team.id).join();
    const tile = activeTileOf(room);
    const players = Object.values(room.players);

    // Measures every render (row heights change with members); animates only on a new order
    useLayoutEffect(() => {
        const reordered = lastOrder.current !== null && lastOrder.current !== order;
        lastOrder.current = order;
        for (const [id, el] of rows.current) {
            const before = tops.current.get(id);
            const now = el.offsetTop; // ignores transforms, so a running slide doesn't skew it
            if (reordered && before !== undefined && before !== now) {
                gsap.fromTo(el, { y: before - now }, { y: 0, duration: 0.6 * MOTION, ease: "power2.out", overwrite: true, clearProps: "transform" });
            }
            tops.current.set(id, now);
        }
    });

    // No scrolling: from 6 teams up the rows get compact instead, so 10 still fit
    const compact = variant === "expanded" && ranked.length >= 6;
    return (
        <ol className={variant === "expanded" ? "flex flex-col gap-2" : "flex flex-col items-center gap-3"}>
            {ranked.map(({ team, place }) => {
                const answer = tile ? answerOf(room, team.id) : null;
                const scored = tile !== null && room.revealed && answer?.correct === true;
                const mark = !tile ? null : !room.revealed ? (answer ? "✔" : null) : scored ? `+${tile.value}` : answer ? "✘" : "—";
                return (
                    <TeamRow
                        key={team.id}
                        rowRef={(el) => {
                            if (el) rows.current.set(team.id, el);
                            else rows.current.delete(team.id);
                        }}
                        team={team}
                        place={place}
                        variant={variant}
                        compact={compact}
                        members={players.filter((p) => p.team === team.id).map((p) => p.name)}
                        mark={mark}
                        scored={scored}
                        answered={tile !== null && answer !== null}
                    />
                );
            })}
        </ol>
    );
}

type RowProps = {
    rowRef: (el: HTMLLIElement | null) => void;
    team: Team;
    place: number;
    variant: "expanded" | "rail";
    compact: boolean;
    members: string[];
    mark: string | null;
    scored: boolean;
    answered: boolean;
};

function TeamRow({ rowRef, team, place, variant, compact, members, mark, scored, answered }: RowProps) {
    const scoreEl = useRef<HTMLSpanElement>(null);
    const badgeEl = useRef<HTMLSpanElement>(null);
    const ringEl = useRef<HTMLSpanElement>(null);
    const prevScore = useRef(team.score);

    // The score text is written only here (React renders the span empty), so GSAP's
    // count-up never fights React over the same text node.
    // Count up to the new score and pop a "+N" badge.
    useLayoutEffect(() => {
        const el = scoreEl.current;
        const from = prevScore.current;
        prevScore.current = team.score;
        if (!el) return;
        if (team.score <= from || !badgeEl.current) {
            el.textContent = String(team.score);
            return;
        }
        const counter = { v: from };
        const tl = gsap.timeline();
        tl.to(counter, {
            v: team.score,
            duration: 1 * MOTION,
            ease: "power1.out",
            onUpdate: () => {
                el.textContent = String(Math.round(counter.v));
            },
        });
        badgeEl.current.textContent = `+${team.score - from}`;
        tl.fromTo(badgeEl.current, { autoAlpha: 1, y: 0, scale: 0.5 }, { scale: 1.1, duration: 0.25 * MOTION, ease: "back.out(3)" }, 0);
        tl.to(badgeEl.current, { autoAlpha: 0, y: -28, duration: 0.6 * MOTION, ease: "power1.in" }, 0.9 * MOTION);
        return () => {
            tl.kill();
            el.textContent = String(team.score);
        };
    }, [team.score]);

    // Ring pulse when the team answers
    useEffect(() => {
        if (!answered || !ringEl.current) return;
        const tween = gsap.fromTo(ringEl.current, { scale: 1, autoAlpha: 0.9 }, { scale: 1.9, autoAlpha: 0, duration: 0.7 * MOTION, ease: "power2.out" });
        return () => {
            tween.kill();
        };
    }, [answered]);

    const avatar = (
        <span className="relative shrink-0">
            <span ref={ringEl} className="absolute inset-0 rounded-full opacity-0" style={{ boxShadow: `0 0 0 3px ${team.color ?? "#fff"}` }} />
            <span
                className={`relative flex items-center justify-center rounded-full font-bold ${compact ? "w-7 h-7 text-xs" : "w-10 h-10 text-sm"}`}
                style={{ background: team.color ?? "#fff", color: isLight(team.color) ? "#000" : "#fff" }}
            >
                {initials(team.name)}
            </span>
        </span>
    );
    const badge = <span ref={badgeEl} className="absolute -top-2 right-1 bg-yellow-300 text-black font-bold text-sm px-1.5 rounded opacity-0 pointer-events-none" />;

    if (variant === "rail") {
        return (
            <li ref={rowRef} className="sb-fade group relative flex flex-col items-center gap-0.5">
                <span className="text-xs opacity-70">{place}</span>
                {avatar}
                <span ref={scoreEl} className={`text-sm font-bold ${scored ? "text-yellow-300" : ""}`} />
                {mark && <span className="absolute -top-1 -right-2 text-xs">{mark === "✔" ? "✔" : ""}</span>}
                {badge}
                {/* CSS-only tooltip */}
                <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-30 bg-black text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    <b>{team.name}</b> · {team.score}
                    {members.length > 0 && <span className="block text-xs opacity-70">{members.join(", ")}</span>}
                </span>
            </li>
        );
    }

    return (
        <li ref={rowRef} className={`sb-fade relative flex items-center gap-3 rounded-lg px-2 ${compact ? "py-1" : "py-2"} ${scored ? "bg-white/20" : "bg-white/5"}`}>
            <span className="w-4 text-sm opacity-70 text-right">{place}</span>
            {avatar}
            <span className="min-w-0 flex-1">
                <span className="block font-bold truncate" title={team.name}>
                    {team.name}
                </span>
                {/* Student names stay visible even in compact rows (the teacher asked for them) */}
                {members.length > 0 && (
                    <span className={`block opacity-60 truncate ${compact ? "text-[10px] leading-tight" : "text-xs"}`}>{members.join(", ")}</span>
                )}
            </span>
            <span className="flex flex-col items-end">
                <span ref={scoreEl} className={`font-bold tabular-nums ${compact ? "text-lg" : "text-2xl"} ${scored ? "text-yellow-300" : ""}`} />
                {mark && <span className="text-xs opacity-80">{mark === "✔" ? "✔ answered" : mark}</span>}
            </span>
            {badge}
        </li>
    );
}

function initials(name: string): string {
    return name
        .split(/\s+/)
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

// Dark text on light team colors (yellow, silver, lime…), white on the rest
function isLight(hex = "#000000"): boolean {
    const n = parseInt(hex.slice(1), 16);
    const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    return 0.299 * r + 0.587 * g + 0.114 * b > 160;
}
