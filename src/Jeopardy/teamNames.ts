import { shuffle } from "./questions";

export type TeamName = { name: string; color: string };

// Random team names for multiplayer. More entries than the max team count (10),
// so a room never repeats one. Colors are distinct enough to tell apart on the big screen.
export const TEAM_NAMES: TeamName[] = [
    { name: "Red Fox", color: "#dc2626" },
    { name: "Blue Whale", color: "#2563eb" },
    { name: "Green Frog", color: "#16a34a" },
    { name: "Golden Eagle", color: "#eab308" },
    { name: "Purple Octopus", color: "#9333ea" },
    { name: "Orange Tiger", color: "#f97316" },
    { name: "Pink Flamingo", color: "#ec4899" },
    { name: "Black Panther", color: "#171717" },
    { name: "Brown Bear", color: "#92400e" },
    { name: "Teal Turtle", color: "#0d9488" },
    { name: "Silver Shark", color: "#9ca3af" },
    { name: "Crimson Crab", color: "#9f1239" },
    { name: "Lime Lizard", color: "#84cc16" },
    { name: "Navy Narwhal", color: "#1e3a8a" },
    { name: "Coral Koala", color: "#fb7185" },
    { name: "Sky Dolphin", color: "#0ea5e9" },
];

// `count` random names not already in `taken`
export function pickTeamNames(count: number, taken: string[]): TeamName[] {
    return shuffle(TEAM_NAMES.filter((t) => !taken.includes(t.name))).slice(0, count);
}
