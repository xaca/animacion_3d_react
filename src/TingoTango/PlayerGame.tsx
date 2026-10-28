import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LocalCountdown } from "./Countdown";
import { startReporting } from "./debugReports";
import GameOverSplash from "./GameOverSplash";
import HowToPlay from "./HowToPlay";
import { MOTION } from "./motion";
import Podium from "./Podium";
import TiebreakShow from "./TiebreakShow";
import { answer, APP_VERSION, hopMsOf, hopsOf, leaveRoom, optionsVisible, selectedPlayer, type TingoRoom } from "./roomService";
import { hasScores, LETTERS, POINTS, rankPlayers, type TingoPlayer } from "./types";
import { linkButton, Message, Screen } from "./ui";
import { useRoom } from "./useRoom";
import { useServerCheck } from "./useServerCheck";

type Props = {
    code: string;
    playerId: string;
    onExit: () => void;
};

export default function PlayerGame({ code, playerId, onExit }: Props) {
    const room = useRoom(code);
    // While the ball is jumping the phone only waits; a periodic server read covers a
    // late push so nobody misses their own ¡Tango!
    useServerCheck(code, room?.status === "tingo", 4000, 4000);

    if (room === undefined) return <Message text="Cargando…" />;
    if (room === null) return <Message text="El profe cerró esta sala." onBack={onExit} backLabel="Unirme a un juego" />;

    const player = room.players[playerId];
    if (!player) return <Message text="Ya no estás en esta sala." onBack={onExit} backLabel="Unirme a un juego" />;

    async function leave() {
        await leaveRoom(code, playerId);
        onExit();
    }

    return (
        <Screen>
            <header className="w-full max-w-md flex justify-between text-lg">
                <span>
                    <b>{player.name}</b>
                </span>
                <span className="tracking-widest">Sala {room.code}</span>
            </header>

            {(room.status === "tingo" || room.status === "tango") && <MyScore room={room} playerId={playerId} />}

            {room.status === "lobby" || room.status === "setup" ? (
                <LobbyWait room={room} />
            ) : room.status === "tingo" ? (
                <BallWait key={room.round} room={room} playerId={playerId} />
            ) : room.status === "tango" && room.question ? (
                <TangoView key={room.round} room={room} player={player} />
            ) : room.status === "end" ? (
                <PlayerEnd room={room} player={player} />
            ) : (
                <p className="text-3xl font-bold">Mira la pantalla grande…</p>
            )}

            <button className={linkButton} onClick={leave}>
                Salir del juego
            </button>
            {room.debug && <DebugReporter code={code} player={player} />}
        </Screen>
    );
}

// Teacher's debug switch is on: send what this phone sees to the teacher's console.
// Only a small 🐞 dot shows here, so the tester knows it's reporting.
function DebugReporter({ code, player }: { code: string; player: TingoPlayer }) {
    const who = useRef({ name: player.name });
    useEffect(() => {
        who.current = { name: player.name };
    }, [player.name]);
    useEffect(() => startReporting(code, player.id, () => who.current, APP_VERSION), [code, player.id]);
    return (
        <span aria-label="Debug reporting on" title="Debug reporting on" className="fixed bottom-2 left-2 text-sm opacity-60 pointer-events-none">
            🐞
        </span>
    );
}

// In the waiting room: you're in, hold tight. Dots bounce until the teacher starts.
function LobbyWait({ room }: { room: TingoRoom }) {
    const root = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        const el = root.current!;
        const tl = gsap.fromTo(el, { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.45 * MOTION, ease: "back.out(1.7)", clearProps: "transform" });
        const dots = gsap.fromTo(
            el.querySelectorAll(".lw-dot"),
            { y: 0 },
            { y: -8, duration: 0.35, ease: "power1.out", yoyo: true, repeat: MOTION ? -1 : 0, stagger: 0.12 }
        );
        return () => {
            tl.kill();
            dots.kill();
        };
    }, []);
    const count = Object.keys(room.players).length;
    return (
        <div ref={root} className="flex flex-col items-center gap-4 opacity-0">
            <p className="text-4xl font-bold">¡Ya estás dentro! 🎮</p>
            <p className="text-xl opacity-90">
                {/* setup: the teacher went back to ⚙ Ajustes; the player stays in */}
                {room.status === "setup" ? "El profe está preparando el juego" : "Esperando a que el profe empiece"}
                {[0, 1, 2].map((i) => (
                    <span key={i} className="lw-dot inline-block">
                        .
                    </span>
                ))}
            </p>
            <p className="text-xl">
                👥 {count} {count === 1 ? "jugador" : "jugadores"} en la sala
            </p>
            <HowToPlay />
        </div>
    );
}

// Best-effort buzz; iOS Safari simply ignores it
function vibrate(ms: number) {
    try {
        navigator.vibrate?.(ms);
    } catch {
        // unsupported
    }
}

// The round's ball on THIS phone: it replays the room's hop schedule (written once by
// stopTango's round start — zero per-hop writes, the live push could never keep that
// pace) from the moment the round reached this phone, LocalCountdown-style: its own
// stopwatch, never another device's clock. When the schedule says the ball is here, it
// drops in big with a short buzz. Visual theater: the real draw is stopTango's.
function BallWait({ room, playerId }: { room: TingoRoom; playerId: string }) {
    const latest = useRef(room);
    useEffect(() => {
        latest.current = room;
    }, [room]);
    const [onMe, setOnMe] = useState(false);

    useEffect(() => {
        const hops = hopsOf(latest.current);
        const hopMs = hopMsOf(latest.current);
        if (hops.length === 0) return; // room from before the schedule field: chant only
        let i = 0;
        const step = () => {
            const mine = hops[i % hops.length] === playerId; // loop if the round runs long
            i++;
            setOnMe(mine);
            if (mine) vibrate(60);
        };
        step();
        const id = setInterval(step, hopMs);
        return () => clearInterval(id);
    }, [playerId]);

    // The ball pops when it arrives; the chant pulses while it's elsewhere
    const root = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        const el = root.current!;
        if (onMe) {
            const tween = gsap.fromTo(
                el.querySelector(".bw-ball"),
                { scale: 0.3, autoAlpha: 0 },
                { scale: 1, autoAlpha: 1, duration: 0.25 * MOTION, ease: "back.out(2.2)", clearProps: "transform,opacity,visibility" }
            );
            return () => {
                tween.kill();
            };
        }
        const chant = gsap.fromTo(
            el.querySelector(".bw-chant"),
            { scale: 1 },
            { scale: 1.08, duration: 0.4, ease: "sine.inOut", yoyo: true, repeat: MOTION ? -1 : 0 }
        );
        return () => {
            chant.kill();
        };
    }, [onMe]);

    return (
        <div ref={root} className="flex flex-col items-center gap-6">
            {onMe ? (
                <>
                    <span className="bw-ball w-28 h-28 rounded-full bg-red-500 shadow-[0_0_44px_rgba(239,68,68,0.95)]" aria-hidden />
                    <p className="text-3xl font-extrabold text-yellow-300">¡La bolita está en tu celular! 🔴</p>
                    <p className="text-lg opacity-80">Tingo, tingo, tingo…</p>
                </>
            ) : (
                <>
                    <p className="bw-chant text-4xl font-extrabold">Tingo, tingo, tingo…</p>
                    <p className="text-xl opacity-80">La bolita anda saltando… puede llegar a tu celular 👀</p>
                </>
            )}
        </div>
    );
}

// Spanish ordinal: 1.º, 2.º, …
const ordinal = (n: number) => `${n}.º`;

// One line with my score and place, so the phone never needs to scroll. The place only
// appears once I have points — "1.º de 2" with 0 points is an empty boast.
function MyScore({ room, playerId }: { room: TingoRoom; playerId: string }) {
    const ranked = rankPlayers(Object.values(room.players));
    const mine = ranked.find((r) => r.player.id === playerId);
    if (!mine) return null;
    return (
        <p className="w-full max-w-md bg-white text-slate-900 text-xl px-3 py-2 rounded border-l-8 border-red-500 text-left">
            Tus puntos: <b>{mine.player.score}</b>
            {mine.player.score > 0 && (
                <>
                    {" "}
                    · {ordinal(mine.place)} de {ranked.length}
                </>
            )}
        </p>
    );
}

// A phone still waiting this long after its own bar ended asks the server directly
// (the live push can be many seconds late). Options and reveal still come only from the host.
const STUCK_AFTER_MS = 2000;
const STUCK_EVERY_MS = 2000;

// Question open: the chosen one answers, everyone else reads along
function TangoView({ room, player }: { room: TingoRoom; player: TingoPlayer }) {
    const reading = !optionsVisible(room) && !room.revealed;
    const answering = optionsVisible(room) && !room.revealed;
    useServerCheck(room.code, reading, room.readSeconds * 1000 + STUCK_AFTER_MS, STUCK_EVERY_MS);
    useServerCheck(room.code, answering, room.answerSeconds * 1000 + STUCK_AFTER_MS, STUCK_EVERY_MS);

    const question = room.question!;
    const selected = selectedPlayer(room);
    const itsMe = room.selectedId === player.id;
    const done = room.revealed;
    const myTurnAndOpen = itsMe && answering && room.choice === null;

    // "¡Te tocó!" pops on the chosen phone, with a long buzz: the ball landed HERE
    const banner = useRef<HTMLParagraphElement>(null);
    useLayoutEffect(() => {
        if (!itsMe || !banner.current) return;
        vibrate(300);
        const tween = gsap.fromTo(
            banner.current,
            { scale: 0.5, autoAlpha: 0 },
            { scale: 1, autoAlpha: 1, duration: 0.4 * MOTION, ease: "back.out(1.8)", clearProps: "transform,opacity,visibility" }
        );
        return () => {
            tween.kill();
        };
    }, [itsMe]);

    return (
        <>
            {itsMe ? (
                <p ref={banner} className="text-3xl font-extrabold text-yellow-300">
                    🎯 ¡Te tocó, {player.name}!
                </p>
            ) : (
                <p className="text-2xl font-bold">
                    🎯 Le tocó a <b className="text-yellow-300">{selected?.name ?? "…"}</b>
                </p>
            )}

            <div className="w-full max-w-md">
                <p className="text-lg opacity-80">Ronda {room.round}</p>
                <p className="text-2xl font-bold">{question.question}</p>
                {question.code && (
                    <pre className="bg-black/40 rounded-lg text-left text-sm sm:text-base px-3 py-2 mt-2 max-w-full whitespace-pre-wrap break-words">
                        {question.code}
                    </pre>
                )}
            </div>

            {/* Bars start when this phone receives the update, so a wrong clock can't shorten them */}
            {reading ? (
                <>
                    <LocalCountdown key="read" seconds={room.readSeconds} label="Opciones en" />
                    <p className="text-xl opacity-80">{itsMe ? "Lee con calma y prepárate…" : "Lee la pregunta y acompaña…"}</p>
                </>
            ) : (
                !done && <LocalCountdown key="answer" seconds={room.answerSeconds} />
            )}

            {!reading && (
                <div className="grid gap-3 w-full max-w-md">
                    {question.options.map((option, i) => {
                        const chosen = room.choice === option;
                        const isAnswer = done && option === question.answer;
                        return (
                            <button
                                key={option}
                                onClick={() => myTurnAndOpen && answer(room.code, player.id, option)}
                                disabled={!myTurnAndOpen}
                                className={`text-2xl font-bold py-4 px-3 rounded-lg text-left border-4 disabled:cursor-not-allowed ${
                                    isAnswer
                                        ? "bg-yellow-300 text-black border-black"
                                        : chosen && done
                                          ? "bg-red-600 text-white border-black"
                                          : chosen
                                            ? "bg-white text-slate-900 border-black"
                                            : `bg-white text-slate-900 border-transparent ${myTurnAndOpen ? "cursor-pointer hover:bg-yellow-300" : "opacity-60"}`
                                }`}
                            >
                                <span className="mr-3">{LETTERS[i]}</span>
                                {option}
                            </button>
                        );
                    })}
                </div>
            )}

            {reading ? null : done ? (
                <p className="text-2xl">
                    {itsMe ? (
                        room.choice === null ? (
                            "Se acabó el tiempo, esta vez sin puntos."
                        ) : room.choice === question.answer ? (
                            <b className="text-yellow-300">¡Correcto! +{POINTS} puntos para ti 🎉</b>
                        ) : (
                            "Respuesta incorrecta, sin puntos esta vez."
                        )
                    ) : room.choice === question.answer ? (
                        <>
                            <b className="text-yellow-300">{selected?.name}</b> acertó. 👏
                        </>
                    ) : (
                        <>La respuesta era: {question.answer}</>
                    )}
                    <br />
                    La bolita vuelve a saltar en un momento…
                </p>
            ) : itsMe ? (
                room.choice !== null ? (
                    <p className="text-2xl">Respuesta enviada ✋ Mira la pantalla grande…</p>
                ) : (
                    <p className="text-xl opacity-80">¡Es tu turno! Elige una opción antes de que acabe el tiempo.</p>
                )
            ) : (
                <p className="text-xl opacity-80">
                    {room.choice !== null ? `${selected?.name} ya respondió…` : `Responde ${selected?.name ?? "…"}. ¿Tú la sabías? 🤔`}
                </p>
            )}
        </>
    );
}

// "¡Se acabó!" splash first, then the ending: podium with my place, "no points this
// time" when I ended on 0, or "la bolita ganó" when NOBODY scored (no medals for zeros)
function PlayerEnd({ room, player }: { room: TingoRoom; player: TingoPlayer }) {
    const [splashDone, setSplashDone] = useState(false);
    const [tiebreakDone, setTiebreakDone] = useState(false);
    const tiebreaks = room.tiebreaks ?? [];
    if (!splashDone) return <GameOverSplash onDone={() => setSplashDone(true)} />;
    if (tiebreaks.length > 0 && !tiebreakDone) return <TiebreakShow tiebreaks={tiebreaks} onDone={() => setTiebreakDone(true)} />;
    const players = Object.values(room.players);
    const ranked = rankPlayers(players, tiebreaks);
    const viaTiebreak = tiebreaks.some((t) => t.contenders.some((c) => c.id === player.id));
    const mine = ranked.find((r) => r.player.id === player.id);

    if (players.length === 0) {
        return (
            <>
                <p className="text-4xl font-bold">¡Se acabó el juego!</p>
                <p className="text-2xl opacity-80">Todos salieron del juego.</p>
            </>
        );
    }
    if (!hasScores(players)) {
        return (
            <>
                <p className="text-4xl font-bold">¡Se acabó el juego!</p>
                <p className="text-3xl font-bold text-yellow-300">¡Esta vez ganó la bolita! 🔴</p>
                <p className="text-2xl">Nadie sumó puntos. ¡Revancha! 💪</p>
            </>
        );
    }
    return (
        <>
            <p className="text-4xl font-bold">¡Se acabó el juego!</p>
            {mine &&
                (mine.player.score > 0 ? (
                    <p className="text-2xl font-bold text-yellow-300">
                        Quedaste {ordinal(mine.place)} de {ranked.length} con {mine.player.score} puntos
                        {viaTiebreak && " (por desempate ✊✋✌️)"}
                    </p>
                ) : (
                    <p className="text-2xl font-bold text-yellow-300">Esta vez no sumaste puntos. ¡A la próxima! 💪</p>
                ))}
            <Podium players={players} tiebreaks={tiebreaks} />
        </>
    );
}
