import type { ReactNode } from "react";

export const primaryButton =
    "bg-white text-[#2a3698] text-2xl font-bold px-6 py-3 cursor-pointer hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white";

export const linkButton = "text-white underline opacity-80 hover:opacity-100 cursor-pointer";

export const input = "bg-white text-2xl px-3 py-2 border border-gray-400 w-full";

export function Screen({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-[#2a3698] text-white flex flex-col items-center justify-center gap-6 p-4 text-center">
            {children}
        </div>
    );
}

export function Message({ text, onBack }: { text: string; onBack?: () => void }) {
    return (
        <Screen>
            <p className="text-3xl font-bold">{text}</p>
            {onBack && (
                <button className={primaryButton} onClick={onBack}>
                    Back to home
                </button>
            )}
        </Screen>
    );
}
