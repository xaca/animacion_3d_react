import { useEffect } from "react";
import { fetchRoom } from "./roomService";

// While `active`, wait `afterMs`, then read the room straight from the server every
// `everyMs` (the result reaches useRoom like any other copy). For moments when a device
// is clearly waiting too long for the live push. Read-only; stops as soon as `active`
// turns false or the component unmounts. A failed read is ignored (next try in everyMs).
export function useServerCheck(code: string, active: boolean, afterMs: number, everyMs: number) {
    useEffect(() => {
        if (!active) return;
        let interval: ReturnType<typeof setInterval> | undefined;
        const check = () => {
            fetchRoom(code).catch(() => {});
        };
        const start = setTimeout(() => {
            check();
            interval = setInterval(check, everyMs);
        }, afterMs);
        return () => {
            clearTimeout(start);
            if (interval) clearInterval(interval);
        };
    }, [code, active, afterMs, everyMs]);
}
