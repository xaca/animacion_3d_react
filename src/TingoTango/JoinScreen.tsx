import { useState, type FormEvent } from "react";
import HowToPlay from "./HowToPlay";
import { joinRoom, ROOM_NOT_OPEN } from "./roomService";
import { input, linkButton, primaryButton, Screen } from "./ui";

type Props = {
    initialCode?: string; // from the QR link (/join?code=ABCD); still editable as a fallback
    onJoined: (code: string, playerId: string) => void;
    onBack: () => void;
};

export default function JoinScreen({ initialCode = "", onJoined, onBack }: Props) {
    const [code, setCode] = useState(initialCode);
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
        } catch (err) {
            console.error("Could not join the room", err);
            setError(
                err instanceof Error && err.message === ROOM_NOT_OPEN
                    ? "El profe todavía está preparando el juego. Intenta en un momento."
                    : "Sala no encontrada. Revisa el código en la pantalla grande."
            );
            setBusy(false);
        }
    }

    return (
        <Screen>
            <h1 className="text-4xl font-bold">Unirme al juego</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm text-black">
                <input
                    className={`${input} uppercase tracking-widest text-center`}
                    placeholder="CÓDIGO"
                    maxLength={4}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    autoFocus={!initialCode}
                />
                <input
                    className={input}
                    placeholder="Tu nombre"
                    maxLength={20}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus={!!initialCode}
                />
                <button type="submit" className={primaryButton} disabled={busy || code.trim().length !== 4 || !name.trim()}>
                    Entrar
                </button>
            </form>
            {error && <p className="text-yellow-300 font-bold">{error}</p>}
            <HowToPlay />
            <button className={linkButton} onClick={onBack}>
                Volver
            </button>
        </Screen>
    );
}
