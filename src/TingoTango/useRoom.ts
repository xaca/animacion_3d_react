import { useEffect, useRef, useState } from "react";
import { isLogging, logEvent, registerReconnect, setRoomDebugFlag, setStatus } from "./debug";
import { acceptCopy, APP_VERSION, describeRoom, fetchRoom, revOf, subscribeRoom, subscribeRoomUpdates, type TingoRoom, type RoomSource } from "./roomService";

// A room hosted by a newer build than this page: reload once so every device in
// the room runs the same code (an older bundle would skip newer game rules).
// Versions are build timestamps; "dev" (tests) never triggers a reload.
function reloadIfStale(room: TingoRoom): boolean {
    if (!(Number(room.version) > Number(APP_VERSION))) return false;
    const key = `tingo-reloaded:${room.version}`;
    try {
        if (sessionStorage.getItem(key)) return false; // already tried once; don't loop
        sessionStorage.setItem(key, "1");
    } catch {
        return false;
    }
    location.reload();
    return true;
}

// undefined = loading, null = room doesn't exist.
// Copies of the room come from three sources: the live push (onSnapshot), this tab's own
// confirmed writes, and direct server reads (fetchRoom). The push can be late, so the copy
// with the highest rev wins and an older one never rewinds the screen.
export function useRoom(code: string): TingoRoom | null | undefined {
    const [room, setRoom] = useState<TingoRoom | null | undefined>(undefined);
    const current = useRef<TingoRoom | null | undefined>(undefined);
    // Bumped by the debug panel's 🔌 Reconnect / the debug switch to restart the listener
    const [generation, setGeneration] = useState(0);
    useEffect(() => registerReconnect(() => setGeneration((g) => g + 1)), []);

    // When each rev first arrived and from where, to log how late the push was (debug only)
    const firstSeen = useRef(new Map<number, { source: RoomSource; at: number }>());

    useEffect(() => {
        current.current = undefined;
        firstSeen.current.clear();

        function offer(next: TingoRoom | null, source: RoomSource) {
            if (next && reloadIfStale(next)) return;
            const before = current.current;
            const rev = revOf(next);
            const accept = acceptCopy(before, next, source);
            if (isLogging() && next) {
                const seen = firstSeen.current.get(rev);
                if (!seen) {
                    firstSeen.current.set(rev, { source, at: Date.now() });
                    if (firstSeen.current.size > 50) firstSeen.current.delete(firstSeen.current.keys().next().value!);
                } else if (source === "push" && seen.source !== "push" && rev > 0) {
                    logEvent("late", `push late by ${((Date.now() - seen.at) / 1000).toFixed(1)} s (rev ${rev}, already had it from ${seen.source})`);
                }
            }
            if (!accept) return;
            current.current = next;
            if (isLogging()) {
                if (source !== "push") logEvent("update", `via ${source}: rev=${rev} ${describeRoom(next)}`);
                setStatus({ summary: describeRoom(next), lastUpdateAt: Date.now() });
            }
            // Teacher's debug switch: when logging turns on/off, restart the listener so it
            // adds (or drops) the debug metadata. Without the switch this is a no-op.
            if (setRoomDebugFlag(next?.debug === true)) setGeneration((g) => g + 1);
            setRoom(next);
        }

        const stopPush = subscribeRoom(code, (r) => offer(r, "push"));
        const stopLocal = subscribeRoomUpdates(code, offer);
        return () => {
            stopPush();
            stopLocal();
        };
    }, [code, generation]);

    // Coming back to the page (screen unlocked, network back): one direct read, in case
    // the push missed something meanwhile. A failed read changes nothing.
    useEffect(() => {
        const check = () => {
            if (document.visibilityState === "visible") fetchRoom(code).catch(() => {});
        };
        document.addEventListener("visibilitychange", check);
        addEventListener("online", check);
        return () => {
            document.removeEventListener("visibilitychange", check);
            removeEventListener("online", check);
        };
    }, [code]);

    // Leaving the room (or a different room) starts with the switch off
    useEffect(
        () => () => {
            setRoomDebugFlag(false);
        },
        [code]
    );
    return room;
}
