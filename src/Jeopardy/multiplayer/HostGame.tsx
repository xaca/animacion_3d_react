import Board from "../Board";
import Countdown from "../Countdown";
import EndScreen from "../EndScreen";
import QuestionModal from "../QuestionModal";
import TeamScores from "../TeamScores";
import HostLobby from "./HostLobby";
import HostSetup from "./HostSetup";
import {
    activeTileOf,
    backToLobby,
    changeScore,
    closeTile,
    deleteRoom,
    nobodyGotIt,
    openTile,
    optionsVisible,
    revealAnswer,
    showOptions,
    winnerOf,
    type Room,
} from "./roomService";
import { linkButton, Message } from "./ui";
import { useRoom } from "./useRoom";

type Props = {
    code: string;
    onExit: () => void;
    onLogout: () => void;
};

export default function HostGame({ code, onExit, onLogout }: Props) {
    const room = useRoom(code);

    if (room === undefined) return <Message text="Loading…" />;
    if (room === null) return <Message text="This room no longer exists." onBack={onExit} />;

    async function closeRoom() {
        await deleteRoom(code);
        onExit();
    }

    if (room.status === "setup") return <HostSetup room={room} onExit={closeRoom} onLogout={onLogout} />;
    if (room.status === "lobby") return <HostLobby room={room} onExit={closeRoom} />;
    if (room.status === "end") {
        const members = (i: number) =>
            Object.values(room.players)
                .filter((p) => p.team === room.teams[i].id)
                .map((p) => p.name);
        return <EndScreen teams={room.teams} membersOf={members} onPlayAgain={() => backToLobby(code)} />;
    }

    const active = room.activeTile;
    const activeTile = active ? room.board[active.col].tiles[active.row] : null;

    return (
        <div className="min-h-screen bg-[#2a3698] p-2 pb-6">
            <p className="text-white text-right text-lg pr-2">
                Room <span className="font-bold tracking-widest">{room.code}</span>
            </p>
            {room.status === "question" && active && activeTile ? (
                <HostQuestion key={`${active.col}-${active.row}`} room={room} code={code} />
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

// Keyed per tile by the caller. The reading countdown here is what reveals the
// options to everyone (showOptions), so the host tab must stay open.
function HostQuestion({ room, code }: { room: Room; code: string }) {
    const active = room.activeTile!;
    const tile = room.board[active.col].tiles[active.row];
    const questionOver = room.revealed || winnerOf(room) !== null || nobodyGotIt(room);
    const reading = !optionsVisible(room) && !questionOver;

    return (
        <QuestionModal
            categoryName={room.board[active.col].name}
            tile={tile}
            onClose={() => closeTile(code)}
            revealed={questionOver}
            onReveal={() => revealAnswer(code)}
            optionsHidden={reading}
            timer={
                reading && room.readEndsAt !== null ? (
                    <div className="flex flex-col items-center gap-2 w-full">
                        <Countdown endsAt={room.readEndsAt} totalSeconds={room.readSeconds} label="Options in" onDone={() => showOptions(code)} />
                        <button className={linkButton} onClick={() => showOptions(code)}>
                            Show options now
                        </button>
                    </div>
                ) : // Unmounts when the question ends, so the timeout reveal only
                // fires if nobody won before the countdown reached zero
                !questionOver && room.questionEndsAt !== null ? (
                    <Countdown endsAt={room.questionEndsAt} totalSeconds={room.timerSeconds} onDone={() => revealAnswer(code)} />
                ) : null
            }
            closeLabel="Next question"
            hint="Points were added automatically. Use + / − below to fix them if needed."
        >
            {!reading && <AnswerList room={room} />}
        </QuestionModal>
    );
}

function AnswerList({ room }: { room: Room }) {
    const winner = winnerOf(room);
    const teamName = (team: string | null) => room.teams.find((t) => t.id === team)?.name ?? "no team";

    return (
        <div className="flex flex-col gap-2">
            {winner ? (
                <p className="text-3xl md:text-4xl font-bold text-yellow-300">
                    {winner.name} ({teamName(winner.team)}) got it! +{activeTileOf(room)?.value}
                </p>
            ) : nobodyGotIt(room) || room.revealed ? (
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
