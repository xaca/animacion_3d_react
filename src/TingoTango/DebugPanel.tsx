import { useEffect, useState } from "react";
import { clearLog, formatEntry, formatLog, getLog, logEvent, requestReconnect, status, subscribeLog } from "./debug";
import { APP_VERSION, describeRoom, fetchRoom } from "./roomService";

// 🐞 button + debug window. Loaded lazily and rendered only in debug mode (?debug=1),
// so normal players never download or run it. Read-only: never writes to Firestore.
export default function DebugPanel() {
    const [open, setOpen] = useState(false);
    const [now, setNow] = useState(() => Date.now()); // also what re-renders the panel
    const [copyText, setCopyText] = useState<string | null>(null);
    const [checking, setChecking] = useState(false);
    const [note, setNote] = useState("");

    // Re-render on new log lines (at most twice a second) and once a second for the "ago" times
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

    const role = location.pathname.includes("/host") ? "host" : location.pathname.includes("/play") ? "player" : "-";
    const playerId = (() => {
        try {
            return status.code ? sessionStorage.getItem(`tingo-player:${status.code}`) : null;
        } catch {
            return null;
        }
    })();
    const ago = status.lastUpdateAt === null ? null : Math.round((now - status.lastUpdateAt) / 1000);
    const inQuestion = status.summary?.startsWith("status=tango") ?? false;
    const warn = status.error !== null || status.fromCache === true || (inQuestion && ago !== null && ago > 15);
    const connection = status.error ? "🔴 error" : status.fromCache ? "🟡 from cache (offline?)" : status.fromCache === false ? "🟢 live" : "…";

    const statusLines = [
        `version ${APP_VERSION} · ${role}${playerId ? ` ${playerId}` : ""} · room ${status.code ?? "-"} · ${location.pathname}${location.search}`,
        `connection ${connection}${status.error ? ` (${status.error})` : ""}`,
        `last update ${ago === null ? "never" : `${ago} s ago`}`,
        `this device sees: ${status.summary ?? "-"}`,
        `clock: host − this device ≈ ${status.clockOffsetMs === null ? "?" : `${(status.clockOffsetMs / 1000).toFixed(1)} s`} (incl. network delay)`,
    ];

    async function checkServer() {
        if (!status.code || checking) return;
        setChecking(true);
        try {
            const server = describeRoom(await fetchRoom(status.code));
            const same = server === status.summary;
            const text = `server: ${server} · this device: ${status.summary ?? "-"} → ${same ? "same ✓" : "DIFFERENT ✗"}`;
            logEvent("check", text);
            setNote(text);
        } catch (e) {
            logEvent("check", `server read failed: ${e}`);
            setNote(`Server read failed: ${e}`);
        } finally {
            setChecking(false);
        }
    }

    async function copy() {
        const text = formatLog([...statusLines, `ua ${navigator.userAgent}`].join("\n"));
        try {
            await navigator.clipboard.writeText(text);
            setNote("Log copied ✓ — paste it in the chat");
        } catch {
            setCopyText(text); // no clipboard: show it to select by hand
        }
    }

    const button = "px-2 py-1 rounded bg-white/15 hover:bg-white/25 cursor-pointer disabled:opacity-50";
    return (
        <>
            <button
                type="button"
                aria-label="Debug"
                onClick={() => setOpen((o) => !o)}
                className="fixed bottom-3 right-3 z-[60] w-12 h-12 rounded-full bg-black/80 text-2xl shadow-xl cursor-pointer"
            >
                🐞
                {warn && <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-black" />}
            </button>

            {open && (
                <div className="fixed z-[60] inset-x-0 bottom-0 max-h-[70dvh] md:inset-x-auto md:right-0 md:top-0 md:max-h-none md:w-[440px] flex flex-col bg-black/90 text-white text-left font-mono text-xs shadow-2xl">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-white/20">
                        <b className="text-sm">🐞 Debug</b>
                        <button type="button" className={button} onClick={() => setOpen(false)}>
                            ✕ Close
                        </button>
                    </div>
                    <div className="px-3 py-2 space-y-0.5 border-b border-white/20">
                        {statusLines.map((l) => (
                            <p key={l.slice(0, 12)} className="break-words">
                                {l}
                            </p>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-2 px-3 py-2 border-b border-white/20">
                        <button type="button" className={button} onClick={copy}>
                            📋 Copy log
                        </button>
                        <button type="button" className={button} disabled={!status.code || checking} onClick={checkServer}>
                            {checking ? "Checking…" : "🔄 Check server now"}
                        </button>
                        <button type="button" className={button} onClick={() => setNote(requestReconnect() ? "Listener restarted" : "No room listener to restart")}>
                            🔌 Reconnect
                        </button>
                        <button type="button" className={button} onClick={clearLog}>
                            🧹 Clear
                        </button>
                    </div>
                    {note && <p className="px-3 py-1 text-yellow-300 break-words border-b border-white/20">{note}</p>}
                    {copyText !== null && (
                        <div className="px-3 py-2 border-b border-white/20">
                            <p className="mb-1">Copy didn't work here: select all and copy by hand.</p>
                            <textarea readOnly value={copyText} className="w-full h-32 bg-white text-black p-1" onFocus={(e) => e.currentTarget.select()} />
                            <button type="button" className={`${button} mt-1`} onClick={() => setCopyText(null)}>
                                Done
                            </button>
                        </div>
                    )}
                    <ol className="flex-1 min-h-0 overflow-y-auto px-3 py-2 space-y-0.5">
                        {[...getLog()].reverse().map((e, i) => (
                            <li key={`${e.at}-${i}`} className={`break-words ${e.kind === "error" ? "text-red-400" : e.kind === "update" ? "text-green-300" : ""}`}>
                                {formatEntry(e)}
                            </li>
                        ))}
                    </ol>
                </div>
            )}
        </>
    );
}
