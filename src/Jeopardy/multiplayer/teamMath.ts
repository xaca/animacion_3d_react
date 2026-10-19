// Class calculator: "17 students, 2 per team" → 8 teams of 2 where one team gets a
// +1 spot (bonusTeams = 1). The chosen size stays the room's max; leftovers never
// raise it, they go one-per-team as a bonus spot. Within 1..10 teams, 1..6 per team.
export const MIN_TEAMS = 1;
export const MAX_TEAMS = 10;
export const MAX_PER_TEAM = 6;
export const MAX_STUDENTS = 200;

export type ClassSplit = { teams: number; maxTeamSize: number; bonusTeams: number; places: number; tooMany: boolean };

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export function splitClass(students: number, perTeam: number): ClassSplit {
    const n = clamp(Math.round(Number.isFinite(students) ? students : 1), 1, MAX_STUDENTS);
    const per = clamp(Math.round(Number.isFinite(perTeam) ? perTeam : 3), 1, MAX_PER_TEAM);

    let teams = clamp(Math.floor(n / per) || 1, MIN_TEAMS, MAX_TEAMS);
    // Tiny classes: 5 students "of 3" → 2 teams of 3 with an empty spot, not 1 team of 5
    if (n - teams * per > teams) teams = clamp(Math.ceil(n / per), MIN_TEAMS, MAX_TEAMS);
    let maxTeamSize = per;
    let bonusTeams = clamp(n - teams * maxTeamSize, 0, teams);
    // Still short (clamped at 10 teams): grow the base size as a last resort
    if (n > teams * maxTeamSize + bonusTeams) {
        maxTeamSize = clamp(Math.ceil(n / teams), 1, MAX_PER_TEAM);
        bonusTeams = clamp(n - teams * maxTeamSize, 0, teams);
    }
    const places = teams * maxTeamSize + bonusTeams;
    return { teams, maxTeamSize, bonusTeams, places, tooMany: n > places };
}
