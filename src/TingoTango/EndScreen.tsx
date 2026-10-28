import { useLayoutEffect, useRef, type ReactNode } from "react";
import { popIn } from "./anim";
import Podium from "./Podium";
import { dotted } from "./ui";
import { hasScores, rankPlayers, type Tiebreak, type TingoPlayer } from "./types";

type Props = {
    players: TingoPlayer[];
    tiebreaks?: Tiebreak[];
    actions?: ReactNode; // host: next-game choices
};

export default function EndScreen({ players, tiebreaks = [], actions }: Props) {
    const nobodyScored = players.length > 0 && !hasScores(players);
    // A tie for 1st was settled ✊✋✌️ (finishGame), so there is a single winner
    const winner = rankPlayers(players, tiebreaks)[0]?.player.name;
    const byTiebreak = tiebreaks.some((t) => t.place === 1);

    return (
        <div className={`min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center gap-6 p-4 ${dotted}`}>
            <h1 className="text-5xl font-bold">¡Se acabó el juego!</h1>
            {players.length === 0 ? (
                <p className="text-yellow-300 text-3xl font-bold text-center">Todos salieron del juego 🤷</p>
            ) : nobodyScored ? (
                <BolitaWins players={players} />
            ) : (
                <>
                    <p className="text-yellow-300 text-3xl font-bold text-center">
                        ¡Gana {winner}!{byTiebreak && <span className="block text-lg font-normal opacity-80">por desempate ✊✋✌️</span>}
                    </p>
                    <Podium players={players} tiebreaks={tiebreaks} withSound />
                </>
            )}
            {actions}
        </div>
    );
}

// Everyone ended on 0: no podium, no medals, no confetti — the ball won this one.
// The players are listed as equals and the main action becomes the rematch.
function BolitaWins({ players }: { players: TingoPlayer[] }) {
    const ball = useRef<HTMLSpanElement>(null);
    useLayoutEffect(() => {
        const tween = popIn(ball.current);
        return () => {
            tween.kill();
        };
    }, []);
    return (
        <div className="flex flex-col items-center gap-4">
            <span ref={ball} className="w-24 h-24 rounded-full bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.9)]" aria-hidden />
            <p className="text-yellow-300 text-3xl md:text-4xl font-bold text-center">¡Esta vez ganó la bolita!</p>
            <p className="text-xl opacity-80">Nadie sumó puntos — toca revancha.</p>
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
                {players.map((p) => (
                    <span key={p.id} className="bg-white text-slate-900 font-bold px-3 py-1 rounded-lg">
                        {p.name}
                    </span>
                ))}
            </div>
        </div>
    );
}
