import { useEffect, useRef, useState } from "react";

type Props = {
    endsAt: number; // epoch ms on this device's clock
    totalSeconds: number;
    // Text before the seconds, e.g. "Opciones en"
    label?: string;
    // Fires once when the countdown reaches zero (host: reveal the answer)
    onDone?: () => void;
};

// Seconds left + shrinking bar to an epoch deadline on THIS device's clock. Only the
// host uses absolute deadlines from the room (they come from its own clock).
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
    return <Bar seconds={seconds} fraction={fraction} label={label} />;
}

// Phones: runs `seconds` from the moment it mounts (when the update reached this phone),
// never comparing with another device's clock. Mount it with a key per question.
export function LocalCountdown({ seconds, label }: { seconds: number; label?: string }) {
    const [endsAt] = useState(() => Date.now() + seconds * 1000);
    return <Countdown endsAt={endsAt} totalSeconds={seconds} label={label} />;
}

function Bar({ seconds, fraction, label }: { seconds: number; fraction: number; label?: string }) {
    return (
        <div className="w-full max-w-4xl">
            <p className={`text-2xl font-bold mb-1 ${seconds <= 5 ? "text-red-400" : ""}`}>
                {label && `${label} `}
                {seconds} s
            </p>
            <div className="h-3 bg-black/40 rounded">
                <div className={`h-full rounded ${seconds <= 5 ? "bg-red-500" : "bg-yellow-300"}`} style={{ width: `${fraction * 100}%` }} />
            </div>
        </div>
    );
}
