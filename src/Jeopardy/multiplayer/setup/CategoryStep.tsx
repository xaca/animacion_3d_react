import type { MouseEvent } from "react";
import { GROUPS, TOPICS } from "../../topics";
import { pulse } from "./anim";

type Props = {
    group: string;
    topic: string;
    onPick: (group: string) => void;
};

// Step 1: the topic groups as big cards. Picking one moves on to its topics.
export default function CategoryStep({ group, topic, onPick }: Props) {
    const current = TOPICS.find((t) => t.id === topic)?.group;

    function pick(e: MouseEvent<HTMLButtonElement>, id: string) {
        pulse(e.currentTarget);
        onPick(id);
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 w-full max-w-5xl">
            {GROUPS.map((g) => {
                const [emoji, ...rest] = g.name.split(" ");
                const count = TOPICS.filter((t) => t.group === g.id).length;
                const selected = g.id === group;
                return (
                    <button
                        key={g.id}
                        type="button"
                        onClick={(e) => pick(e, g.id)}
                        className={`su-item relative p-4 rounded-xl text-left cursor-pointer border-4 ${
                            selected ? "bg-yellow-300 text-black border-black" : "bg-white text-[#2a3698] border-transparent hover:border-yellow-300"
                        }`}
                    >
                        <span className="block text-4xl">{emoji}</span>
                        <span className="block font-bold text-2xl leading-tight mt-1">{rest.join(" ")}</span>
                        <span className="block text-sm opacity-70">
                            {count} {count === 1 ? "topic" : "topics"}
                        </span>
                        {current === g.id && (
                            <span className="absolute top-2 right-2 text-xs font-bold bg-[#2a3698] text-white rounded-full px-2 py-0.5">current</span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
