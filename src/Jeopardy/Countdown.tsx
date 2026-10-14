import { useEffect, useRef, useState } from "react";

type Props = {
    endsAt: number; // epoch ms (room.questionEndsAt)
    totalSeconds: number;
    // Text before the seconds, e.g. "Options in"
    label?: string;
    // Fires once when the countdown reaches zero (host: reveal the answer)
    onDone?: () => void;
};

// Seconds left + shrinking bar. Each device uses its own clock; phones are
// usually within a second of each other, which is fine for a classroom.
export default function Countdown({ endsAt, totalSeconds, label, onDone }: Props) {
    const [now, setNow] = useState(() => Date.now());
    const done = now >= endsAt;

    useEffect(() => {
        if (done) return;
        const id = setInterval(() => setNow(Date.now()), 100);
        return () => clearInterval(id);
    }, [endsAt, done]);

    // Ref so the effect fires onDone exactly once per countdown
    const onDoneRef = useRef(onDone);
    useEffect(() => {
        onDoneRef.current = onDone;
    }, [onDone]);
    useEffect(() => {
        if (done) onDoneRef.current?.();
    }, [done, endsAt]);

    const leftMs = Math.max(0, endsAt - now);
    const seconds = Math.ceil(leftMs / 1000);
    const fraction = Math.min(1, leftMs / (totalSeconds * 1000));

    return (
        <div className="w-full max-w-4xl">
            <p className={`text-2xl font-bold mb-1 ${seconds <= 5 ? "text-red-400" : ""}`}>
                {label && `${label} `}
                {seconds} s
            </p>
            <div className="h-3 bg-black/40">
                <div
                    className={`h-full ${seconds <= 5 ? "bg-red-500" : "bg-yellow-300"}`}
                    style={{ width: `${fraction * 100}%` }}
                />
            </div>
        </div>
    );
}
