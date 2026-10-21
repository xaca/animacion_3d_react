import { useEffect, useRef } from "react";
import { answer, selectedPlayer, type TingoRoom } from "./roomService";

// Test players: when the ball picks a bot, the host screen answers for it with a random
// choice (about half correct) at a random moment of the answer time. It goes through the
// normal answer(), so it follows exactly the same rules as a phone.
// Use inside a component keyed per round, so the timer resets each question.
export function useBots(room: TingoRoom) {
    const latest = useRef(room);
    useEffect(() => {
        latest.current = room;
    }, [room]);

    const optionsShown = room.optionsAt !== null;
    const code = room.code;

    useEffect(() => {
        if (!optionsShown) return;
        const current = latest.current;
        const bot = selectedPlayer(current);
        if (!bot?.bot || current.revealed || current.choice !== null || !current.question) return;
        const q = current.question;
        const wrong = q.options.filter((o) => o !== q.answer);
        const choice = Math.random() < 0.5 ? q.answer : wrong[Math.floor(Math.random() * wrong.length)];
        const timer = setTimeout(() => answer(code, bot.id, choice), 1000 + Math.random() * current.answerSeconds * 1000 * 0.8);
        return () => clearTimeout(timer);
    }, [optionsShown, code]);
}
