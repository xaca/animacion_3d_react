import { useEffect, useState } from "react";
import { linkButton } from "./ui";

type Lang = "en" | "es";

const LANG_KEY = "tingo-lang";

// Spanish by default: the players are Spanish speakers and the rules must be clear
function readLang(): Lang {
    try {
        return localStorage.getItem(LANG_KEY) === "en" ? "en" : "es";
    } catch {
        return "es";
    }
}

const TITLE: Record<Lang, string> = { en: "How to play", es: "Cómo jugar" };

const STEPS: { icon: string; en: string; es: string }[] = [
    {
        icon: "📱",
        en: "Join: type the room code from the big screen (or scan the QR) and your name.",
        es: "Únete: escribe el código de la pantalla grande (o escanea el QR) y tu nombre.",
    },
    {
        icon: "🔴",
        en: "Tingo, tingo…: the little ball jumps between the players on the big screen.",
        es: "Tingo, tingo…: la bolita salta entre los jugadores en la pantalla grande.",
    },
    {
        icon: "🛑",
        en: "Tango!: when it stops (by itself or by the teacher), it lands on one player.",
        es: "¡Tango!: cuando se detiene (sola o por el profesor), cae sobre un jugador.",
    },
    {
        icon: "🤫",
        en: "Read first: the question appears alone for a few seconds, with no options yet.",
        es: "Primero lee: la pregunta aparece sola unos segundos, todavía sin opciones.",
    },
    {
        icon: "🅰️",
        en: "Only the chosen player answers, picking one of the options on their phone.",
        es: "Solo responde la persona elegida, tocando una de las opciones en su celular.",
    },
    {
        icon: "🥇",
        en: "Each correct answer is worth points; everyone gets a turn before anyone repeats. Podium at the end!",
        es: "Cada acierto vale puntos; todos pasan por la bolita antes de que alguien repita. ¡Al final, el podio!",
    },
];

// "❓ Cómo jugar" link that opens a bilingual instructions overlay.
// Used on the home screen, the join form and the player's waiting screen.
export default function HowToPlay() {
    const [open, setOpen] = useState(false);
    const [lang, setLangState] = useState<Lang>(readLang);

    function setLang(next: Lang) {
        setLangState(next);
        try {
            localStorage.setItem(LANG_KEY, next);
        } catch {
            // remembered for this page only
        }
    }

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        addEventListener("keydown", onKey);
        return () => removeEventListener("keydown", onKey);
    }, [open]);

    return (
        <>
            <button className={linkButton} onClick={() => setOpen(true)}>
                ❓ Cómo jugar · How to play
            </button>
            {open && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
                    <div
                        className="bg-slate-800 text-white w-full max-w-lg max-h-[90dvh] overflow-y-auto rounded-xl p-6 text-left shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between gap-3 mb-4">
                            <h2 className="text-3xl font-bold">{TITLE[lang]}</h2>
                            <div className="flex items-center gap-2">
                                {(["es", "en"] as const).map((l) => (
                                    <button
                                        key={l}
                                        onClick={() => setLang(l)}
                                        className={`px-3 py-1 rounded font-bold cursor-pointer ${
                                            lang === l ? "bg-yellow-300 text-black" : "bg-white/10 hover:bg-white/25"
                                        }`}
                                    >
                                        {l.toUpperCase()}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setOpen(false)}
                                    className="ml-2 text-2xl opacity-70 hover:opacity-100 cursor-pointer"
                                    aria-label={lang === "es" ? "Cerrar" : "Close"}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                        <ol className="flex flex-col gap-4">
                            {STEPS.map((step) => (
                                <li key={step.icon} className="flex gap-3 text-lg leading-snug">
                                    <span className="text-2xl shrink-0">{step.icon}</span>
                                    <span>{step[lang]}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            )}
        </>
    );
}
