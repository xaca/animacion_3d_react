// Class calculator: "23 students, about 3 per team" -> 8 teams of up to 3.
// Always within the room's limits (2..10 teams, 1..6 per team).
export const MIN_TEAMS = 2;
export const MAX_TEAMS = 10;
export const MAX_PER_TEAM = 6;
export const MAX_STUDENTS = 200;

export type ClassSplit = { teams: number; maxTeamSize: number; places: number; tooMany: boolean };

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export function splitClass(students: number, perTeam: number): ClassSplit {
    const n = clamp(Math.round(Number.isFinite(students) ? students : 1), 1, MAX_STUDENTS);
    const per = clamp(Math.round(Number.isFinite(perTeam) ? perTeam : 3), 1, MAX_PER_TEAM);
    const teams = clamp(Math.ceil(n / per), MIN_TEAMS, MAX_TEAMS);
    const maxTeamSize = clamp(Math.ceil(n / teams), 1, MAX_PER_TEAM);
    return { teams, maxTeamSize, places: teams * maxTeamSize, tooMany: n > teams * maxTeamSize };
}
