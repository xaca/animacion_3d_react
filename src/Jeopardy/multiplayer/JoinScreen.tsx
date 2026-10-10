import { useState, type FormEvent } from "react";
import { joinRoom } from "./roomService";
import { input, linkButton, primaryButton, Screen } from "./ui";

type Props = {
    onJoined: (code: string, playerId: string) => void;
    onBack: () => void;
};

export default function JoinScreen({ onJoined, onBack }: Props) {
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setBusy(true);
        setError("");
        try {
            const roomCode = code.trim().toUpperCase();
            const player = await joinRoom(roomCode, name.trim());
            onJoined(roomCode, player.id);
        } catch {
            setError("Room not found. Check the code on the big screen.");
            setBusy(false);
        }
    }

    return (
        <Screen>
            <h1 className="text-4xl font-bold">Join a game</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm text-black">
                <input
                    className={`${input} uppercase tracking-widest text-center`}
                    placeholder="ROOM CODE"
                    maxLength={4}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    autoFocus
                />
                <input
                    className={input}
                    placeholder="Your name"
                    maxLength={20}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button
                    type="submit"
                    className={primaryButton}
                    disabled={busy || code.trim().length !== 4 || !name.trim()}
                >
                    Join
                </button>
            </form>
            {error && <p className="text-yellow-300 font-bold">{error}</p>}
            <button className={linkButton} onClick={onBack}>
                Back
            </button>
        </Screen>
    );
}
