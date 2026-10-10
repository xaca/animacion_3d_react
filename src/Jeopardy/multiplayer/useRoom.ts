import { useEffect, useState } from "react";
import { subscribeRoom, type Room } from "./roomService";

// undefined = loading, null = room doesn't exist
export function useRoom(code: string): Room | null | undefined {
    const [room, setRoom] = useState<Room | null | undefined>(undefined);
    useEffect(() => subscribeRoom(code, setRoom), [code]);
    return room;
}
