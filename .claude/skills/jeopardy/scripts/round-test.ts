// Jeopardy self-check. Run from the repo root with:  npm run test:jeopardy
//
// 1. Question bank (offline): every question has 3 wrong options, all different from the answer.
// 2. Live round (Firestore): creates a throwaway room, plays it with 3 fake players, deletes it.
//    Checks: wrong answer costs nothing, two simultaneous correct answers -> exactly one winner,
//    points go to the winner's team, "Next question" clears answers, all-wrong -> nobodyGotIt.
//
// Exits with code 1 if any check fails.

import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../src/lib/firebase";
import { BANK, VALUES } from "../../../../src/Jeopardy/questions";
import * as rs from "../../../../src/Jeopardy/multiplayer/roomService";

let failures = 0;
function check(ok: boolean, label: string) {
    console.log(`${ok ? "PASS" : "FAIL"}  ${label}`);
    if (!ok) failures++;
}

// ----- 1. Question bank ------------------------------------------------------

for (const [category, levels] of Object.entries(BANK)) {
    check(levels.length === VALUES.length, `${category}: has ${VALUES.length} difficulty levels`);
    levels.forEach((questions, level) => {
        check(questions.length > 0, `${category} level ${level + 1}: has at least one question`);
        for (const q of questions) {
            const options = [q.answer, ...q.wrong];
            const ok = q.wrong.length === 3 && new Set(options).size === 4;
            if (!ok) check(false, `${category}: "${q.question}" needs 3 wrong options, all unique and different from the answer`);
        }
    });
}
console.log(`Question bank: ${Object.values(BANK).flat(2).length} questions checked`);

// ----- 2. Live round ---------------------------------------------------------

const read = async (code: string) => (await getDoc(doc(db, "rooms", code))).data() as rs.Room;
const scores = (room: rs.Room) => room.teams.map((t) => t.score).join(",");

const code = await rs.createRoom();
console.log(`Room ${code} created`);
try {
    const ana = await rs.joinRoom(code, "Ana");
    const ben = await rs.joinRoom(code, "Ben");
    const cam = await rs.joinRoom(code, "Cam");
    await rs.chooseTeam(code, ana.id, 0);
    await rs.chooseTeam(code, ben.id, 1);
    await rs.chooseTeam(code, cam.id, 2);
    await rs.startGame(code);

    // Round 1: Cam wrong, then Ana and Ben answer correctly at the same moment
    await rs.openTile(code, 0, 1);
    let room = await read(code);
    const tile = rs.activeTileOf(room)!;
    const wrong = tile.options.find((o) => o !== tile.answer)!;
    await rs.answer(code, cam.id, wrong);
    await Promise.all([rs.answer(code, ana.id, tile.answer), rs.answer(code, ben.id, tile.answer)]);
    room = await read(code);
    const winner = rs.winnerOf(room);
    check(room.answers.filter((a) => a.correct).length === 1, "exactly one correct answer recorded");
    check(winner !== null && (winner.name === "Ana" || winner.name === "Ben"), `winner is Ana or Ben (got ${winner?.name})`);
    const expected = room.teams.map((_, i) => (i === winner?.team ? tile.value : 0)).join(",");
    check(scores(room) === expected, `only the winner's team scored ${tile.value} (scores ${scores(room)})`);

    // Next question clears the answers
    await rs.closeTile(code);
    room = await read(code);
    check(room.status === "board" && room.answers.length === 0, "Next question returns to the board with no answers");

    // Round 2: everybody wrong
    await rs.openTile(code, 1, 0);
    room = await read(code);
    const tile2 = rs.activeTileOf(room)!;
    const wrong2 = tile2.options.find((o) => o !== tile2.answer)!;
    for (const p of [ana, ben, cam]) await rs.answer(code, p.id, wrong2);
    room = await read(code);
    check(rs.nobodyGotIt(room), "all wrong -> nobodyGotIt");
    check(scores(room) === expected, "wrong answers cost no points");
} catch (error) {
    check(false, `round crashed: ${error}`);
} finally {
    await rs.deleteRoom(code);
    console.log(`Room ${code} deleted`);
}

console.log(failures === 0 ? "\nAll checks passed" : `\n${failures} check(s) failed`);
process.exit(failures === 0 ? 0 : 1);
