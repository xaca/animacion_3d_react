import Board from "../Board";
import EndScreen from "../EndScreen";
import QuestionModal from "../QuestionModal";
import TeamScores from "../TeamScores";
import HostLobby from "./HostLobby";
import {
    activeTileOf,
    backToLobby,
    changeScore,
    closeTile,
    deleteRoom,
    nobodyGotIt,
    openTile,
    winnerOf,
    type Room,
} from "./roomService";
import { Message } from "./ui";
import { useRoom } from "./useRoom";

type Props = {
    code: string;
    onExit: () => void;
};

export default function HostGame({ code, onExit }: Props) {
    const room = useRoom(code);

    if (room === undefined) return <Message text="Loading…" />;
    if (room === null) return <Message text="This room no longer exists." onBack={onExit} />;

    async function closeRoom() {
        await deleteRoom(code);
        onExit();
    }

    if (room.status === "lobby") return <HostLobby room={room} onExit={closeRoom} />;
    if (room.status === "end") return <EndScreen teams={room.teams} onPlayAgain={() => backToLobby(code)} />;

    const active = room.activeTile;
    const activeTile = active ? room.board[active.col].tiles[active.row] : null;

    return (
        <div className="min-h-screen bg-[#2a3698] p-2 pb-6">
            <p className="text-white text-right text-lg pr-2">
                Room <span className="font-bold tracking-widest">{room.code}</span>
            </p>
            {room.status === "question" && active && activeTile ? (
                <QuestionModal
                    key={`${active.col}-${active.row}`}
                    categoryName={room.board[active.col].name}
                    tile={activeTile}
                    onClose={() => closeTile(code)}
                    revealed={winnerOf(room) !== null || nobodyGotIt(room)}
                    closeLabel="Next question"
                    hint="Points were added automatically. Use + / − below to fix them if needed."
                >
                    <AnswerList room={room} />
                </QuestionModal>
            ) : (
                <Board board={room.board} onSelect={(col, row) => openTile(code, col, row)} />
            )}
            <TeamScores
                teams={room.teams}
                points={room.status === "question" ? activeTile?.value : undefined}
                onChange={(team, delta) => changeScore(code, team, delta)}
            />
        </div>
    );
}

function AnswerList({ room }: { room: Room }) {
    const winner = winnerOf(room);
    const teamName = (team: number | null) => (team !== null ? room.teams[team]?.name : "no team");

    return (
        <div className="flex flex-col gap-2">
            {winner ? (
                <p className="text-3xl md:text-4xl font-bold text-yellow-300">
                    {winner.name} ({teamName(winner.team)}) got it! +{activeTileOf(room)?.value}
                </p>
            ) : nobodyGotIt(room) ? (
                <p className="text-3xl font-bold text-yellow-300">Nobody got it!</p>
            ) : (
                <p className="text-xl opacity-80">Waiting for answers…</p>
            )}
            {room.answers.length > 0 && (
                <ul className="text-xl">
                    {room.answers.map((a) => (
                        <li key={a.playerId} className={a.correct ? "font-bold" : "opacity-70"}>
                            {a.correct ? "✔" : "✘"} {a.name} ({teamName(a.team)})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
