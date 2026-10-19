import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LocalCountdown } from "../Countdown";
import GameOverSplash from "../GameOverSplash";
import { startReporting } from "./debugReports";
import HowToPlay from "./HowToPlay";
import Podium from "../Podium";
import { MOTION } from "./panelMode";
import { LETTERS } from "../questions";
import { rankTeams, type Team } from "../teams";
import { TOPICS } from "../topics";
import { activeTileOf, answer, APP_VERSION, answerOf, answerProgress, chooseTeam, isLastTile, leaveRoom, optionsVisible, type Player, type Room } from "./roomService";
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

    if (room === undefined) return <Message text="Loading…" />;
    if (room === null) return <Message text="The host closed this room." onBack={onExit} backLabel="Join a game" />;

    const player = room.players[playerId];
    if (!player) return <Message text="You are no longer in this room." onBack={onExit} backLabel="Join a game" />;

    async function leave() {
        await leaveRoom(code, playerId);
        onExit();
    }

    const myTeam = room.teams.find((t) => t.id === player.team);
    const hasTeam = myTeam !== undefined;

    return (
        <Screen>
            <header className="w-full max-w-md flex justify-between text-lg">
                <span>
                    <b>{player.name}</b>
                    {hasTeam && ` · ${myTeam.name}`}
                </span>
                <span className="tracking-widest">Room {room.code}</span>
            </header>

            {hasTeam && (room.status === "board" || room.status === "question") && <MyScore room={room} teamId={myTeam.id} />}

            {room.status === "setup" ? (
                <SetupWait team={myTeam} />
            ) : !hasTeam || room.status === "lobby" ? (
                <TeamPicker room={room} player={player} />
            ) : room.status === "question" && room.activeTile ? (
                <AnswerPicker key={`${room.activeTile.col}-${room.activeTile.row}`} room={room} player={player} />
            ) : room.status === "end" ? (
                <PlayerEnd room={room} player={player} />
            ) : (
                <p className="text-3xl font-bold">Look at the big screen. Waiting for a question…</p>
            )}

            <button className={linkButton} onClick={leave}>
                Leave game
            </button>
            {room.debug && <DebugReporter code={code} player={player} teamName={myTeam?.name ?? null} />}
        </Screen>
    );
}

// Teacher's debug switch is on: send what this phone sees to the teacher's console.
// Only a small 🐞 dot shows here, so the tester knows it's reporting.
function DebugReporter({ code, player, teamName }: { code: string; player: Player; teamName: string | null }) {
    const who = useRef({ name: player.name, team: teamName });
    useEffect(() => {
        who.current = { name: player.name, team: teamName };
    }, [player.name, teamName]);
    useEffect(() => startReporting(code, player.id, () => who.current, APP_VERSION), [code, player.id]);
    return (
        <span aria-label="Debug reporting on" title="Debug reporting on" className="fixed bottom-2 left-2 text-sm opacity-60 pointer-events-none">
            🐞
        </span>
    );
}

// The teacher is setting up (the next) game: players stay in the room and on their team,
// so they only wait. Card pops in, team chip rings, dots bounce until the room opens.
function SetupWait({ team }: { team: Team | undefined }) {
    const root = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        const el = root.current!;
        const tl = gsap.timeline();
        tl.fromTo(el, { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.45 * MOTION, ease: "back.out(1.7)", clearProps: "transform" });
        const ring = el.querySelector(".sw-ring");
        if (ring) tl.fromTo(ring, { scale: 1, autoAlpha: 0.9 }, { scale: 1.6, autoAlpha: 0, duration: 0.7 * MOTION, ease: "power2.out", repeat: 2, repeatDelay: 0.6 });
        const dots = gsap.fromTo(
            el.querySelectorAll(".sw-dot"),
            { y: 0 },
            { y: -8, duration: 0.35, ease: "power1.out", yoyo: true, repeat: MOTION ? -1 : 0, stagger: 0.12 }
        );
        return () => {
            tl.kill();
            dots.kill();
        };
    }, []);

    return (
        <div ref={root} className="flex flex-col items-center gap-4 opacity-0">
            <p className="text-4xl font-bold">Get ready! 🎮</p>
            <p className="text-xl opacity-90">
                The teacher is setting up the next game
                {[0, 1, 2].map((i) => (
                    <span key={i} className="sw-dot inline-block">
                        .
                    </span>
                ))}
            </p>
            {team ? (
                <p className="text-xl">
                    You'll stay on{" "}
                    <span className="relative inline-block bg-white text-black font-bold px-3 py-1 border-l-8" style={{ borderLeftColor: team.color }}>
                        <span aria-hidden className="sw-ring absolute inset-0 border-4 border-yellow-300 opacity-0" />
                        {team.name}
                    </span>
                </p>
            ) : (
                <p className="text-xl">You'll pick a team when the room opens.</p>
            )}
            <HowToPlay />
        </div>
    );
}

const ordinal = (n: number) => `${n}${n % 10 === 1 && n % 100 !== 11 ? "st" : n % 10 === 2 && n % 100 !== 12 ? "nd" : n % 10 === 3 && n % 100 !== 13 ? "rd" : "th"}`;

// "Game over!" splash first, then the podium with the player's own place called out
function PlayerEnd({ room, player }: { room: Room; player: Player }) {
    const [splashDone, setSplashDone] = useState(false);
    if (!splashDone) return <GameOverSplash onDone={() => setSplashDone(true)} />;
    const ranked = rankTeams(room.teams);
    const mine = ranked.find((r) => r.team.id === player.team);
    return (
        <>
            <p className="text-4xl font-bold">Game over!</p>
            {mine && (
                <p className="text-2xl font-bold text-yellow-300">
                    Your team finished {ordinal(mine.place)} of {ranked.length}!
                </p>
            )}
            {room.teams.length === 0 ? <p className="text-2xl opacity-80">Everyone left the game.</p> : <Podium teams={room.teams} />}
        </>
    );
}

// One line instead of every team's card, so the phone never needs to scroll
function MyScore({ room, teamId }: { room: Room; teamId: string }) {
    const ranked = rankTeams(room.teams);
    const mine = ranked.find((r) => r.team.id === teamId);
    if (!mine) return null;
    return (
        <p className="w-full max-w-md bg-white text-black text-xl px-3 py-2 border-l-8 text-left" style={{ borderLeftColor: mine.team.color }}>
            Your team: <b>{mine.team.score}</b> · {ordinal(mine.place)} of {ranked.length}
        </p>
    );
}

function TeamPicker({ room, player }: { room: Room; player: Player }) {
    const players = Object.values(room.players);
    const sizeOf = (teamId: string) => players.filter((p) => p.team === teamId).length;

    return (
        <>
            <h2 className="text-3xl font-bold">Pick your team</h2>

            <div className="grid gap-3 w-full max-w-md">
                {room.teams.map((team) => {
                    const size = sizeOf(team.id);
                    const cap = room.maxTeamSize + (team.bonus ?? 0);
                    const mine = player.team === team.id;
                    const full = size >= cap && !mine;
                    return (
                        <button
                            key={team.id}
                            onClick={() => chooseTeam(room.code, player.id, team.id)}
                            disabled={full || mine}
                            // The team color is the left border; the selected team turns yellow
                            style={mine ? undefined : { borderLeftColor: team.color }}
                            className={`text-2xl font-bold py-4 px-3 text-left border-4 border-l-[12px] disabled:cursor-not-allowed ${
                                mine
                                    ? "bg-yellow-300 text-black border-black"
                                    : `bg-white text-[#2a3698] border-transparent ${full ? "opacity-50" : "cursor-pointer hover:bg-yellow-300"}`
                            }`}
                        >
                            {team.name}{" "}
                            <span className="text-base font-normal opacity-70">
                                ({size}/{cap}{full ? ", full" : ""})
                            </span>
                        </button>
                    );
                })}
            </div>

            {room.status === "lobby" && room.startsAt !== null ? (
                <div className="w-full max-w-md">
                    <p className={`text-2xl font-bold ${player.team === null ? "text-yellow-300" : ""}`}>
                        {player.team === null ? "Pick a team now or you'll be left out!" : "Game starts soon…"}
                    </p>
                    <LocalCountdown key={room.startsAt} seconds={room.startSeconds} />
                </div>
            ) : (
                player.team !== null && room.status === "lobby" && <p className="text-xl opacity-80">Waiting for the host to start…</p>
            )}
            {room.status === "lobby" && <HowToPlay />}
        </>
    );
}

// A phone still waiting this long after its own bar ended asks the server directly
// (the live push can be many seconds late). Options and reveal still come only from the host.
const STUCK_AFTER_MS = 2000;
const STUCK_EVERY_MS = 2000;

function AnswerPicker({ room, player }: { room: Room; player: Player }) {
    const reading = !optionsVisible(room) && !room.revealed;
    const answering = optionsVisible(room) && !room.revealed;
    useServerCheck(room.code, reading, room.readSeconds * 1000 + STUCK_AFTER_MS, STUCK_EVERY_MS);
    useServerCheck(room.code, answering, room.timerSeconds * 1000 + STUCK_AFTER_MS, STUCK_EVERY_MS);

    const tile = activeTileOf(room);
    if (!tile || !room.activeTile) return null;

    // One answer per team: whoever taps first answers for everyone on it
    const teamAnswer = answerOf(room, player.team);
    const done = room.revealed;
    // Reading time (`reading` above): question only. The host screen reveals the options for everyone at once.
    const { answered, total } = answerProgress(room);
    const topic = TOPICS.find((t) => t.id === room.topic)?.name ?? room.topic;

    return (
        <>
            {/* Same width cap as the option buttons, so nothing can grow past a phone's screen.
                Long code lines wrap (pre-wrap + break) instead of cutting off at the edges. */}
            <div className="w-full max-w-md">
                <p className="text-lg opacity-80">
                    {topic} — {room.board[room.activeTile.col].name} — {tile.value}
                    {isLastTile(room) && (
                        <span className="ml-2 bg-yellow-300 text-black font-bold text-sm px-2 py-0.5 rounded align-middle">⭐ Final question</span>
                    )}
                </p>
                <p className="text-2xl font-bold">{tile.question}</p>
                {tile.code && (
                    <pre className="bg-black/40 rounded-lg text-left text-sm sm:text-base px-3 py-2 mt-2 max-w-full whitespace-pre-wrap break-words">
                        {tile.code}
                    </pre>
                )}
            </div>

            {/* Bars start when this phone receives the update, so a wrong clock can't shorten them */}
            {reading ? (
                <>
                    <LocalCountdown key="read" seconds={room.readSeconds} label="Options in" />
                    <p className="text-xl opacity-80">Read the question and get ready…</p>
                </>
            ) : (
                !done && <LocalCountdown key="answer" seconds={room.timerSeconds} />
            )}

            {!reading && (
                <div className="grid gap-3 w-full max-w-md">
                    {tile.options.map((option, i) => {
                        const ours = teamAnswer?.choice === option;
                        const isAnswer = done && option === tile.answer;
                        return (
                            <button
                                key={option}
                                onClick={() => answer(room.code, player.id, option)}
                                disabled={!!teamAnswer || done}
                                className={`text-2xl font-bold py-4 px-3 text-left border-4 cursor-pointer disabled:cursor-not-allowed ${
                                    isAnswer
                                        ? "bg-yellow-300 text-black border-black"
                                        : ours && done
                                          ? "bg-red-600 text-white border-black"
                                          : ours
                                            ? "bg-white text-[#2a3698] border-black"
                                            : `bg-white text-[#2a3698] border-transparent ${teamAnswer || done ? "opacity-50" : "hover:bg-yellow-300"}`
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
                    {!teamAnswer ? (
                        "Your team didn't answer in time."
                    ) : teamAnswer.correct ? (
                        <b className="text-yellow-300">Correct! +{tile.value} for your team</b>
                    ) : (
                        "Wrong answer, no points this time."
                    )}
                    <br />
                    Waiting for the next question…
                </p>
            ) : teamAnswer ? (
                <p className="text-2xl">
                    {teamAnswer.playerId === player.id ? "You" : <b>{teamAnswer.name}</b>} answered{" "}
                    <b>{LETTERS[tile.options.indexOf(teamAnswer.choice)]}</b> for your team. Waiting for the other teams… ({answered}/{total})
                </p>
            ) : (
                <p className="text-xl opacity-80">
                    Answer for your team. Every team that gets it right scores — no need to rush, just be right!
                </p>
            )}
        </>
    );
}
