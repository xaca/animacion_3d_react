import { useEffect, useState } from "react";
import { APP_VERSION, subscribeRoom, type Room } from "./roomService";

// A room hosted by a newer build than this page: reload once so every device in
// the room runs the same code (an older bundle would skip newer game rules).
// Versions are build timestamps; "dev" (tests) never triggers a reload.
function reloadIfStale(room: Room): boolean {
    if (!(Number(room.version) > Number(APP_VERSION))) return false;
    const key = `jeopardy-reloaded:${room.version}`;
    try {
        if (sessionStorage.getItem(key)) return false; // already tried once; don't loop
        sessionStorage.setItem(key, "1");
    } catch {
        return false;
    }
    location.reload();
    return true;
}

// undefined = loading, null = room doesn't exist
export function useRoom(code: string): Room | null | undefined {
    const [room, setRoom] = useState<Room | null | undefined>(undefined);
    useEffect(
        () =>
            subscribeRoom(code, (room) => {
                if (room && reloadIfStale(room)) return;
                setRoom(room);
            }),
        [code]
    );
    return room;
}
