// Debug mode: an event log for finding problems we can't see from here (e.g. a phone
// that stops receiving room updates). Two ways to turn it on:
//   - the teacher's switch: room.debug (phones report to the teacher's console), or
//   - ?debug=1 on one device (local 🐞 panel, fallback); ?debug=0 turns that off.
// When neither is on, every function here returns at once: no logging, no listeners, no cost.
// This module never writes to Firestore (reports are sent by debugReports.ts).

const KEY = "jeopardy-debug";

function readSwitch(): boolean {
    try {
        const param = new URLSearchParams(location.search).get("debug");
        if (param === "1") localStorage.setItem(KEY, "1");
        if (param === "0") localStorage.removeItem(KEY);
        return localStorage.getItem(KEY) === "1";
    } catch {
        return false;
    }
}

// ?debug=1 on this device (the local panel)
export const localDebug: boolean = typeof location !== "undefined" && readSwitch();
// The room this device is in has the teacher's debug switch on (set by useRoom)
let roomDebug = false;

export const isLogging = () => localDebug || roomDebug;

export type DebugEntry = { at: number; kind: string; text: string };

// What the panel's status block shows; updated by subscribeRoom on every snapshot
export type DebugStatus = {
    code: string | null;
    lastUpdateAt: number | null;
    fromCache: boolean | null;
    error: string | null;
    summary: string | null; // "status=question tile=2,0 options=no revealed=no"
    clockOffsetMs: number | null; // host clock − this device, network delay included
};

const MAX = 200;
const entries: DebugEntry[] = [];
const listeners = new Set<() => void>();
let reconnect: (() => void) | null = null;
export const status: DebugStatus = { code: null, lastUpdateAt: null, fromCache: null, error: null, summary: null, clockOffsetMs: null };

function notify() {
    for (const l of listeners) {
        try {
            l();
        } catch {
            // a broken listener must not stop the others
        }
    }
}

export function logEvent(kind: string, text: string) {
    if (!isLogging()) return;
    try {
        entries.push({ at: Date.now(), kind, text });
        if (entries.length > MAX) entries.splice(0, entries.length - MAX);
        notify();
    } catch {
        // logging never breaks the game
    }
}

export function setStatus(patch: Partial<DebugStatus>) {
    if (!isLogging()) return;
    Object.assign(status, patch);
    notify();
}

export const getLog = (): readonly DebugEntry[] => entries;

export function clearLog() {
    entries.length = 0;
    notify();
}

export function subscribeLog(cb: () => void): () => void {
    listeners.add(cb);
    return () => listeners.delete(cb);
}

// useRoom registers how to restart its listener (the panel's 🔌 Reconnect)
export function registerReconnect(fn: () => void): () => void {
    reconnect = fn;
    return () => {
        if (reconnect === fn) reconnect = null;
    };
}

export function requestReconnect(): boolean {
    if (!reconnect) return false;
    logEvent("debug", "reconnect requested");
    reconnect();
    return true;
}

const time = (ms: number) => {
    const d = new Date(ms);
    return `${d.toLocaleTimeString("en-GB", { hour12: false })}.${Math.floor(d.getMilliseconds() / 100)}`;
};

export function formatEntry(e: DebugEntry): string {
    return `${time(e.at)} [${e.kind}] ${e.text}`;
}

// Plain text for "📋 Copy log" (oldest first, like a timeline)
export function formatLog(extra: string): string {
    return [extra, "", ...entries.map(formatEntry)].join("\n");
}

// Room switch changed (from useRoom). Returns true when logging turned on or off, so
// useRoom can restart its listener with (or without) the debug metadata.
const flagListeners = new Set<() => void>();
export function setRoomDebugFlag(on: boolean): boolean {
    if (on === roomDebug) return false;
    const before = isLogging();
    roomDebug = on;
    if (isLogging()) attachBrowserEvents();
    for (const l of flagListeners) l();
    return before !== isLogging();
}

export function subscribeDebugFlag(cb: () => void): () => void {
    flagListeners.add(cb);
    return () => flagListeners.delete(cb);
}

export const isRoomDebug = () => roomDebug;

// Browser events that matter for a live connection; attached once, the first time debug is on
let attached = false;
function attachBrowserEvents() {
    if (attached || typeof document === "undefined") return;
    attached = true;
    document.addEventListener("visibilitychange", () => logEvent("page", `visibility=${document.visibilityState}`));
    addEventListener("online", () => logEvent("net", "online"));
    addEventListener("offline", () => logEvent("net", "offline"));
    addEventListener("focus", () => logEvent("page", "focus"));
    addEventListener("pageshow", (e) => logEvent("page", `pageshow persisted=${(e as PageTransitionEvent).persisted}`));
    logEvent("debug", `debug mode on · ${navigator.userAgent}`);
}
if (localDebug) attachBrowserEvents();
