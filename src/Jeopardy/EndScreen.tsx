import Podium from "./Podium";
import { rankTeams, type Team } from "./teams";

type Props = {
    teams: Team[];
    membersOf?: (teamIndex: number) => string[];
    onPlayAgain?: () => void;
};

export default function EndScreen({ teams, membersOf, onPlayAgain }: Props) {
    const winners = rankTeams(teams)
        .filter((r) => r.place === 1)
        .map((r) => r.team.name);

    return (
        <div className="min-h-screen bg-[#2a3698] text-white flex flex-col items-center justify-center gap-6 p-4">
            <h1 className="text-5xl font-bold">Game over!</h1>
            <p className="text-yellow-300 text-3xl font-bold text-center">
                {winners.length > 1 ? `Tie: ${winners.join(", ")}` : `${winners[0]} wins!`}
            </p>
            <Podium teams={teams} membersOf={membersOf} />
            {onPlayAgain && (
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
