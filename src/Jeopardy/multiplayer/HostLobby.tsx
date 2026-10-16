import { useRef, useState } from "react";
import Countdown from "../Countdown";
import { TOPICS } from "../topics";
import { toggleRoomDebug } from "./debugSwitch";
import JoinQr from "./JoinQr";
import ProfileMenu, { type MenuItem } from "./ProfileMenu";
import { addBot, backToSetup, cancelCountdown, removeBots, rerollTeamNames, startCountdown, startGame, startProblem, type Room } from "./roomService";
import { linkButton, primaryButton, Screen } from "./ui";

type Props = {
    room: Room;
    onExit: () => void;
    onLogout: () => void;
};

// Waiting room on the big screen: how to join, teams filling up, Start with a last-call countdown.
export default function HostLobby({ room, onExit, onLogout }: Props) {
    const [starting, setStarting] = useState(false);
    const [error, setError] = useState("");
    const players = Object.values(room.players);
    const unassigned = players.filter((p) => p.team === null);
    const problem = startProblem(room);
    const counting = room.startsAt !== null;

    // Guards against "Start now" and the countdown's onDone both starting the game
    const startingRef = useRef(false);
    async function start() {
        if (startingRef.current) return;
        startingRef.current = true;
        setStarting(true);
        setError("");
        try {
            await startGame(room.code);
        } catch (e) {
            console.error("Could not start the game", e);
            setError(e instanceof Error ? e.message : "Could not start the game. Check your connection and try again.");
            await cancelCountdown(room.code);
        } finally {
            startingRef.current = false;
            setStarting(false);
        }
    }

    const topic = TOPICS.find((t) => t.id === room.topic)?.name ?? room.topic;
    const debug = room.debug === true;
    const humans = players.filter((p) => !p.bot).length;
    const menu: MenuItem[] = [
        { label: "🐞 Debug mode", on: debug, onClick: () => toggleRoomDebug(room.code, !debug) },
        {
            label: "Close room",
            danger: true,
            separatorBefore: true,
            onClick: () => (humans === 0 || confirm(`${humans} players will be disconnected. Continue?`)) && onExit(),
        },
        { label: "Log out", onClick: onLogout },
    ];

    return (
        <Screen>
            <div className="fixed top-3 right-3 z-30">
                <ProfileMenu items={menu} />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8">
                <JoinQr code={room.code} />
                <div className="flex flex-col items-center gap-2">
                    <p className="text-2xl">
                        Go to <b>{location.host}/join</b> and enter the code
                    </p>
                    <p className="text-7xl md:text-8xl font-bold tracking-[0.3em] bg-black/30 px-6 py-2">{room.code}</p>
                    <p className="text-lg opacity-80">or scan the QR code</p>
                </div>
            </div>

            <p className="opacity-80">
                {topic} · {room.readSeconds} s to read + {room.timerSeconds} s to answer · {room.teams.length} teams · max {room.maxTeamSize} per
                team · {room.startSeconds} s start countdown
            </p>

            <div className="flex flex-wrap justify-center gap-4 max-w-5xl">
                {room.teams.map((team) => {
                    const members = players.filter((p) => p.team === team.id);
                    return (
                        <div key={team.id} className="bg-white text-black w-44 min-h-32 p-2 border-t-8" style={{ borderTopColor: team.color }}>
                            <h3 className="font-bold text-xl leading-tight border-b-4 border-black pb-1 mb-2">{team.name}</h3>
                            {members.length === 0 ? (
                                <p className="opacity-50">waiting…</p>
                            ) : (
                                <ul>
                                    {members.map((p) => (
                                        <li key={p.id}>{p.name}</li>
                                    ))}
                                </ul>
                            )}
                            <p className={`text-sm mt-1 ${members.length > room.maxTeamSize ? "text-red-600 font-bold" : "opacity-60"}`}>
                                {members.length}/{room.maxTeamSize}
                            </p>
                        </div>
                    );
                })}
            </div>
            {!counting && (
                <div className="flex flex-wrap justify-center gap-6">
                    <button className={linkButton} onClick={() => rerollTeamNames(room.code)}>
                        🎲 New team names
                    </button>
                    {/* Lets one person test the game: bots fill other teams and the host screen answers for them */}
                    <button className={linkButton} onClick={() => addBot(room.code)}>
                        🧪 Add test player
                    </button>
                    {players.some((p) => p.bot) && (
                        <button className={linkButton} onClick={() => removeBots(room.code)}>
                            Remove test players
                        </button>
                    )}
                    {/* Phones report what they see to the teacher's 🐞 console (for testing) */}
                    <button className={linkButton} onClick={() => toggleRoomDebug(room.code, !debug)}>
                        🐞 Debug: {debug ? "ON" : "off"}
                    </button>
                </div>
            )}

            {unassigned.length > 0 && <p className="opacity-80">Choosing a team: {unassigned.map((p) => p.name).join(", ")}</p>}
            {players.length === 0 && <p className="opacity-80">Waiting for players…</p>}

            {counting && room.startsAt !== null ? (
                <>
                    <p className="text-3xl font-bold text-yellow-300">Game starts soon — last call to pick a team!</p>
                    <Countdown endsAt={room.startsAt} totalSeconds={room.startSeconds} onDone={start} />
                    <p className="opacity-80">Teams still empty when the countdown ends are left out.</p>
                    <div className="flex gap-6 items-center">
                        <button className={primaryButton} onClick={start} disabled={starting}>
                            {starting ? "Loading questions…" : "Start now"}
                        </button>
                        <button className={linkButton} onClick={() => cancelCountdown(room.code)} disabled={starting}>
                            Cancel
                        </button>
                    </div>
                </>
            ) : (
                <button className={primaryButton} onClick={() => startCountdown(room.code)} disabled={starting || problem !== null}>
                    {starting ? "Loading questions…" : "Start game"}
                </button>
            )}
            {problem && players.length > 0 && <p className="text-yellow-300">{problem}</p>}
            {error && <p className="text-yellow-300 font-bold">{error}</p>}

            <div className="flex gap-6">
                <button className={linkButton} onClick={() => backToSetup(room.code)} disabled={counting}>
                    Settings
                </button>
            </div>
        </Screen>
    );
}
