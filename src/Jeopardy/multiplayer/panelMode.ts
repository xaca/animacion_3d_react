import { useEffect, useState } from "react";

export type PanelMode = "expanded" | "rail" | "hidden";

export const PANEL_WIDTH: Record<PanelMode, number> = { expanded: 280, rail: 72, hidden: 0 };

// Animation speed factor: 0 when the computer asks for reduced motion (GSAP durations × MOTION)
export const MOTION = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1;

const KEY = "jeopardy-score-panel";
const NEXT: Record<PanelMode, PanelMode> = { expanded: "rail", rail: "hidden", hidden: "expanded" };
// Values saved by the previous version of the panel
const OLD: Record<string, PanelMode> = { open: "expanded", medium: "rail", closed: "hidden" };

function read(): PanelMode {
    try {
        const v = localStorage.getItem(KEY);
        if (v === "expanded" || v === "rail" || v === "hidden") return v;
        if (v && OLD[v]) return OLD[v];
    } catch {
        // no storage: fall through to the default
    }
    return typeof innerWidth === "number" && innerWidth < 768 ? "rail" : "expanded";
}

function save(mode: PanelMode) {
    try {
        localStorage.setItem(KEY, mode);
    } catch {
        // remembered for this page only
    }
}

// Score sidebar state on the host screen, remembered per device.
// Shortcuts: S cycles expanded → rail → hidden; Ctrl/⌘+B toggles expanded ↔ rail.
export function usePanelMode(): [PanelMode, (mode: PanelMode) => void] {
    const [mode, setModeState] = useState<PanelMode>(read);

    function setMode(next: PanelMode) {
        setModeState(next);
        save(next);
    }

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;
            const toggle = (e.ctrlKey || e.metaKey) && (e.key === "b" || e.key === "B");
            const cycle = !e.ctrlKey && !e.metaKey && !e.altKey && (e.key === "s" || e.key === "S");
            if (!toggle && !cycle) return;
            e.preventDefault();
            setModeState((current) => {
                const next = cycle ? NEXT[current] : current === "expanded" ? "rail" : "expanded";
                save(next);
                return next;
            });
        }
        addEventListener("keydown", onKey);
        return () => removeEventListener("keydown", onKey);
    }, []);

    return [mode, setMode];
}
