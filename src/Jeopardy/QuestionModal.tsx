import { useState, type ReactNode } from "react";
import { LETTERS, type Tile } from "./questions";

type Props = {
    categoryName: string;
    tile: Tile;
    onClose: () => void;
    // Show the answer without waiting for the button (e.g. someone already got it right)
    revealed?: boolean;
    closeLabel?: string;
    hint?: string;
    // Extra content under the question (e.g. the player answers in multiplayer)
    children?: ReactNode;
};

export default function QuestionModal({
    categoryName,
    tile,
    onClose,
    revealed = false,
    closeLabel = "Back to board",
    hint = "Use + / − below to give or take points, then go back.",
    children,
}: Props) {
    const [showAnswer, setShowAnswer] = useState(false);
    const answerShown = showAnswer || revealed;

    return (
        <div className="flex flex-col items-center justify-center gap-8 bg-[#2a3698] text-white min-h-[60vh] p-8 text-center border-8 border-black">
            <p className="text-2xl opacity-80">
                {categoryName} — {tile.value}
            </p>
            <p className="text-4xl md:text-5xl font-bold max-w-4xl">{tile.question}</p>

            <ol className="grid md:grid-cols-2 gap-3 w-full max-w-4xl text-2xl md:text-3xl text-left">
                {tile.options.map((option, i) => (
                    <li
                        key={option}
                        className={`px-4 py-3 border-4 ${
                            answerShown && option === tile.answer
                                ? "bg-yellow-300 text-black border-black font-bold"
                                : `border-white/40 ${answerShown ? "opacity-50" : ""}`
                        }`}
                    >
                        <b className="mr-3">{LETTERS[i]}</b>
                        {option}
                    </li>
                ))}
            </ol>

            {children}

            {!answerShown && (
                <button
                    onClick={() => setShowAnswer(true)}
                    className="bg-white text-[#2a3698] text-2xl font-bold px-6 py-3 cursor-pointer hover:bg-yellow-300"
                >
                    Show answer
                </button>
            )}

            {answerShown && (
                <>
                    <p className="text-lg opacity-80">{hint}</p>
                    <button
                        onClick={onClose}
                        className="bg-white text-[#2a3698] text-2xl font-bold px-6 py-3 cursor-pointer hover:bg-yellow-300"
                    >
                        {closeLabel}
                    </button>
                </>
            )}
        </div>
    );
}
