import gsap from "gsap";
import { useLayoutEffect, useRef, useState } from "react";
import Countdown from "../Countdown";
import type { Team } from "../teams";
import { TOPICS } from "../topics";
import { useFitText } from "../useFitText";
import { toggleRoomDebug } from "./debugSwitch";
import JoinQr from "./JoinQr";
import { MOTION } from "./panelMode";
import ProfileMenu, { type MenuItem } from "./ProfileMenu";
import {
    addBot,
    backToSetup,
    boardSizeOf,
    cancelCountdown,
    capacityOf,
    gameMinutesOf,
    removeBots,
    rerollTeamNames,
    startCountdown,
    startGame,
    startProblem,
    type Player,
    type Room,
} from "./roomService";
import { linkButton, primaryButton } from "./ui";

type Props = {
    room: Room;
    onExit: () => void;
    onLogout: () => void;
};

// Waiting room on the big screen, laid out from the teacher's sketch: brand top-left,
// big QR beside the join panel, the topic as a headline, free-flowing team cards, and
// a bottom bar with the settings pill and the Start button. One viewport, no scrolling.
export default function HostLobby({ room, onExit, onLogout }: Props) {
    const [starting, setStarting] = useState(false);
    const [error, setError] = useState("");
    const players = Object.values(room.players);
    const unassigned = players.filter((p) => p.team === null);
    const problem = startProblem(room);
    const counting = room.startsAt !== null;

    // Guards against "Start now" and the countdown's onDone both starting the game
    const startingRef = useRef(false);
    async function start() {
        if (startingRef.current) return;
        startingRef.current = true;
        setStarting(true);
        setError("");
        try {
            await startGame(room.code);
        } catch (e) {
            console.error("Could not start the game", e);
            setError(e instanceof Error ? e.message : "Could not start the game. Check your connection and try again.");
            await cancelCountdown(room.code);
        } finally {
            startingRef.current = false;
            setStarting(false);
        }
    }

    const topic = TOPICS.find((t) => t.id === room.topic)?.name ?? room.topic;
    const debug = room.debug === true;
    const humans = players.filter((p) => !p.bot).length;
    const spots = room.teams.reduce((sum, t) => sum + capacityOf(room, t), 0);
    const bonusCount = room.teams.filter((t) => t.bonus).length;
    const menu: MenuItem[] = [
        { label: "⚙️ Settings", onClick: () => !counting && backToSetup(room.code) },
        { label: "🎲 New team names", onClick: () => !counting && rerollTeamNames(room.code) },
        { label: "🧪 Add test player", onClick: () => addBot(room.code) },
        ...(players.some((p) => p.bot) ? [{ label: "🧹 Remove test players", onClick: () => removeBots(room.code) }] : []),
        { label: "🐞 Debug mode", on: debug, onClick: () => toggleRoomDebug(room.code, !debug), separatorBefore: true },
        {
            label: "Close room",
            danger: true,
            separatorBefore: true,
            onClick: () => (humans === 0 || confirm(`${humans} players will be disconnected. Continue?`)) && onExit(),
        },
        { label: "Log out", onClick: onLogout },
    ];

    // Entrance: title and topic drop in, QR and join panel slide from the sides,
    // then the team cards pop one after another
    const root = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        const el = root.current!;
        const tl = gsap
            .timeline()
            .fromTo(el.querySelectorAll(".hl-item"), { autoAlpha: 0, y: -16 }, { autoAlpha: 1, y: 0, duration: 0.35 * MOTION, stagger: 0.08 * MOTION })
            .fromTo(el.querySelector(".hl-qr"), { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: 0.4 * MOTION, ease: "power2.out" }, 0.1 * MOTION)
            .fromTo(el.querySelector(".hl-panel"), { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: 0.4 * MOTION, ease: "power2.out" }, "<")
            .fromTo(
                el.querySelectorAll(".hl-card"),
                { autoAlpha: 0, scale: 0.6 },
                { autoAlpha: 1, scale: 1, duration: 0.35 * MOTION, stagger: 0.05 * MOTION, ease: "back.out(1.8)", clearProps: "transform,opacity,visibility" }
            );
        return () => {
            tl.kill();
        };
        // Mount only: later cards animate their own joins
    }, []);

    return (
        <div
            ref={root}
            className="h-dvh overflow-hidden text-white flex flex-col gap-2 px-4 py-3 bg-[#2a3698] [background-image:radial-gradient(rgba(255,255,255,0.09)_1.5px,transparent_1.5px)] [background-size:26px_26px]"
        >
            <header className="shrink-0 flex items-start justify-between gap-4">
                <h1 className="hl-item text-3xl md:text-4xl font-bold">
                    Quizzing with Friends <span className="opacity-60 text-lg font-normal">🎓</span>
                </h1>
                <ProfileMenu items={menu} />
            </header>

            <section className="shrink-0 mt-3 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                <div className="hl-qr bg-white rounded-2xl p-2 shadow-xl">
                    <JoinQr code={room.code} size={210} />
                </div>
                <div className="hl-panel bg-[#1c2470] rounded-2xl px-8 py-4 shadow-xl flex flex-col items-center gap-1 text-center">
                    <p className="text-xl md:text-2xl">
                        Go to <b>{location.host}/join</b> and enter the code
                    </p>
                    <p className="text-6xl md:text-7xl font-bold tracking-[0.3em] bg-black/30 rounded-xl px-6 py-1">{room.code}</p>
                    <p className="opacity-80">or scan the QR code</p>
                </div>
            </section>

            <p className="hl-item shrink-0 text-center text-3xl md:text-4xl font-bold">{topic}</p>

            {/* Live head-count against the total spots (a +1 team counts as its bigger size) */}
            <div className="hl-item shrink-0 text-center">
                <p className="text-2xl md:text-3xl font-bold">
                    {spots > 0 && players.length >= spots ? (
                        <>🎉 All {spots} in!</>
                    ) : (
                        <>
                            👥 <CountUp value={players.length} className="text-yellow-300" />/{spots} players ·{" "}
                            <CountUp value={Math.max(0, spots - players.length)} className="text-yellow-300" /> left to join
                        </>
                    )}
                </p>
                {bonusCount > 0 && (
                    <p className="text-sm opacity-80">
                        ℹ️ {spots} doesn't split evenly: {bonusCount === 1 ? "one team will have" : `${bonusCount} teams will have`}{" "}
                        {room.maxTeamSize + 1} players instead of {room.maxTeamSize}
                    </p>
                )}
            </div>

            <main className="flex-1 min-h-0 w-full max-w-6xl mx-auto flex flex-wrap content-center justify-center gap-3 overflow-hidden">
                {room.teams.map((team) => (
                    <TeamCard key={team.id} team={team} cap={capacityOf(room, team)} members={players.filter((p) => p.team === team.id)} />
                ))}
            </main>

            {counting && room.startsAt !== null ? (
                /* Last call: one centered panel, nothing competing beside it */
                <footer className="shrink-0 w-full max-w-3xl mx-auto flex flex-col items-center gap-2 bg-black/20 rounded-2xl px-6 py-3">
                    <p className="text-2xl md:text-3xl font-bold text-yellow-300">Game starts soon — last call to pick a team!</p>
                    <div className="w-full max-w-xl">
                        <Countdown endsAt={room.startsAt} totalSeconds={room.startSeconds} onDone={start} />
                    </div>
                    <div className="flex gap-6 items-center">
                        <button className={primaryButton} onClick={start} disabled={starting}>
                            {starting ? "Loading questions…" : "Start now"}
                        </button>
                        <button className={linkButton} onClick={() => cancelCountdown(room.code)} disabled={starting}>
                            Cancel
                        </button>
                    </div>
                    {error && <p className="text-yellow-300 font-bold">{error}</p>}
                </footer>
            ) : (
                <footer className="shrink-0 w-full flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                    <p className="bg-black/30 rounded-full px-4 py-1.5 text-xs md:text-sm opacity-90">
                        {room.readSeconds} s to read + {room.timerSeconds} s to answer · {boardSizeOf(room)}×{boardSizeOf(room)} board ·{" "}
                        {gameMinutesOf(room) > 0 ? `${gameMinutesOf(room)} min limit` : "no time limit"} · {room.teams.length}{" "}
                        {room.teams.length === 1 ? "team" : "teams"}
                    </p>

                    <div className="flex-1 min-w-64 flex flex-col items-center gap-1 text-center">
                        {unassigned.length > 0 && <p className="text-sm opacity-80">Choosing a team: {unassigned.map((p) => p.name).join(", ")}</p>}
                        {players.length === 0 && <p className="opacity-80">Waiting for players…</p>}
                        {players.length > spots && (
                            <p className="text-yellow-300 text-sm">
                                Not everyone fits: {players.length} players for {spots} spots — adjust the teams in ⚙️ Settings.
                            </p>
                        )}
                        {problem && players.length > 0 && <p className="text-yellow-300 text-sm">{problem}</p>}
                        {error && <p className="text-yellow-300 font-bold">{error}</p>}
                    </div>

                    <StartButton onClick={() => startCountdown(room.code)} disabled={starting || problem !== null} starting={starting} />
                </footer>
            )}
        </div>
    );
}

// Big yellow Start with a slow breathing pulse, so the main action glows on the projector
function StartButton({ onClick, disabled, starting }: { onClick: () => void; disabled: boolean; starting: boolean }) {
    const el = useRef<HTMLButtonElement>(null);
    useLayoutEffect(() => {
        if (MOTION === 0 || disabled || !el.current) return;
        const node = el.current;
        const tween = gsap.to(node, { scale: 1.05, duration: 1.1, yoyo: true, repeat: -1, ease: "sine.inOut" });
        return () => {
            tween.kill();
            gsap.set(node, { clearProps: "transform" });
        };
    }, [disabled]);
    return (
        <button
            ref={el}
            onClick={onClick}
            disabled={disabled}
            className="bg-yellow-300 text-black text-2xl md:text-3xl font-bold px-10 py-3 rounded-xl shadow-lg cursor-pointer hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
        >
            {starting ? "Loading questions…" : "Start game"}
        </button>
    );
}

// Number that counts from its previous value. React renders the span empty; only this
// effect writes its text, so GSAP never fights React over it.
function CountUp({ value, className }: { value: number; className?: string }) {
    const el = useRef<HTMLSpanElement>(null);
    const prev = useRef<number | null>(null);
    useLayoutEffect(() => {
        const span = el.current;
        if (!span) return;
        const from = prev.current ?? value;
        prev.current = value;
        if (from === value) {
            span.textContent = String(value);
            return;
        }
        const counter = { v: from };
        const tween = gsap.to(counter, {
            v: value,
            duration: 0.5 * MOTION,
            ease: "power1.out",
            onUpdate: () => {
                span.textContent = String(Math.round(counter.v));
            },
        });
        return () => {
            tween.kill();
            span.textContent = String(value);
        };
    }, [value]);
    return <span ref={el} className={className} />;
}

// Team card at its natural width (long names make wider cards, like the sketch). It
// bounces when a player joins and flips when the 🎲 renames it.
function TeamCard({ team, cap, members }: { team: Team; cap: number; members: Player[] }) {
    const el = useRef<HTMLDivElement>(null);
    const nameRef = useFitText<HTMLHeadingElement>(18, 11, [team.name]);
    const prevCount = useRef(members.length);
    const prevName = useRef(team.name);

    useLayoutEffect(() => {
        const grew = members.length > prevCount.current;
        prevCount.current = members.length;
        if (!grew || !el.current) return;
        const tween = gsap.fromTo(
            el.current,
            { scale: 1, rotate: 0 },
            { scale: 1.12, rotate: -2, duration: 0.16 * MOTION, yoyo: true, repeat: 1, ease: "power1.inOut", clearProps: "transform" }
        );
        return () => {
            tween.kill();
        };
    }, [members.length]);

    useLayoutEffect(() => {
        const renamed = prevName.current !== team.name;
        prevName.current = team.name;
        if (!renamed || !el.current) return;
        const tween = gsap.fromTo(
            el.current,
            { rotationX: 90, autoAlpha: 0.3 },
            { rotationX: 0, autoAlpha: 1, duration: 0.35 * MOTION, ease: "back.out(1.7)", clearProps: "transform,opacity,visibility" }
        );
        return () => {
            tween.kill();
        };
    }, [team.name]);

    return (
        <div
            ref={el}
            className="hl-card bg-white text-black min-w-40 max-w-64 p-2 border-t-8 rounded-lg shadow-md text-left"
            style={{ borderTopColor: team.color }}
        >
            <div className="flex items-baseline justify-between gap-3 border-b-2 border-black pb-1">
                <h3 ref={nameRef} className="font-bold leading-tight whitespace-nowrap overflow-hidden min-w-0">
                    {team.name}
                </h3>
                <span className={`text-xs shrink-0 ${members.length > cap ? "text-red-600 font-bold" : "opacity-60"}`}>
                    {members.length}/{cap}
                </span>
            </div>
            {members.length === 0 ? (
                <p className="text-xs opacity-50 mt-1">waiting…</p>
            ) : (
                <p className="text-xs leading-tight mt-1 break-words">{members.map((p) => p.name).join(", ")}</p>
            )}
        </div>
    );
}
