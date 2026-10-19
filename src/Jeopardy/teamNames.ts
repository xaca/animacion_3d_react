import { shuffle } from "./questions";

export type TeamName = { name: string; color: string };

// Random team names for multiplayer, in Spanish with classic colors (user's request:
// no cyan/magenta/coral). More entries than the max team count (10), so a room never
// repeats one; colors stay distinct on the big screen.
export const TEAM_NAMES: TeamName[] = [
    { name: "Zorro Rojo", color: "#dc2626" },
    { name: "Ballena Azul", color: "#2563eb" },
    { name: "Rana Verde", color: "#16a34a" },
    { name: "Águila Dorada", color: "#eab308" },
    { name: "Tigre Naranja", color: "#f97316" },
    { name: "Pulpo Morado", color: "#9333ea" },
    { name: "Flamenco Rosa", color: "#ec4899" },
    { name: "Pantera Negra", color: "#171717" },
    { name: "Oso Café", color: "#92400e" },
    { name: "Lobo Gris", color: "#4b5563" },
    { name: "Delfín Azul Marino", color: "#1e3a8a" },
    { name: "Cocodrilo Verde Oscuro", color: "#14532d" },
    { name: "Tiburón Plateado", color: "#94a3b8" },
];

// `count` random names not already in `taken`
export function pickTeamNames(count: number, taken: string[]): TeamName[] {
    return shuffle(TEAM_NAMES.filter((t) => !taken.includes(t.name))).slice(0, count);
}
