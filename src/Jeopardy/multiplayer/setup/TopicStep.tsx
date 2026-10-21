import type { MouseEvent } from "react";
import { GROUPS, type TopicInfo } from "../../topics";
import { setTopic, type Room } from "../roomService";
import { linkButton } from "../ui";
import { pulse } from "./anim";

type Props = {
    room: Room;
    group: string;
    topics: TopicInfo[]; // built-in + uploaded (custom) topics, merged by HostSetup
    onChangeGroup: () => void;
};

// Step 2: the topics of the chosen group (same cards as before the redesign)
export default function TopicStep({ room, group, topics, onChangeGroup }: Props) {
    const groupName = GROUPS.find((g) => g.id === group)?.name ?? group;

    function pick(e: MouseEvent<HTMLButtonElement>, id: string, name: string) {
        pulse(e.currentTarget);
        if (id !== room.topic) setTopic(room.code, id, name);
    }

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <p className="su-item text-xl">
                Category: <b>{groupName}</b> ·{" "}
                <button type="button" className={linkButton} onClick={onChangeGroup}>
                    change
                </button>
            </p>
            <div className="flex flex-wrap justify-center gap-3 max-w-5xl">
                {topics.filter((t) => t.group === group).map((topic) => (
                    <button
                        key={topic.id}
                        type="button"
                        onClick={(e) => pick(e, topic.id, topic.name)}
                        aria-pressed={room.topic === topic.id}
                        className={`su-item relative w-52 p-4 rounded-xl text-left cursor-pointer border-4 ${
                            room.topic === topic.id
                                ? "bg-yellow-300 text-black border-black"
                                : "bg-white text-[#2a3698] border-transparent hover:border-yellow-300"
                        }`}
                    >
                        {topic.isNew && (
                            <span className="absolute -top-2.5 -right-2 bg-[#2a3698] text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
                                ✨ Nuevo
                            </span>
                        )}
                        <span className="block font-bold text-xl leading-tight">{topic.name}</span>
                        <span className="block text-sm opacity-80 mt-1">{topic.tagline}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
