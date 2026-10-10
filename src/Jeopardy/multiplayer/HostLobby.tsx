import { setTeamCount, startGame, type Room } from "./roomService";
import { linkButton, primaryButton, Screen } from "./ui";

type Props = {
    room: Room;
    onExit: () => void;
};

export default function HostLobby({ room, onExit }: Props) {
    const players = Object.values(room.players);
    const unassigned = players.filter((p) => p.team === null);

    return (
        <Screen>
            <p className="text-2xl">Join with this code:</p>
            <p className="text-7xl md:text-8xl font-bold tracking-[0.3em] bg-black/30 px-6 py-2">{room.code}</p>

            <label className="flex items-center gap-3 text-2xl">
                Teams:
                <select
                    value={room.teams.length}
                    onChange={(e) => setTeamCount(room.code, Number(e.target.value))}
                    className="bg-white text-black px-3 py-1"
                >
                    {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                            {n}
                        </option>
                    ))}
                </select>
            </label>

            <div className="flex flex-wrap justify-center gap-4">
                {room.teams.map((team, i) => (
                    <div key={team.name} className="bg-white text-black w-44 min-h-32 p-2">
                        <h3 className="font-bold text-xl border-b-4 border-black pb-1 mb-2">{team.name}</h3>
                        <ul>
                            {players
                                .filter((p) => p.team === i)
                                .map((p) => (
                                    <li key={p.id}>{p.name}</li>
                                ))}
                        </ul>
                    </div>
                ))}
            </div>

            {unassigned.length > 0 && (
                <p className="opacity-80">Choosing a team: {unassigned.map((p) => p.name).join(", ")}</p>
            )}
            {players.length === 0 && <p className="opacity-80">Waiting for players…</p>}

            <button className={primaryButton} onClick={() => startGame(room.code)}>
                Start game
            </button>
            <button className={linkButton} onClick={onExit}>
                Close room
            </button>
        </Screen>
    );
}
