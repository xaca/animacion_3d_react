import { collection, deleteDoc, doc, getDocs, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { formatEntry, getLog, status, subscribeLog } from "./debug";

// Teacher's debug console: while room.debug is on, each phone writes what it sees to
// rooms/{code}/debug/{playerId} (on every change, at most once a second, plus a 5 s
// heartbeat). A separate document per phone, so it never touches the room document
// or the game's transactions. Writes are fire-and-forget: a failure only logs a warning.

export type DebugReport = {
    playerId: string;
    name: string;
    team: string | null;
    version: string;
    summary: string | null; // what the phone sees, e.g. "status=question tile=2,0 options=no …"
    lastUpdateAt: number | null; // phone clock, when its last room update arrived
    fromCache: boolean | null;
    error: string | null;
    clockOffsetMs: number | null;
    sentAt: number; // phone clock
    log: string[]; // last lines of the phone's log, oldest first
};

// receivedAt: when the teacher's screen got this version (teacher's clock, so the
// "last heard" age never depends on the phone's clock)
export type ReceivedReport = { report: DebugReport; receivedAt: number };

const HEARTBEAT_MS = 5000;
const MIN_GAP_MS = 1000;
const LOG_LINES = 30;

const reports = (code: string) => collection(db, "rooms", code, "debug");

export function startReporting(code: string, playerId: string, who: () => { name: string; team: string | null }, version: string): () => void {
    const ref = doc(db, "rooms", code, "debug", playerId);
    const key = () => `${status.summary}|${status.fromCache}|${status.error}`;
    let lastKey = "";
    let lastSent = 0;
    let pending: ReturnType<typeof setTimeout> | null = null;
    let stopped = false;

    function send() {
        if (stopped) return;
        try {
            const { name, team } = who();
            const report: DebugReport = {
                playerId,
                name,
                team,
                version,
                summary: status.summary,
                lastUpdateAt: status.lastUpdateAt,
                fromCache: status.fromCache,
                error: status.error,
                clockOffsetMs: status.clockOffsetMs,
                sentAt: Date.now(),
                log: getLog().slice(-LOG_LINES).map(formatEntry),
            };
            lastKey = key();
            lastSent = Date.now();
            setDoc(ref, report).catch((e) => console.warn("Debug report not sent", e));
        } catch (e) {
            console.warn("Debug report failed", e);
        }
    }

    // A change in what the phone sees is sent right away (but not more than once a second)
    const unsub = subscribeLog(() => {
        if (stopped || pending || key() === lastKey) return;
        pending = setTimeout(
            () => {
                pending = null;
                send();
            },
            Math.max(0, MIN_GAP_MS - (Date.now() - lastSent))
        );
    });
    const heartbeat = setInterval(send, HEARTBEAT_MS);
    send();

    return () => {
        stopped = true;
        unsub();
        clearInterval(heartbeat);
        if (pending) clearTimeout(pending);
    };
}

export function subscribeDebugReports(code: string, cb: (reports: ReceivedReport[]) => void): () => void {
    const seen = new Map<string, ReceivedReport>();
    return onSnapshot(
        reports(code),
        (snap) => {
            const now = Date.now();
            for (const change of snap.docChanges()) {
                if (change.type === "removed") seen.delete(change.doc.id);
                else seen.set(change.doc.id, { report: change.doc.data() as DebugReport, receivedAt: now });
            }
            cb([...seen.values()]);
        },
        (e) => console.warn("Could not read debug reports", e)
    );
}

// Best effort: reports are only test data
export async function clearDebugReports(code: string) {
    const snap = await getDocs(reports(code));
    await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
}
