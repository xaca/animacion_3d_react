// `color` comes from teamNames.ts in multiplayer; local mode has none.
// `bonus`: extra spots the host gave this team on top of the room's max (e.g. 17
// students in teams of 2 → one team gets +1).
// `scoredSeq`: when the team last gained points (monotonic, stamped at each reveal in
// answer order) — the podium tie-breaker: equal totals → whoever reached its score first.
export type Team = { id: string; name: string; score: number; color?: string; bonus?: number; scoredSeq?: number };

// Fixed teams for local mode; in multiplayer the host sets the count and names are random
export function makeTeams(count: number): Team[] {
    return Array.from({ length: count }, (_, i) => ({ id: `t${i + 1}`, name: `Team ${i + 1}`, score: 0 }));
}

// Strict ranking, no shared places (the podium always has a single 1st, 2nd and 3rd):
// score desc, then whoever REACHED its score first (scoredSeq), then name as the last
// resort (teams that never scored, rooms from before the field).
// `index` is the team's position in the original array.
export function rankTeams(teams: Team[]): { team: Team; index: number; place: number }[] {
    const sorted = teams
        .map((team, index) => ({ team, index }))
        .sort(
            (a, b) =>
                b.team.score - a.team.score ||
                (a.team.scoredSeq ?? Number.MAX_SAFE_INTEGER) - (b.team.scoredSeq ?? Number.MAX_SAFE_INTEGER) ||
                a.team.name.localeCompare(b.team.name)
        );
    return sorted.map((entry, i) => ({ ...entry, place: i + 1 }));
}
