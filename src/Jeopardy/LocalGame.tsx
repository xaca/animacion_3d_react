import { useState } from "react";
import Board from "./Board";
import EndScreen from "./EndScreen";
import QuestionModal from "./QuestionModal";
import SetupScreen from "./SetupScreen";
import TeamScores from "./TeamScores";
import { makeTeams, type Team } from "./teams";
import { allUsed, buildBoard, markUsed, type Category } from "./questions";

type Phase = "setup" | "board" | "question" | "end";

// One screen, no phones: the host awards points by hand.
export default function LocalGame() {
    const [phase, setPhase] = useState<Phase>("setup");
    const [board, setBoard] = useState<Category[]>(buildBoard);
    const [teams, setTeams] = useState<Team[]>([]);
    const [active, setActive] = useState<{ col: number; row: number } | null>(null);

    function startGame(teamCount: number) {
        setBoard(buildBoard());
        setTeams(makeTeams(teamCount));
        setActive(null);
        setPhase("board");
    }

    function selectTile(col: number, row: number) {
        setActive({ col, row });
        setPhase("question");
    }

    function closeQuestion() {
        if (!active) return;
        const nextBoard = markUsed(board, active.col, active.row);
        setBoard(nextBoard);
        setActive(null);
        setPhase(allUsed(nextBoard) ? "end" : "board");
    }

    function changeScore(teamIndex: number, delta: number) {
        setTeams((prev) => prev.map((team, i) => (i === teamIndex ? { ...team, score: team.score + delta } : team)));
    }

    const activeTile = active ? board[active.col].tiles[active.row] : null;

    if (phase === "setup") {
        return (
            <div className="relative min-h-screen bg-[#1a1f5c] p-2 overflow-hidden">
                <div className="blur-sm pointer-events-none">
                    <Board board={board} />
                </div>
                <SetupScreen onStart={startGame} />
            </div>
        );
    }

    if (phase === "end") {
        return <EndScreen teams={teams} onPlayAgain={() => setPhase("setup")} />;
    }

    return (
        <div className="min-h-screen bg-[#2a3698] p-2 pb-6">
            {phase === "question" && active && activeTile ? (
                <QuestionModal categoryName={board[active.col].name} tile={activeTile} onClose={closeQuestion} />
            ) : (
                <Board board={board} onSelect={selectTile} />
            )}
            <TeamScores
                teams={teams}
                points={phase === "question" ? activeTile?.value : undefined}
                onChange={changeScore}
            />
        </div>
    );
}
