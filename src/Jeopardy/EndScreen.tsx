import type { ReactNode } from "react";
import Podium from "./Podium";
import { rankTeams, type Team } from "./teams";

type Props = {
    teams: Team[];
    membersOf?: (teamIndex: number) => string[];
    onPlayAgain?: () => void;
    actions?: ReactNode; // host: next-game choices instead of "Play again"
};

export default function EndScreen({ teams, membersOf, onPlayAgain, actions }: Props) {
    // Strict ranking: there is always a single winner (ties break by who scored first)
    const winner = rankTeams(teams)[0]?.team.name;

    return (
        <div className="min-h-screen bg-[#2a3698] text-white flex flex-col items-center justify-center gap-6 p-4">
            <h1 className="text-5xl font-bold">Game over!</h1>
            <p className="text-yellow-300 text-3xl font-bold text-center">
                {teams.length === 0 ? "Everyone left the game 🤷" : `${winner} wins!`}
            </p>
            {teams.length > 0 && <Podium teams={teams} membersOf={membersOf} />}
            {actions}
            {!actions && onPlayAgain && (
                <button
                    onClick={onPlayAgain}
                    className="bg-white text-[#2a3698] text-2xl font-bold px-6 py-3 cursor-pointer hover:bg-yellow-300"
                >
                    Play again
                </button>
            )}
        </div>
    );
}
