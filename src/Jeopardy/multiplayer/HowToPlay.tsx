import { useEffect, useState } from "react";
import { linkButton } from "./ui";

type Lang = "en" | "es";

const LANG_KEY = "jeopardy-lang";

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
        icon: "🎨",
        en: "Pick a team: tap one of the teams. You can switch while there is space, until the game starts — then teams are fixed.",
        es: "Elige equipo: toca uno de los equipos. Puedes cambiarte mientras haya espacio, hasta que empiece el juego — después los equipos quedan fijos.",
    },
    {
        icon: "🤫",
        en: "Read first: each question appears alone for a few seconds, with no options yet.",
        es: "Primero lee: cada pregunta aparece sola unos segundos, todavía sin opciones.",
    },
    {
        icon: "🅰️",
        en: "One answer per team: when the options appear, the first teammate to tap answers for everyone. Agree fast!",
        es: "Una respuesta por equipo: cuando aparecen las opciones, el primero del equipo que toca responde por todos. ¡Pónganse de acuerdo rápido!",
    },
    {
        icon: "🏆",
        en: "Everyone can score: every team that answers correctly wins the points. You race the clock, not the other teams.",
        es: "Todos pueden ganar: cada equipo que acierta gana los puntos. Compites contra el reloj, no contra los otros equipos.",
    },
    {
        icon: "🥇",
        en: "The podium: when the board is empty the game ends and the podium shows the winners.",
        es: "El podio: cuando el tablero se vacía el juego termina y el podio muestra a los ganadores.",
    },
];

// "❓ How to play · Cómo jugar" link that opens a bilingual instructions overlay.
// Used on the home screen, the join form and the player's team picker.
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
                ❓ How to play · Cómo jugar
            </button>
            {open && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
                    <div
                        className="bg-[#2a3698] text-white w-full max-w-lg max-h-[90dvh] overflow-y-auto rounded-xl p-6 text-left shadow-2xl"
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
