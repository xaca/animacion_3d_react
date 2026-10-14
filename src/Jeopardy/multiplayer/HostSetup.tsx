import { TOPICS } from "../topics";
import {
    openRoom,
    READ_SECONDS_CHOICES,
    rerollTeamNames,
    setMaxTeamSize,
    setReadSeconds,
    setStartSeconds,
    setTeamCount,
    setTimerSeconds,
    setTopic,
    START_SECONDS_CHOICES,
    TEAM_COUNT_CHOICES,
    TEAM_SIZE_CHOICES,
    TIMER_CHOICES,
    type Room,
} from "./roomService";
import { linkButton, primaryButton, Screen } from "./ui";

type Props = {
    room: Room;
    onExit: () => void;
    onLogout: () => void;
};

const select = "bg-white text-black px-3 py-1";

// Host-only configuration. The code is hidden on purpose: players join from the lobby.
export default function HostSetup({ room, onExit, onLogout }: Props) {
    return (
        <Screen>
            <h1 className="text-4xl font-bold">Set up the game</h1>

            <div className="flex flex-wrap justify-center gap-3 max-w-3xl">
                {TOPICS.map((topic) => (
                    <button
                        key={topic.id}
                        onClick={() => setTopic(room.code, topic.id)}
                        className={`w-40 p-3 text-left cursor-pointer border-4 ${
                            room.topic === topic.id
                                ? "bg-yellow-300 text-black border-black"
                                : "bg-white text-[#2a3698] border-transparent hover:border-yellow-300"
                        }`}
                    >
                        <span className="block font-bold text-lg leading-tight">{topic.name}</span>
                        <span className="block text-sm opacity-80 mt-1">{topic.tagline}</span>
                    </button>
                ))}
            </div>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-2xl">
                <label className="flex items-center gap-3">
                    Reading time:
                    <select value={room.readSeconds} onChange={(e) => setReadSeconds(room.code, Number(e.target.value))} className={select}>
                        {READ_SECONDS_CHOICES.map((n) => (
                            <option key={n} value={n}>
                                {n} s
                            </option>
                        ))}
                    </select>
                </label>
                <label className="flex items-center gap-3">
                    Answer time:
                    <select value={room.timerSeconds} onChange={(e) => setTimerSeconds(room.code, Number(e.target.value))} className={select}>
                        {TIMER_CHOICES.map((n) => (
                            <option key={n} value={n}>
                                {n} s
                            </option>
                        ))}
                    </select>
                </label>
                <label className="flex items-center gap-3">
                    Teams:
                    <select value={room.teams.length} onChange={(e) => setTeamCount(room.code, Number(e.target.value))} className={select}>
                        {TEAM_COUNT_CHOICES.map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="flex items-center gap-3">
                    Max per team:
                    <select value={room.maxTeamSize} onChange={(e) => setMaxTeamSize(room.code, Number(e.target.value))} className={select}>
                        {TEAM_SIZE_CHOICES.map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="flex items-center gap-3">
                    Start countdown:
                    <select value={room.startSeconds} onChange={(e) => setStartSeconds(room.code, Number(e.target.value))} className={select}>
                        {START_SECONDS_CHOICES.map((n) => (
                            <option key={n} value={n}>
                                {n} s
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <p className="opacity-80 max-w-xl">
                Each question is shown alone for the reading time, then the options appear and the answer time starts.
                When you press Start, players get the start countdown as a last call to pick a team; teams still empty are left out.
            </p>

            <div className="flex flex-wrap justify-center items-center gap-3 max-w-4xl">
                {room.teams.map((team) => (
                    <span key={team.id} className="bg-white text-black font-bold px-3 py-1 flex items-center gap-2">
                        <span className="inline-block w-4 h-4" style={{ background: team.color }} />
                        {team.name}
                    </span>
                ))}
                <button className={linkButton} onClick={() => rerollTeamNames(room.code)}>
                    🎲 New names
                </button>
            </div>

            <button className={primaryButton} onClick={() => openRoom(room.code)}>
                Open room →
            </button>
            <div className="flex gap-6">
                <button className={linkButton} onClick={onExit}>
                    Cancel
                </button>
                <button className={linkButton} onClick={onLogout}>
                    Log out
                </button>
            </div>
        </Screen>
    );
}
