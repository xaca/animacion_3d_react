import TeamScores from "./TeamScores";
import type { Team } from "./teams";

type Props = {
    teams: Team[];
    onPlayAgain?: () => void;
};

export default function EndScreen({ teams, onPlayAgain }: Props) {
    const best = Math.max(...teams.map((t) => t.score));
    const winners = teams.filter((t) => t.score === best).map((t) => t.name);

    return (
        <div className="min-h-screen bg-[#2a3698] flex flex-col items-center justify-center gap-6 p-4">
            <h1 className="text-white text-5xl font-bold">Game over!</h1>
            <p className="text-yellow-300 text-3xl font-bold text-center">
                {winners.length > 1 ? `Tie: ${winners.join(", ")}` : `${winners[0]} wins!`}
            </p>
            <TeamScores teams={teams} />
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
