import { rankTeams, type Team } from "./teams";

type Props = {
    teams: Team[];
    // Player names per team index (multiplayer); omitted in local mode
    membersOf?: (teamIndex: number) => string[];
};

const HEIGHTS: Record<number, string> = { 1: "h-40", 2: "h-28", 3: "h-16" };
const MEDALS: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

export default function Podium({ teams, membersOf }: Props) {
    const ranked = rankTeams(teams);
    // Classic podium order: 2nd, 1st, 3rd. Tied teams stand on the same step.
    const columns = [2, 1, 3]
        .map((place) => ({ place, entries: ranked.filter((r) => r.place === place) }))
        .filter((c) => c.entries.length > 0);
    const rest = ranked.filter((r) => r.place > 3);

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <div className="flex items-end justify-center gap-3 w-full max-w-3xl">
                {columns.map(({ place, entries }) => (
                    <div key={place} className="flex flex-col items-center gap-2 flex-1 max-w-56">
                        {entries.map(({ team, index }) => (
                            <div key={index} className="bg-white text-black w-full p-2 text-center border-t-8" style={{ borderTopColor: team.color ?? "#2a3698" }}>
                                <p className="font-bold text-xl leading-tight">{team.name}</p>
                                <p className="text-2xl font-bold text-[#2a3698]">{team.score}</p>
                                {membersOf && <p className="text-sm opacity-70">{membersOf(index).join(", ")}</p>}
                            </div>
                        ))}
                        <div
                            className={`w-full ${HEIGHTS[place]} bg-yellow-300 border-4 border-black flex items-start justify-center`}
                        >
                            <span className="text-4xl">{MEDALS[place]}</span>
                        </div>
                    </div>
                ))}
            </div>
            {rest.length > 0 && (
                <ul className="text-xl opacity-80">
                    {rest.map(({ team, index, place }) => (
                        <li key={index}>
                            {place}. {team.name} — {team.score}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
