import type { Team } from "./teams";

type Props = {
    teams: Team[];
    // Points added/subtracted when pressing +/-. When undefined, buttons are hidden.
    points?: number;
    onChange?: (teamIndex: number, delta: number) => void;
};

export default function TeamScores({ teams, points, onChange }: Props) {
    return (
        <div className="flex flex-wrap justify-center gap-6 mt-4">
            {teams.map((team, i) => (
                <div key={team.name} className="bg-white w-40 p-2 text-center shadow-lg">
                    <h3 className="font-bold text-2xl border-b-4 border-black pb-1 mb-2">{team.name}</h3>
                    <div className="bg-[#2a3698] text-white font-bold text-3xl py-1">{team.score}</div>
                    {points !== undefined && onChange && (
                        <div className="flex justify-around mt-1 text-3xl font-bold">
                            <button
                                className="text-green-600 hover:scale-125 transition-transform cursor-pointer"
                                onClick={() => onChange(i, points)}
                                aria-label={`Add ${points} to ${team.name}`}
                            >
                                +
                            </button>
                            <button
                                className="text-red-600 hover:scale-125 transition-transform cursor-pointer"
                                onClick={() => onChange(i, -points)}
                                aria-label={`Subtract ${points} from ${team.name}`}
                            >
                                −
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
