import Tabs from "../Tabs";
import {
    READ_SECONDS_CHOICES,
    setReadSeconds,
    setStartSeconds,
    setTimerSeconds,
    START_SECONDS_CHOICES,
    TIMER_CHOICES,
    type Room,
} from "../roomService";

const seconds = (choices: number[]) => choices.map((n) => ({ value: n, label: `${n} s` }));

// Step 3: the three clocks of a game, each a segmented control with a one-line hint
export default function GameStep({ room }: { room: Room }) {
    const rows = [
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
