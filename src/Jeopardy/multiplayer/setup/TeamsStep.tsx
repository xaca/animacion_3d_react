import gsap from "gsap";
import { useLayoutEffect, useRef, useState } from "react";
import type { Team } from "../../teams";
import { MOTION } from "../panelMode";
import {
    applySettings,
    rerollTeamNames,
    setMaxTeamSize,
    setTeamCount,
    TEAM_COUNT_CHOICES,
    TEAM_SIZE_CHOICES,
    type Room,
} from "../roomService";
import Tabs from "../Tabs";
import { MAX_STUDENTS, splitClass } from "../teamMath";
import { linkButton } from "../ui";
import { popIn, pulse } from "./anim";

type Props = {
    room: Room;
    students: number;
    perTeam: number;
    onCalc: (students: number, perTeam: number) => void;
};

const select = "bg-white text-black px-3 py-1 rounded-md";
const PER_TEAM = [2, 3, 4, 5, 6].map((n) => ({ value: n, label: String(n) }));

// Step 4: class calculator (students → teams), the manual selects, and the team names
export default function TeamsStep({ room, students, perTeam, onCalc }: Props) {
    const split = splitClass(students, perTeam);
    const players = Object.values(room.players);
    const applied = split.teams === room.teams.length && split.maxTeamSize === room.maxTeamSize;
    // Lowering the count unassigns the players of the removed teams (they pick again in the lobby)
    const kept = new Set(room.teams.slice(0, split.teams).map((t) => t.id));
    const displaced = players.filter((p) => p.team !== null && !kept.has(p.team)).length;
    const applyBtn = useRef<HTMLButtonElement>(null);

    function apply() {
        if (applyBtn.current) pulse(applyBtn.current);
        applySettings(room.code, { teamCount: split.teams, maxTeamSize: split.maxTeamSize });
    }

    // Teams that exist when the step opens don't pop in; ones added later do
    const [initialIds] = useState(() => new Set(room.teams.map((t) => t.id)));

    return (
        <div className="flex flex-col items-center gap-4 w-full max-w-4xl">
            <div className="su-item w-full rounded-xl bg-white/5 p-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                <label className="flex items-center gap-3 text-2xl font-bold">
                    🧑‍🎓 Students
                    <span className="flex items-center rounded-lg bg-white text-black overflow-hidden">
                        <button type="button" aria-label="One less" className="px-3 py-1 cursor-pointer hover:bg-yellow-300" onClick={() => onCalc(Math.max(1, students - 1), perTeam)}>
                            −
                        </button>
                        <input
                            type="number"
                            min={1}
                            max={MAX_STUDENTS}
                            value={students}
                            onChange={(e) => {
                                const n = Number(e.target.value);
                                if (Number.isFinite(n) && n >= 1) onCalc(Math.min(MAX_STUDENTS, Math.round(n)), perTeam);
                            }}
                            className="w-20 text-center py-1 outline-none"
                        />
                        <button type="button" aria-label="One more" className="px-3 py-1 cursor-pointer hover:bg-yellow-300" onClick={() => onCalc(Math.min(MAX_STUDENTS, students + 1), perTeam)}>
                            +
                        </button>
                    </span>
                </label>
                <div className="flex items-center gap-3 text-2xl font-bold">
                    Per team
                    <Tabs label="Players per team" items={PER_TEAM} value={perTeam} onChange={(n) => onCalc(students, n)} />
                </div>
                <div className="flex items-center gap-4">
                    <p className="text-2xl">
                        → <CountUp value={split.teams} className="font-bold text-yellow-300" /> teams of up to{" "}
                        <CountUp value={split.maxTeamSize} className="font-bold text-yellow-300" />{" "}
                        <span className="text-base opacity-70">({split.places} places)</span>
                    </p>
                    <button
                        ref={applyBtn}
                        type="button"
                        onClick={apply}
                        disabled={applied}
                        className="bg-yellow-300 text-black font-bold text-xl px-4 py-2 rounded-lg cursor-pointer hover:bg-white disabled:bg-white/20 disabled:text-white disabled:cursor-default"
                    >
                        {applied ? "✓ Applied" : "Apply"}
                    </button>
                </div>
                {split.tooMany && <p className="w-full text-yellow-300">That's more than 10 teams of 6: some students will have to watch or share a phone.</p>}
                {!applied && displaced > 0 && (
                    <p className="w-full text-yellow-300">
                        {displaced} {displaced === 1 ? "player" : "players"} will need to pick a team again.
                    </p>
                )}
            </div>

            <div className="su-item flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xl">
                <span className="opacity-80">Or set them by hand:</span>
                <label className="flex items-center gap-3">
                    Teams
                    <select value={room.teams.length} onChange={(e) => setTeamCount(room.code, Number(e.target.value))} className={select}>
                        {TEAM_COUNT_CHOICES.map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="flex items-center gap-3">
                    Max per team
                    <select value={room.maxTeamSize} onChange={(e) => setMaxTeamSize(room.code, Number(e.target.value))} className={select}>
                        {TEAM_SIZE_CHOICES.map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="su-item flex flex-wrap justify-center items-start gap-3">
                {room.teams.map((team) => (
                    <TeamChip
                        key={team.id}
                        team={team}
                        isNew={!initialIds.has(team.id)}
                        members={players.filter((p) => p.team === team.id).map((p) => p.name)}
                    />
                ))}
            </div>
            <button type="button" className={`su-item ${linkButton} text-xl`} onClick={() => rerollTeamNames(room.code)}>
                🎲 New names
            </button>
        </div>
    );
}

// Team name with its color; pops in when added, flips when renamed (🎲)
function TeamChip({ team, isNew, members }: { team: Team; isNew: boolean; members: string[] }) {
    const el = useRef<HTMLDivElement>(null);
    const first = useRef(true);
    useLayoutEffect(() => {
        if (!el.current) return;
        if (first.current) {
            first.current = false;
            if (!isNew) return;
            const tween = popIn(el.current);
            return () => {
                tween.kill();
            };
        }
        const tween = gsap.fromTo(
            el.current,
            { rotationX: 90, autoAlpha: 0.3 },
            { rotationX: 0, autoAlpha: 1, duration: 0.35 * MOTION, ease: "back.out(1.7)", clearProps: "transform,opacity,visibility" }
        );
        return () => {
            tween.kill();
        };
    }, [team.name, isNew]);

    return (
        <div ref={el} className="bg-white text-black rounded-lg px-3 py-1.5 text-left min-w-36">
            <span className="flex items-center gap-2 font-bold text-lg">
                <span className="inline-block w-4 h-4 rounded-sm" style={{ background: team.color }} />
                {team.name}
            </span>
            {members.length > 0 && <span className="block text-sm opacity-70 max-w-48">{members.join(", ")}</span>}
        </div>
    );
}

// Number that counts from its previous value (like the scores). React renders the span
// empty; only this effect writes its text, so GSAP never fights React over it.
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
            duration: 0.4 * MOTION,
            ease: "power1.out",
            onUpdate: () => {
                span.textContent = String(Math.round(counter.v));
            },
            onComplete: () => {
                span.textContent = String(value);
            },
        });
        return () => {
            tween.kill();
            span.textContent = String(value);
        };
    }, [value]);
    return <span ref={el} className={className} />;
}
