import Tabs from "../Tabs";
import { EXTRA_INFO, extrasOf, setExtra, type ExtraKey, type Room } from "../roomService";

// What each mode does, in the teacher's words (the icon + name live in EXTRA_INFO)
const HINTS: Record<ExtraKey, string> = {
    speedBonus: "The first team to answer correctly earns +50% of the question's value.",
    streak: "3 correct in a row puts a team on fire: its correct answers are worth double until it misses.",
    penalty: "A wrong answer costs half the question's value (never below 0). Not answering is free.",
    comeback: "Teams in the bottom half earn +25% on their correct answers; the team in last place earns +50%.",
    powerUps:
        "Each team gets one-shot powers on their phones — 🎯 50/50, ✖2 double, 🛡️ shield, 🏴‍☠️ steal and 🧊 freeze (both aimed at a team ahead of yours) — used during the reading time. Used powers recharge faster for teams behind (last 2 · middle 3 · leader 5 questions), and a team far behind gets 🆘 all its powers back once.",
    leaderTax: "The leading team keeps 80% of what it wins, so the others can close the gap.",
};

const ITEMS = [
    { value: 0, label: "Off" },
    { value: 1, label: "On" },
];

// Step 4: optional game modes. Everything off = the classic game, untouched.
export default function ExtrasStep({ room }: { room: Room }) {
    const extras = extrasOf(room);
    return (
        <div className="flex flex-col gap-4 w-full max-w-3xl">
            <p className="su-item opacity-80">All optional — with everything off the game plays exactly as always.</p>
            {(Object.keys(HINTS) as ExtraKey[]).map((key) => {
                const { icon, name } = EXTRA_INFO[key];
                const title = `${icon} ${name}`;
                return (
                    <div key={key} className="su-item flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white/5 p-4 text-left">
                        <div className="min-w-0 flex-1 basis-64">
                            <p className="text-2xl font-bold">{title}</p>
                            <p className="opacity-80">{HINTS[key]}</p>
                            {key === "powerUps" && extras.powerUps === true && room.readSeconds === 0 && (
                                <p className="text-yellow-300 font-bold">⚠ Power-ups are used during the reading time — pick a reading time in Game.</p>
                            )}
                        </div>
                        <Tabs label={title} items={ITEMS} value={extras[key] ? 1 : 0} onChange={(v) => (v === 1) !== (extras[key] === true) && setExtra(room.code, key, v === 1)} />
                    </div>
                );
            })}
        </div>
    );
}
