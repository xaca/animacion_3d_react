import type { Extras } from "./roomService";

// The host's last setup, remembered on this device for the "⚡ Quick start" card and
// the class calculator. Only a convenience: without storage the card just doesn't show.
const KEY = "jeopardy-setup-last";

export type LastSetup = {
    topic: string;
    topicName?: string; // display name (uploaded topics aren't in topics.ts)
    readSeconds: number;
    timerSeconds: number;
    startSeconds: number;
    teamCount: number;
    maxTeamSize: number;
    students: number; // class calculator inputs
    perTeam: number;
    boardSize?: number; // added later: missing in older saved setups
    gameMinutes?: number;
    extras?: Extras; // also later; applySettings keeps only the known boolean keys
};

const NUMBERS = ["readSeconds", "timerSeconds", "startSeconds", "teamCount", "maxTeamSize", "students", "perTeam"] as const;

export function loadLastSetup(): LastSetup | null {
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return null;
        const v = JSON.parse(raw) as Partial<LastSetup>;
        if (typeof v.topic !== "string" || NUMBERS.some((k) => typeof v[k] !== "number")) return null;
        return v as LastSetup;
    } catch {
        return null;
    }
}

export function saveLastSetup(setup: LastSetup) {
    try {
        localStorage.setItem(KEY, JSON.stringify(setup));
    } catch {
        // remembered for this page only
    }
}
