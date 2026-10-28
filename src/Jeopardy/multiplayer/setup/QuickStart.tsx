import { useLayoutEffect, useRef } from "react";
import { TOPICS } from "../../topics";
import { EXTRA_INFO, EXTRA_KEYS } from "../roomService";
import type { LastSetup } from "../setupPrefs";
import { ring } from "./anim";

type Props = {
    last: LastSetup;
    keepTeams: boolean; // players are waiting: their teams aren't touched
    busy: boolean;
    onOpenNow: () => void;
    onNewTopic: () => void;
};

// "⚡ Same as last time" shortcut: one click to reuse the previous setup on this device
export default function QuickStart({ last, keepTeams, busy, onOpenNow, onNewTopic }: Props) {
    const topic = last.topicName ?? TOPICS.find((t) => t.id === last.topic)?.name;
    const extras = EXTRA_KEYS.filter((k) => last.extras?.[k] === true).map((k) => EXTRA_INFO[k].icon);
    const bolt = useRef<HTMLSpanElement>(null);

    // Soft ring around the ⚡ to draw the eye (repeats a few times, then rests)
    useLayoutEffect(() => {
        const tween = ring(bolt.current, 2);
        return () => {
            tween.kill();
        };
    }, []);

    const button = "font-bold text-xl px-4 py-2 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
    return (
        <div className="su-item w-full max-w-5xl rounded-xl bg-white/10 border-2 border-yellow-300/60 p-4 flex flex-wrap items-center gap-4 text-left">
            <span className="relative w-14 h-14 shrink-0 grid place-items-center rounded-full bg-yellow-300 text-3xl">
                <span ref={bolt} aria-hidden className="absolute inset-0 rounded-full border-4 border-yellow-300 opacity-0" />⚡
            </span>
            <div className="flex-1 min-w-64">
                <p className="text-xl font-bold">Same as last time</p>
                <p className="opacity-90">
                    {topic && <b>{topic}</b>}
                    {topic && " · "}
                    read {last.readSeconds} s · answer {last.timerSeconds} s ·{" "}
                    {keepTeams ? "teams kept" : `${last.students} students → ${last.teamCount} teams of up to ${last.maxTeamSize}`}
                    {extras.length > 0 && ` · ${extras.join(" ")}`}
                </p>
            </div>
            <div className="flex flex-wrap gap-2">
                {topic && (
                    <button type="button" disabled={busy} onClick={onOpenNow} className={`${button} bg-yellow-300 text-black hover:bg-white`}>
                        Open room now →
                    </button>
                )}
                <button type="button" disabled={busy} onClick={onNewTopic} className={`${button} bg-white text-[#2a3698] hover:bg-yellow-300`}>
                    Same settings, new topic
                </button>
            </div>
        </div>
    );
}
