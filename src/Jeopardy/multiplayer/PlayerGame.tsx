import Countdown from "../Countdown";
import Podium from "../Podium";
import TeamScores from "../TeamScores";
import { LETTERS } from "../questions";
import { activeTileOf, answer, chooseTeam, leaveRoom, nobodyGotIt, optionsVisible, teamAnswerOf, winnerOf, type Player, type Room } from "./roomService";
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

            {room.status === "setup" ? (
                <p className="text-3xl font-bold">The host is changing the settings… hang on.</p>
            ) : !hasTeam || room.status === "lobby" ? (
                <TeamPicker room={room} player={player} />
            ) : room.status === "question" && room.activeTile ? (
                <AnswerPicker key={`${room.activeTile.col}-${room.activeTile.row}`} room={room} player={player} />
            ) : room.status === "end" ? (
                <>
                    <p className="text-4xl font-bold">Game over!</p>
                    <Podium teams={room.teams} />
                </>
            ) : (
                <p className="text-3xl font-bold">Look at the big screen. Waiting for a question…</p>
            )}

            {room.status !== "lobby" && room.status !== "end" && <TeamScores teams={room.teams} />}

            <button className={linkButton} onClick={leave}>
                Leave game
            </button>
        </Screen>
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
                    const mine = player.team === team.id;
                    const full = size >= room.maxTeamSize && !mine;
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
                                ({size}/{room.maxTeamSize}{full ? ", full" : ""})
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
                    <Countdown endsAt={room.startsAt} totalSeconds={room.startSeconds} />
                </div>
            ) : (
                player.team !== null && room.status === "lobby" && <p className="text-xl opacity-80">Waiting for the host to start…</p>
            )}
        </>
    );
}

function AnswerPicker({ room, player }: { room: Room; player: Player }) {
    const tile = activeTileOf(room);
    if (!tile || !room.activeTile) return null;

    const mine = room.answers.find((a) => a.playerId === player.id);
    // One try per team: a teammate's answer locks the question for you too
    const teamAnswer = teamAnswerOf(room, player);
    const winner = winnerOf(room);
    // revealed: the host showed the answer (or time ran out), so the question is over
    const done = winner !== null || nobodyGotIt(room) || room.revealed;
    // Reading time: question only. The host screen reveals the options for everyone at once.
    const reading = !optionsVisible(room) && !done;
    const teamName = (team: string | null) => room.teams.find((t) => t.id === team)?.name ?? "no team";

    return (
        <>
            <div>
                <p className="text-xl opacity-80">
                    {room.board[room.activeTile.col].name} — {tile.value}
                </p>
                <p className="text-2xl font-bold">{tile.question}</p>
                {tile.code && <pre className="bg-black/40 text-left text-base px-3 py-2 mt-2 overflow-x-auto">{tile.code}</pre>}
            </div>

            {reading ? (
                <>
                    {room.readEndsAt !== null && <Countdown endsAt={room.readEndsAt} totalSeconds={room.readSeconds} label="Options in" />}
                    <p className="text-xl opacity-80">Read the question and get ready…</p>
                </>
            ) : (
                !done && room.questionEndsAt !== null && <Countdown endsAt={room.questionEndsAt} totalSeconds={room.timerSeconds} />
            )}

            {!reading && (
            <div className="grid gap-3 w-full max-w-md">
                {tile.options.map((option, i) => {
                    const picked = mine?.choice === option;
                    const isAnswer = done && option === tile.answer;
                    return (
                        <button
                            key={option}
                            onClick={() => answer(room.code, player.id, option)}
                            disabled={!!teamAnswer || done}
                            className={`text-2xl font-bold py-4 px-3 text-left border-4 cursor-pointer disabled:cursor-not-allowed ${
                                isAnswer
                                    ? "bg-yellow-300 text-black border-black"
                                    : picked
                                      ? "bg-red-600 text-white border-black"
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

            {reading ? null : winner ? (
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
            ) : room.revealed ? (
                <p className="text-2xl">Time's up! Waiting for the next question…</p>
            ) : mine ? (
                <p className="text-2xl">Wrong answer. Waiting for the other teams…</p>
            ) : teamAnswer ? (
                <p className="text-2xl">
                    <b>{teamAnswer.name}</b> answered for your team. Waiting for the other teams…
                </p>
            ) : (
                <p className="text-xl opacity-80">Answer for your team: the first correct team wins the points!</p>
            )}
        </>
    );
}
