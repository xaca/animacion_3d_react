import { useEffect, useRef } from "react";
import { activeTileOf, answer, type Room } from "./roomService";

// Test players: the host screen answers for every bot when the options appear, with a
// random choice (about half correct) at a random moment of the answer time. They go
// through the normal answer(), so they follow exactly the same rules as phones.
// Use inside a component keyed per question, so the timers reset each question.
export function useBots(room: Room) {
    const latest = useRef(room);
    useEffect(() => {
        latest.current = room;
    }, [room]);

    const optionsShown = room.optionsAt !== null;
    const code = room.code;

    useEffect(() => {
        if (!optionsShown) return;
        const current = latest.current;
        const tile = activeTileOf(current);
        if (!tile || current.revealed) return;
        const bots = Object.values(current.players).filter((p) => p.bot && p.team !== null);
        const windowMs = current.timerSeconds * 1000 * 0.8;
        const timers = bots.map((bot) => {
            const wrong = tile.options.filter((o) => o !== tile.answer);
            const choice = Math.random() < 0.5 ? tile.answer : wrong[Math.floor(Math.random() * wrong.length)];
            return setTimeout(() => answer(code, bot.id, choice), 1000 + Math.random() * windowMs);
        });
        return () => timers.forEach(clearTimeout);
    }, [optionsShown, code]);
}
