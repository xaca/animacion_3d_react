import gsap from "gsap";
import { lazy, Suspense, useLayoutEffect, useMemo, useRef, useState } from "react";
import { GROUPS, TOPICS } from "../topics";
import { MOTION } from "./panelMode";
import { asTopicInfo, useCustomTopics } from "./customTopics";
import { toggleRoomDebug } from "./debugSwitch";
import ProfileMenu, { type MenuItem } from "./ProfileMenu";
import { applySettings, cleanRooms, listOldRooms, openRoom, topicLabel, type Room } from "./roomService";
import { loadLastSetup, saveLastSetup, type LastSetup } from "./setupPrefs";
import { pulse, staggerIn } from "./setup/anim";
import CategoryStep from "./setup/CategoryStep";
import GameStep from "./setup/GameStep";
import QuickStart from "./setup/QuickStart";
import TeamsStep from "./setup/TeamsStep";
import TopicStep from "./setup/TopicStep";
import Tabs from "./Tabs";

// Downloaded only when the teacher opens "📥 Subir tema (JSON)"
const UploadTopicModal = lazy(() => import("./setup/UploadTopicModal"));

type Props = {
    room: Room;
    onExit: () => void; // deletes the room and goes home
    onLogout: () => void;
    onNewRoom: () => void; // replaces this room with a fresh one (players are dropped)
};

const STEPS = ["Category", "Topic", "Game", "Teams"];
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

// Host-only configuration as four free steps (tabs). The code is hidden on purpose:
// players join from the lobby. Every value shown comes from the live room; the step,
// the chosen category and the class calculator are local to this screen.
export default function HostSetup({ room, onExit, onLogout, onNewRoom }: Props) {
    const [last] = useState<LastSetup | null>(loadLastSetup);
    const [step, setStep] = useState(0);
    const [visited, setVisited] = useState<Set<number>>(() => new Set([0]));
    const [uploading, setUploading] = useState(false);
    // Built-in topics + the teacher's uploaded ones (custom_topics, live)
    const custom = useCustomTopics();
    const allTopics = useMemo(() => [...TOPICS, ...custom.map(asTopicInfo)], [custom]);
    const [group, setGroup] = useState(() => TOPICS.find((t) => t.id === room.topic)?.group ?? GROUPS[0].id);
    const [students, setStudents] = useState(() => last?.students ?? room.teams.length * room.maxTeamSize);
    // Never more "per team" than students (the calculator grays those sizes out)
    const [perTeam, setPerTeam] = useState(() =>
        Math.min(clamp(last?.perTeam ?? room.maxTeamSize, 1, 6), last?.students ?? room.teams.length * room.maxTeamSize)
    );
    const [busy, setBusy] = useState(false);
    const busyRef = useRef(false);

    const players = Object.values(room.players);

    function goTo(next: number) {
        const to = clamp(next, 0, STEPS.length - 1);
        setStep(to);
        setVisited((v) => (v.has(to) ? v : new Set(v).add(to)));
    }

    // One action at a time: double clicks must not open the room twice
    async function run(action: () => Promise<void>) {
        if (busyRef.current) return;
        busyRef.current = true;
        setBusy(true);
        try {
            await action();
        } catch (e) {
            console.error("Setup action failed", e);
            alert("Something went wrong. Check your connection and try again.");
        } finally {
            busyRef.current = false;
            setBusy(false);
        }
    }

    const open = () =>
        run(async () => {
            saveLastSetup({
                topic: room.topic,
                topicName: topicLabel(room),
                readSeconds: room.readSeconds,
                timerSeconds: room.timerSeconds,
                startSeconds: room.startSeconds,
                teamCount: room.teams.length,
                maxTeamSize: room.maxTeamSize,
                boardSize: room.boardSize ?? 5,
                gameMinutes: room.gameMinutes ?? 0,
                students,
                perTeam,
            });
            await openRoom(room.code);
        });

    // Quick start: the saved setup in one write. With players waiting their teams stay as they are.
    const quickSettings = (s: LastSetup) => ({
        readSeconds: s.readSeconds,
        timerSeconds: s.timerSeconds,
        startSeconds: s.startSeconds,
        boardSize: s.boardSize,
        gameMinutes: s.gameMinutes,
        ...(players.length > 0 ? {} : { teamCount: s.teamCount, maxTeamSize: s.maxTeamSize }),
    });
    const quickOpen = (s: LastSetup) =>
        run(async () => {
            await applySettings(room.code, { topic: s.topic, topicName: s.topicName, ...quickSettings(s) });
            saveLastSetup(s);
            await openRoom(room.code);
        });
    const quickNewTopic = (s: LastSetup) =>
        run(async () => {
            await applySettings(room.code, quickSettings(s));
            setStudents(s.students);
            setPerTeam(Math.min(clamp(s.perTeam, 1, 6), s.students));
            goTo(1);
        });

    function calc(n: number, per: number) {
        setStudents(n);
        setPerTeam(per);
    }

    // Housekeeping: deletes every room except this one (the question bank is untouched)
    async function cleanOldRooms() {
        try {
            const olds = await listOldRooms(room.code);
            if (olds.length === 0) return alert("No old rooms to clean ✨");
            const dated = olds.map((r) => r.createdAt).filter((t): t is number => typeof t === "number");
            const days = dated.length > 0 ? Math.max(1, Math.round((Date.now() - Math.min(...dated)) / 86_400_000)) : null;
            const label = `${olds.length} old room${olds.length === 1 ? "" : "s"}${days !== null ? ` (oldest ≈ ${days} day${days === 1 ? "" : "s"})` : ""}`;
            if (!confirm(`Delete ${label}? This room is kept; the questions are never touched.`)) return;
            await cleanRooms(olds.map((r) => r.code));
            alert(`Deleted ${label}.`);
        } catch (e) {
            console.error("Could not clean old rooms", e);
            alert("Could not clean the old rooms. Check your connection and try again.");
        }
    }

    const confirmDrop = () => players.length === 0 || confirm(`${players.length} players will be disconnected. Continue?`);
    const menu: MenuItem[] = [
        { label: "📥 Subir tema (JSON)", onClick: () => setUploading(true) },
        { label: "🐞 Debug mode", on: room.debug === true, onClick: () => toggleRoomDebug(room.code, room.debug !== true), separatorBefore: true },
        { label: "🧹 Clean old rooms", onClick: () => void cleanOldRooms() },
        ...(players.length > 0 ? [{ label: "✨ Start over in a new room", onClick: () => confirmDrop() && onNewRoom() }] : []),
        { label: "Cancel room", onClick: () => confirmDrop() && onExit(), danger: true, separatorBefore: true },
        { label: "Log out", onClick: onLogout, separatorBefore: true },
    ];

    // Entrance: header and tabs fade down once
    const head = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        const tween = gsap.fromTo(
            head.current!.children,
            { autoAlpha: 0, y: -14 },
            { autoAlpha: 1, y: 0, duration: 0.35 * MOTION, stagger: 0.06 * MOTION, ease: "power2.out", clearProps: "transform,opacity,visibility" }
        );
        return () => {
            tween.kill();
        };
    }, []);

    // Step content slides in from the side we're moving toward (from below on the first one).
    // The panel is keyed by step, so a fast click just starts the next panel's tween.
    const panel = useRef<HTMLDivElement>(null);
    const prevStep = useRef<number | null>(null);
    useLayoutEffect(() => {
        const dir = prevStep.current === null ? 0 : Math.sign(step - prevStep.current);
        prevStep.current = step;
        if (!panel.current) return;
        const tween = staggerIn(panel.current.querySelectorAll(".su-item"), dir);
        return () => {
            tween.kill();
        };
    }, [step]);

    const steps = STEPS.map((label, i) => ({ value: i, label, done: visited.has(i) && i !== step }));
    const footerButton = "font-bold text-xl px-5 py-2 rounded-lg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

    return (
        <div className="h-dvh flex flex-col bg-[#2a3698] text-white text-center overflow-hidden">
            <div ref={head} className="shrink-0 flex flex-col items-center gap-3 px-4 pt-4">
                <header className="w-full flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-3xl md:text-4xl font-bold">Set up the game</h1>
                    <div className="flex flex-wrap items-center justify-center gap-2 text-lg">
                        <Summary text={topicLabel(room)} strong />
                        <Summary text={`read ${room.readSeconds} s · answer ${room.timerSeconds} s`} />
                        <Summary
                            text={`${room.boardSize ?? 5}×${room.boardSize ?? 5}${(room.gameMinutes ?? 0) > 0 ? ` · ${room.gameMinutes} min` : ""}`}
                        />
                        <Summary text={`${room.teams.length} teams × ${room.maxTeamSize}`} />
                        {step < STEPS.length - 1 && (
                            <button
                                type="button"
                                disabled={busy}
                                onClick={open}
                                className="ml-1 bg-white text-[#2a3698] font-bold px-3 py-1 rounded-lg cursor-pointer hover:bg-yellow-300 disabled:opacity-50"
                            >
                                Open room →
                            </button>
                        )}
                    </div>
                    <ProfileMenu items={menu} />
                </header>
                <Tabs label="Setup steps" idBase="setup" items={steps} value={step} onChange={goTo} big />
            </div>

            <div
                ref={panel}
                key={step}
                role="tabpanel"
                id="setup-panel"
                aria-labelledby={`setup-tab-${step}`}
                className="flex-1 min-h-0 overflow-y-auto flex flex-col items-center gap-4 px-4 py-5"
            >
                {step === 0 && (
                    <>
                        {players.length > 0 && (
                            <p className="su-item bg-yellow-300 text-black font-bold text-xl rounded-xl px-5 py-2">
                                🎉 {players.length} {players.length === 1 ? "player is" : "players are"} waiting in room{" "}
                                <span className="tracking-widest">{room.code}</span> — pick the next topic
                            </p>
                        )}
                        {last && (
                            <QuickStart
                                last={last}
                                keepTeams={players.length > 0}
                                busy={busy}
                                onOpenNow={() => quickOpen(last)}
                                onNewTopic={() => quickNewTopic(last)}
                            />
                        )}
                        <CategoryStep
                            group={group}
                            topic={room.topic}
                            topics={allTopics}
                            onPick={(g) => {
                                setGroup(g);
                                goTo(1);
                            }}
                        />
                    </>
                )}
                {step === 1 && <TopicStep room={room} group={group} topics={allTopics} onChangeGroup={() => goTo(0)} />}
                {step === 2 && <GameStep room={room} />}
                {step === 3 && <TeamsStep room={room} students={students} perTeam={perTeam} onCalc={calc} />}
            </div>

            <footer className="shrink-0 flex items-center justify-between gap-3 px-4 py-3 border-t border-white/10">
                <button type="button" disabled={step === 0} onClick={() => goTo(step - 1)} className={`${footerButton} bg-white/10 hover:bg-white/20`}>
                    ← Back
                </button>
                <span className="opacity-70 hidden sm:block">
                    Step {step + 1} of {STEPS.length}
                </span>
                {step < STEPS.length - 1 ? (
                    <button type="button" onClick={() => goTo(step + 1)} className={`${footerButton} bg-white text-[#2a3698] hover:bg-yellow-300`}>
                        Next →
                    </button>
                ) : (
                    <button type="button" disabled={busy} onClick={open} className={`${footerButton} bg-yellow-300 text-black hover:bg-white text-2xl`}>
                        {busy ? "Opening…" : "Open room →"}
                    </button>
                )}
            </footer>
            {uploading && (
                <Suspense fallback={null}>
                    <UploadTopicModal onClose={() => setUploading(false)} />
                </Suspense>
            )}
        </div>
    );
}

// Summary chip in the header; pulses when its value changes
function Summary({ text, strong }: { text: string; strong?: boolean }) {
    const el = useRef<HTMLSpanElement>(null);
    const mounted = useRef(false);
    useLayoutEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
            return;
        }
        const tween = pulse(el.current);
        return () => {
            tween.kill();
        };
    }, [text]);
    return (
        <span ref={el} className={`rounded-full px-3 py-1 ${strong ? "bg-yellow-300 text-black font-bold" : "bg-white/10"}`}>
            {text}
        </span>
    );
}
