import Tabs from "../Tabs";
import {
    BOARD_SIZE_CHOICES,
    boardSizeOf,
    GAME_MINUTES_CHOICES,
    gameMinutesOf,
    READ_SECONDS_CHOICES,
    setBoardSize,
    setGameMinutes,
    setReadSeconds,
    setStartSeconds,
    setTimerSeconds,
    START_SECONDS_CHOICES,
    TIMER_CHOICES,
    type Room,
} from "../roomService";

const seconds = (choices: number[]) => choices.map((n) => ({ value: n, label: `${n} s` }));

// Step 3: the three clocks of a game plus its length (board size and optional time
// limit), each a segmented control with a one-line hint
export default function GameStep({ room }: { room: Room }) {
    const size = boardSizeOf(room);
    const minutes = gameMinutesOf(room);
    const questions = size * size;
    // Rough duration: reading + answering + ~12 s of picking tiles and celebrating per question
    const estimate = Math.max(1, Math.round((questions * (room.readSeconds + room.timerSeconds + 12)) / 60));

    const rows = [
        {
            title: "🧩 Board size",
            hint: `${size}×${size} = ${questions} questions, roughly ${estimate} min of play.`,
            items: BOARD_SIZE_CHOICES.map((n) => ({ value: n, label: `${n}×${n}` })),
            value: size,
            set: (n: number) => setBoardSize(room.code, n),
        },
        {
            title: "⏳ Time limit",
            hint:
                minutes > 0
                    ? `The game ends at ${minutes} min with the scores as they are${estimate > minutes ? ` (a full board takes ~${estimate} min, so it will probably cut it)` : ""}.`
                    : "No limit: the game ends when the board is empty.",
            items: GAME_MINUTES_CHOICES.map((n) => ({ value: n, label: n === 0 ? "None" : `${n} min` })),
            value: minutes,
            set: (n: number) => setGameMinutes(room.code, n),
        },
        {
            title: "📖 Reading time",
            hint: "The question is shown alone first, so everyone can read it.",
            items: seconds(READ_SECONDS_CHOICES),
            value: room.readSeconds,
            set: (n: number) => setReadSeconds(room.code, n),
        },
        {
            title: "⏱️ Answer time",
            hint: "Starts when the options appear on the phones.",
            items: seconds(TIMER_CHOICES),
            value: room.timerSeconds,
            set: (n: number) => setTimerSeconds(room.code, n),
        },
        {
            title: "🚦 Start countdown",
            hint: "Last call to pick a team after you press Start; empty teams are left out.",
            items: seconds(START_SECONDS_CHOICES),
            value: room.startSeconds,
            set: (n: number) => setStartSeconds(room.code, n),
        },
    ];

    return (
        <div className="flex flex-col gap-4 w-full max-w-3xl">
            {rows.map((row) => (
                <div key={row.title} className="su-item flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white/5 p-4 text-left">
                    <div>
                        <p className="text-2xl font-bold">{row.title}</p>
                        <p className="opacity-80">{row.hint}</p>
                    </div>
                    <Tabs label={row.title} items={row.items} value={row.value} onChange={(n) => n !== row.value && row.set(n)} />
                </div>
            ))}
        </div>
    );
}
