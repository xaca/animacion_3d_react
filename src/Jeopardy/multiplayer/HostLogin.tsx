import { useState, type FormEvent } from "react";
import { tryUnlockHost } from "./hostAuth";
import { input, linkButton, primaryButton, Screen } from "./ui";

type Props = {
    onUnlock: () => void;
    onBack: () => void;
};

export default function HostLogin({ onUnlock, onBack }: Props) {
    const [pin, setPin] = useState("");
    const [error, setError] = useState(false);
    const [busy, setBusy] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setBusy(true);
        setError(false);
        if (await tryUnlockHost(pin)) {
            onUnlock();
            return;
        }
        // Small delay so guessing by hand is tedious
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setError(true);
        setPin("");
        setBusy(false);
    }

    return (
        <Screen>
            <h1 className="text-4xl font-bold">Host login</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-xs text-black">
                <input
                    className={`${input} tracking-[0.5em] text-center`}
                    type="password"
                    inputMode="numeric"
                    placeholder="PIN"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    autoFocus
                />
                <button type="submit" className={primaryButton} disabled={busy || pin.length !== 4}>
                    Enter
                </button>
            </form>
            {error && <p className="text-yellow-300 font-bold">Wrong PIN.</p>}
            <button className={linkButton} onClick={onBack}>
                Back
            </button>
        </Screen>
    );
}
