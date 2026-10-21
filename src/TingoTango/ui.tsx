import type { ReactNode } from "react";

// TingoTango's own look: dark slate stage (the ball is the star), red accents for the
// bolita, yellow for highlights. Structure mirrors Jeopardy's ui.tsx.

export const primaryButton =
    "bg-white text-slate-900 text-2xl font-bold px-6 py-3 rounded-lg cursor-pointer hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white";

export const linkButton = "text-white underline opacity-80 hover:opacity-100 cursor-pointer";

export const input = "bg-white text-slate-900 text-2xl px-3 py-2 rounded-lg border border-slate-400 w-full";

// Dotted-paper background like the teacher's sketch
export const dotted = "[background-image:radial-gradient(rgba(255,255,255,0.08)_1.5px,transparent_1.5px)] [background-size:26px_26px]";

export function Screen({ children }: { children: ReactNode }) {
    return (
        <div className={`min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center gap-6 p-4 text-center ${dotted}`}>
            {children}
        </div>
    );
}

export function Message({ text, onBack, backLabel = "Volver al inicio" }: { text: string; onBack?: () => void; backLabel?: string }) {
    return (
        <Screen>
            <p className="text-3xl font-bold">{text}</p>
            {onBack && (
                <button className={primaryButton} onClick={onBack}>
                    {backLabel}
                </button>
            )}
        </Screen>
    );
}
