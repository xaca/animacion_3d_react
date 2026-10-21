import { useEffect, useState } from "react";
import { clearLog, formatEntry, getLog, logEvent, requestReconnect, status, subscribeLog } from "./debug";
import { clearDebugReports, subscribeDebugReports, type ReceivedReport } from "./debugReports";
import { APP_VERSION, describeRoom, fetchRoom, setRoomDebug, type TingoRoom } from "./roomService";
import Tabs from "./Tabs";

// Teacher's debug console (lazy chunk, mounted only while room.debug is on). Shows what
// every phone sees next to what the room really is, plus the host's own log. Read-only
// for the game: its only writes are the debug switch and clearing the reports.

type Level = "red" | "yellow" | "green" | "none";
const LEVEL_ICON: Record<Level, string> = { red: "🔴", yellow: "🟡", green: "🟢", none: "⚪" };
const ORDER: Record<Level, number> = { red: 0, yellow: 1, none: 2, green: 3 };
const SILENT_MS = 12000; // two missed heartbeats
const BEHIND_MS = 3000;

type Row = {
    id: string;
    name: string;
    level: Level;
    reason: string;
    entry: ReceivedReport | null;
};

const ago = (ms: number) => `${Math.max(0, Math.round(ms / 1000))} s ago`;

export default function DebugConsole({ room }: { room: TingoRoom }) {
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState<"players" | "host">("players");
    const [reports, setReports] = useState<ReceivedReport[]>([]);
    const [now, setNow] = useState(() => Date.now()); // also what re-renders the console
    const [expanded, setExpanded] = useState<string | null>(null);
    const [note, setNote] = useState("");
    const [busy, setBusy] = useState(false);
    const [copyText, setCopyText] = useState<string | null>(null);

    useEffect(() => subscribeDebugReports(room.code, setReports), [room.code]);

    // Ticks once a second (ages); new host log lines re-render at most twice a second
    useEffect(() => {
        let pending = false;
        const unsub = subscribeLog(() => {
            if (pending) return;
            pending = true;
            setTimeout(() => {
                pending = false;
                setNow(Date.now());
            }, 500);
        });
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => {
            unsub();
            clearInterval(id);
        };
    }, []);

    const truth = describeRoom(room);
    const hostStill = status.lastUpdateAt !== null && now - status.lastUpdateAt > BEHIND_MS;
    const byId = new Map(reports.map((r) => [r.report.playerId, r]));
    const phones = Object.values(room.players).filter((p) => !p.bot);

    const rows: Row[] = phones.map((p) => {
        const entry = byId.get(p.id) ?? null;
        if (!entry) return { id: p.id, name: p.name, level: "none", reason: "no report yet (old app version or not connected)", entry };
        const r = entry.report;
        const heard = now - entry.receivedAt;
        const behind = r.summary !== truth && hostStill;
        let level: Level = "green";
        let reason = "up to date";
        if (heard > SILENT_MS) [level, reason] = ["red", `silent: last heard ${ago(heard)}`];
        else if (r.error) [level, reason] = ["red", `listener error: ${r.error}`];
        else if (behind) [level, reason] = ["yellow", "⚠ behind: sees something different from the room"];
        else if (r.fromCache) [level, reason] = ["yellow", "running from cache (offline?)"];
        return { id: p.id, name: p.name, level, reason, entry };
    });
    rows.sort((a, b) => ORDER[a.level] - ORDER[b.level] || a.name.localeCompare(b.name));
    const trouble = rows.filter((r) => r.level === "red" || r.level === "yellow").length;

    function rowText(row: Row): string {
        const e = row.entry;
        if (!e) return `${LEVEL_ICON[row.level]} ${row.name}: ${row.reason}`;
        const r = e.report;
        return [
            `${LEVEL_ICON[row.level]} ${row.name} · ${row.reason}`,
            `   sees: ${r.summary ?? "-"}`,
            `   heard ${ago(now - e.receivedAt)} · its last update ${r.lastUpdateAt ? ago(r.sentAt - r.lastUpdateAt) : "never"} before sending · cache=${r.fromCache} · v${r.version} · clock ${r.clockOffsetMs === null ? "?" : `${(r.clockOffsetMs / 1000).toFixed(1)} s`}`,
            ...r.log.map((l) => `   ${l}`),
        ].join("\n");
    }

    async function copy() {
        const text = [
            `TingoTango debug · room ${room.code} · host v${APP_VERSION} · ${new Date(now).toLocaleString()}`,
            `room (host view): ${truth} · host last update ${status.lastUpdateAt ? ago(now - status.lastUpdateAt) : "never"} · cache=${status.fromCache}`,
            "",
            "== Phones ==",
            ...rows.map(rowText),
            "",
            "== Host log ==",
            ...getLog().map(formatEntry),
        ].join("\n");
        try {
            await navigator.clipboard.writeText(text);
            setNote("Copied ✓ — paste it in the chat");
        } catch {
            setCopyText(text);
        }
    }

    async function action(label: string, run: () => Promise<string>) {
        if (busy) return;
        setBusy(true);
        try {
            setNote(await run());
        } catch (e) {
            setNote(`${label} failed: ${e}`);
        } finally {
            setBusy(false);
        }
    }

    const checkServer = () =>
        action("Check server", async () => {
            const server = describeRoom(await fetchRoom(room.code));
            const text = `server: ${server} · host sees: ${truth} → ${server === truth ? "same ✓" : "DIFFERENT ✗"}`;
            logEvent("check", text);
            return text;
        });
    const clearReports = () =>
        action("Clear", async () => {
            await clearDebugReports(room.code);
            clearLog();
            return "Reports and host log cleared";
        });
    const turnOff = () =>
        action("Turn off", async () => {
            await setRoomDebug(room.code, false);
            return "Debug off";
        });

    const button = "px-2 py-1 rounded bg-white/15 hover:bg-white/25 cursor-pointer disabled:opacity-50";
    return (
        <>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="fixed bottom-3 left-3 z-[55] flex items-center gap-2 rounded-full bg-yellow-300 text-black font-bold px-4 py-2 shadow-xl cursor-pointer"
            >
                🐞 DEBUG · console
                {trouble > 0 && <span className="rounded-full bg-red-600 text-white text-sm px-2">{trouble}</span>}
            </button>

            {open && (
                <aside className="fixed z-[55] right-0 top-0 h-dvh w-full sm:w-[480px] flex flex-col bg-black/90 text-white text-left text-sm shadow-2xl">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-white/20">
                        <b>🐞 Debug console · room {room.code}</b>
                        <button type="button" className={button} onClick={() => setOpen(false)}>
                            ✕ Close
                        </button>
                    </div>
                    <div className="px-3 py-2 border-b border-white/20 font-mono text-xs space-y-0.5">
                        <p>room: {truth}</p>
                        <p>
                            host: v{APP_VERSION} · last update {status.lastUpdateAt ? ago(now - status.lastUpdateAt) : "never"} ·{" "}
                            {status.error ? `🔴 ${status.error}` : status.fromCache ? "🟡 from cache" : "🟢 live"}
                        </p>
                        <p className="opacity-70">Phones report every 5 s while debug is on (about 1 write per phone each time). Turn it off after testing.</p>
                    </div>
                    <div className="flex flex-wrap gap-2 px-3 py-2 border-b border-white/20">
                        <button type="button" className={button} onClick={copy}>
                            📋 Copy everything
                        </button>
                        <button type="button" className={button} disabled={busy} onClick={checkServer}>
                            🔄 Check server
                        </button>
                        <button type="button" className={button} onClick={() => setNote(requestReconnect() ? "Host listener restarted" : "No listener to restart")}>
                            🔌 Reconnect host
                        </button>
                        <button type="button" className={button} disabled={busy} onClick={clearReports}>
                            🧹 Clear
                        </button>
                        <button type="button" className={`${button} bg-red-700/70 hover:bg-red-700`} disabled={busy} onClick={turnOff}>
                            Turn debug off
                        </button>
                    </div>
                    {note && <p className="px-3 py-1 text-yellow-300 break-words border-b border-white/20 font-mono text-xs">{note}</p>}
                    {copyText !== null && (
                        <div className="px-3 py-2 border-b border-white/20">
                            <p className="mb-1">Copy didn't work here: select all and copy by hand.</p>
                            <textarea readOnly value={copyText} className="w-full h-32 bg-white text-black p-1 font-mono text-xs" onFocus={(e) => e.currentTarget.select()} />
                            <button type="button" className={`${button} mt-1`} onClick={() => setCopyText(null)}>
                                Done
                            </button>
                        </div>
                    )}
                    <div className="px-3 py-2">
                        <Tabs
                            label="Debug console"
                            items={[
                                { value: "players" as const, label: `📱 Phones (${rows.length})` },
                                { value: "host" as const, label: "🖥️ Host log" },
                            ]}
                            value={tab}
                            onChange={setTab}
                        />
                    </div>
                    <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-3">
                        {tab === "players" ? (
                            rows.length === 0 ? (
                                <p className="opacity-70">No players in the room yet.</p>
                            ) : (
                                <ul className="space-y-1">
                                    {rows.map((row) => (
                                        <li key={row.id} className="rounded bg-white/5">
                                            <button
                                                type="button"
                                                onClick={() => setExpanded((x) => (x === row.id ? null : row.id))}
                                                className="w-full text-left px-2 py-1.5 cursor-pointer hover:bg-white/10 rounded"
                                            >
                                                <p>
                                                    {LEVEL_ICON[row.level]} <b>{row.name}</b>
                                                </p>
                                                <p className={`text-xs ${row.level === "red" ? "text-red-300" : row.level === "yellow" ? "text-yellow-300" : "opacity-70"}`}>
                                                    {row.reason}
                                                    {row.entry && ` · heard ${ago(now - row.entry.receivedAt)}`}
                                                </p>
                                                {row.entry && <p className="text-xs font-mono opacity-80 break-words">sees: {row.entry.report.summary ?? "-"}</p>}
                                            </button>
                                            {expanded === row.id && row.entry && (
                                                <pre className="px-2 pb-2 text-[11px] whitespace-pre-wrap break-words opacity-90">{rowText(row)}</pre>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )
                        ) : (
                            <ol className="font-mono text-xs space-y-0.5">
                                {[...getLog()].reverse().map((e, i) => (
                                    <li key={`${e.at}-${i}`} className={`break-words ${e.kind === "error" ? "text-red-400" : e.kind === "update" ? "text-green-300" : ""}`}>
                                        {formatEntry(e)}
                                    </li>
                                ))}
                            </ol>
                        )}
                    </div>
                </aside>
            )}
        </>
    );
}
