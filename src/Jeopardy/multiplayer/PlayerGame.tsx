import TeamScores from "../TeamScores";
import { LETTERS } from "../questions";
import { activeTileOf, answer, chooseTeam, leaveRoom, nobodyGotIt, winnerOf, type Player, type Room } from "./roomService";
import { linkButton, Message, Screen } from "./ui";
import { useRoom } from "./useRoom";

type Props = {
    code: string;
    playerId: string;
    onExit: () => void;
};

export default function PlayerGame({ code, playerId, onExit }: Props) {
    const room = useRoom(code);

    if (room === undefined) return <Message text="Loading…" />;
    if (room === null) return <Message text="The host closed this room." onBack={onExit} />;

    const player = room.players[playerId];
    if (!player) return <Message text="You are no longer in this room." onBack={onExit} />;

    async function leave() {
        await leaveRoom(code, playerId);
        onExit();
    }

    const hasTeam = player.team !== null && player.team < room.teams.length;

    return (
        <Screen>
            <header className="w-full max-w-md flex justify-between text-lg">
                <span>
                    <b>{player.name}</b>
                    {hasTeam && ` · ${room.teams[player.team!].name}`}
                </span>
                <span className="tracking-widest">Room {room.code}</span>
            </header>

            {!hasTeam || room.status === "lobby" ? (
                <TeamPicker room={room} player={player} />
            ) : room.status === "question" ? (
                <AnswerPicker room={room} player={player} />
            ) : room.status === "end" ? (
                <p className="text-4xl font-bold">Game over!</p>
            ) : (
                <p className="text-3xl font-bold">Look at the big screen. Waiting for a question…</p>
            )}

            {room.status !== "lobby" && <TeamScores teams={room.teams} />}

            <button className={linkButton} onClick={leave}>
                Leave game
            </button>
        </Screen>
    );
}

function TeamPicker({ room, player }: { room: Room; player: Player }) {
    return (
        <>
            <h2 className="text-3xl font-bold">Pick your team</h2>
            <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                {room.teams.map((team, i) => (
                    <button
                        key={team.name}
                        onClick={() => chooseTeam(room.code, player.id, i)}
                        className={`text-2xl font-bold py-4 cursor-pointer border-4 ${
                            player.team === i ? "bg-yellow-300 text-black border-black" : "bg-white text-[#2a3698] border-transparent"
                        }`}
                    >
                        {team.name}
                    </button>
                ))}
            </div>
            {player.team !== null && room.status === "lobby" && (
                <p className="text-xl opacity-80">Waiting for the host to start…</p>
            )}
        </>
    );
}

function AnswerPicker({ room, player }: { room: Room; player: Player }) {
    const tile = activeTileOf(room);
    if (!tile || !room.activeTile) return null;

    const mine = room.answers.find((a) => a.playerId === player.id);
    const winner = winnerOf(room);
    const done = winner !== null || nobodyGotIt(room);
    const teamName = (team: number | null) => (team !== null ? room.teams[team]?.name : "no team");

    return (
        <>
            <div>
                <p className="text-xl opacity-80">
                    {room.board[room.activeTile.col].name} — {tile.value}
                </p>
                <p className="text-2xl font-bold">{tile.question}</p>
            </div>

            <div className="grid gap-3 w-full max-w-md">
                {tile.options.map((option, i) => {
                    const picked = mine?.choice === option;
                    const isAnswer = done && option === tile.answer;
                    return (
                        <button
                            key={option}
                            onClick={() => answer(room.code, player.id, option)}
                            disabled={!!mine || done}
                            className={`text-2xl font-bold py-4 px-3 text-left border-4 cursor-pointer disabled:cursor-not-allowed ${
                                isAnswer
                                    ? "bg-yellow-300 text-black border-black"
                                    : picked
                                      ? "bg-red-600 text-white border-black"
                                      : `bg-white text-[#2a3698] border-transparent ${mine || done ? "opacity-50" : "hover:bg-yellow-300"}`
                            }`}
                        >
                            <span className="mr-3">{LETTERS[i]}</span>
                            {option}
                        </button>
                    );
                })}
            </div>

            {winner ? (
                <p className="text-2xl">
                    {winner.playerId === player.id ? (
                        <b className="text-yellow-300">Correct! +{tile.value} for {teamName(winner.team)}</b>
                    ) : (
                        <>
                            <b>{winner.name}</b> ({teamName(winner.team)}) got it first.
                        </>
                    )}
                    <br />
                    Waiting for the next question…
                </p>
            ) : nobodyGotIt(room) ? (
                <p className="text-2xl">Nobody got it. Waiting for the next question…</p>
            ) : mine ? (
                <p className="text-2xl">Wrong answer. Waiting for the others…</p>
            ) : (
                <p className="text-xl opacity-80">Pick an answer. The first correct one wins the points!</p>
            )}
        </>
    );
}
