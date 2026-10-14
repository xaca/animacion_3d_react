import gsap from "gsap";
import { useLayoutEffect, useRef, useState } from "react";
import Board from "../Board";
import EndScreen from "../EndScreen";
import GameOverSplash from "../GameOverSplash";
import { TOPICS } from "../topics";
import HostLobby from "./HostLobby";
import HostQuestionView from "./HostQuestionView";
import HostSetup from "./HostSetup";
import ScorePanel from "./ScorePanel";
import { MOTION, usePanelMode } from "./panelMode";
import { backToLobby, deleteRoom, openTile, type Room } from "./roomService";
import { Message } from "./ui";
import { useRoom } from "./useRoom";

type Props = {
    code: string;
    onExit: () => void;
    onLogout: () => void;
};

export default function HostGame({ code, onExit, onLogout }: Props) {
    const room = useRoom(code);
    const [panelMode, setPanelMode] = usePanelMode();

    // "Game over!" splash shown once when the game ends; rearmed when the status changes
    // (adjust-state-during-render pattern, see react.dev "You might not need an effect")
    const [splashDone, setSplashDone] = useState(false);
    const status = room ? room.status : null;
    const [prevStatus, setPrevStatus] = useState(status);
    if (status !== prevStatus) {
        setPrevStatus(status);
        if (status !== "end") setSplashDone(false);
    }

    if (room === undefined) return <Message text="Loading…" />;
    if (room === null) return <Message text="This room no longer exists." onBack={onExit} />;

    async function closeRoom() {
        await deleteRoom(code);
        onExit();
    }

    if (room.status === "setup") return <HostSetup room={room} onExit={closeRoom} onLogout={onLogout} />;
    if (room.status === "lobby") return <HostLobby room={room} onExit={closeRoom} />;
    if (room.status === "end") {
        if (!splashDone) return <GameOverSplash onDone={() => setSplashDone(true)} />;
        const members = (i: number) =>
            Object.values(room.players)
                .filter((p) => p.team === room.teams[i].id)
                .map((p) => p.name);
        return <EndScreen teams={room.teams} membersOf={members} onPlayAgain={() => backToLobby(code)} />;
    }

    const active = room.activeTile;
    const activeTile = active ? room.board[active.col].tiles[active.row] : null;
    const topic = TOPICS.find((t) => t.id === room.topic)?.name ?? room.topic;

    // Whole screen, no page scroll: score sidebar on the left, board (or question) in an
    // inset panel filling the rest
    return (
        <div className="h-dvh flex bg-[#1c2470] text-white overflow-hidden">
            <ScorePanel room={room} topic={topic} mode={panelMode} onMode={setPanelMode} />
            <main className="flex-1 min-w-0 min-h-0 p-2">
                <div className="relative h-full flex flex-col rounded-xl bg-[#2a3698] shadow-2xl p-2 overflow-hidden">
                    {/* The sidebar header shows topic + room when expanded; otherwise this corner label does */}
                    {panelMode !== "expanded" && (
                        <p className="absolute top-1 right-3 z-10 text-sm opacity-80">
                            <b className="mr-2">{topic} ·</b>
                            Room <b className="tracking-widest">{room.code}</b>
                        </p>
                    )}
                    {room.status === "question" && active && activeTile && panelMode === "hidden" && room.revealed && (
                        <ResultToast key={`${active.col}-${active.row}`} room={room} />
                    )}
                    {room.status === "question" && active && activeTile ? (
                        <div className="flex-1 min-h-0 pt-5">
                            <HostQuestionView key={`${active.col}-${active.row}`} room={room} code={code} />
                        </div>
                    ) : (
                        <div className="flex-1 min-h-0 pt-4">
                            <Board board={room.board} onSelect={(col, row) => openTile(code, col, row)} />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

// Sidebar hidden: each team's result slides down for 3 s after the reveal. Keyed per question.
function ResultToast({ room }: { room: Room }) {
    const box = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        const tl = gsap
            .timeline()
            .fromTo(box.current, { y: -80, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4 * MOTION, ease: "back.out(1.6)" })
            .to(box.current, { y: -80, autoAlpha: 0, duration: 0.3 * MOTION, ease: "power2.in" }, "+=3");
        return () => {
            tl.kill();
        };
    }, []);
    const value = room.board[room.activeTile!.col].tiles[room.activeTile!.row].value;
    const teams = room.teams.filter((t) => Object.values(room.players).some((p) => p.team === t.id));
    return (
        <div
            ref={box}
            className="absolute top-6 left-1/2 -translate-x-1/2 z-20 bg-white text-black px-4 py-2 rounded-lg shadow-xl text-xl flex flex-wrap gap-x-4 opacity-0"
        >
            {teams.map((t) => {
                const a = room.answers.find((x) => x.team === t.id);
                return (
                    <span key={t.id} className="border-l-8 pl-2" style={{ borderLeftColor: t.color }}>
                        {t.name} <b>{!a ? "—" : a.correct ? `+${value}` : "✘"}</b>
                    </span>
                );
            })}
        </div>
    );
}

