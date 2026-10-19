// `color` comes from teamNames.ts in multiplayer; local mode has none.
// `bonus`: extra spots the host gave this team on top of the room's max (e.g. 17
// students in teams of 2 → one team gets +1).
export type Team = { id: string; name: string; score: number; color?: string; bonus?: number };

// Fixed teams for local mode; in multiplayer the host sets the count and names are random
export function makeTeams(count: number): Team[] {
    return Array.from({ length: count }, (_, i) => ({ id: `t${i + 1}`, name: `Team ${i + 1}`, score: 0 }));
}

// Competition ranking: sorted by score, ties share a place (1, 1, 3, …).
// `index` is the team's position in the original array.
export function rankTeams(teams: Team[]): { team: Team; index: number; place: number }[] {
    const sorted = teams.map((team, index) => ({ team, index })).sort((a, b) => b.team.score - a.team.score);
    let place = 0;
    let prevScore = Number.NaN;
    return sorted.map((entry, i) => {
        if (entry.team.score !== prevScore) {
            place = i + 1;
            prevScore = entry.team.score;
        }
        return { ...entry, place };
    });
}
