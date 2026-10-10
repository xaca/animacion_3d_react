import { useState } from "react";

type Props = {
    onStart: (teamCount: number) => void;
};

export default function SetupScreen({ onStart }: Props) {
    const [teamCount, setTeamCount] = useState(3);

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-black/40 backdrop-blur-sm">
            <h1 className="text-white text-4xl md:text-6xl font-bold text-center px-4">Do you know your English?</h1>
            <div className="flex gap-2">
                <select
                    value={teamCount}
                    onChange={(e) => setTeamCount(Number(e.target.value))}
                    className="bg-white text-3xl px-3 py-2 border border-gray-400"
                >
                    {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                            {n} {n === 1 ? "team" : "teams"}
                        </option>
                    ))}
                </select>
                <button
                    onClick={() => onStart(teamCount)}
                    className="bg-gray-100 hover:bg-white text-3xl px-4 py-2 border border-gray-400 cursor-pointer"
                >
                    Start
                </button>
            </div>
            <p className="text-white text-xl">
                Press <kbd className="bg-gray-100 text-black px-2 py-1 rounded border">F11</kbd> for full-screen mode
            </p>
        </div>
    );
}
