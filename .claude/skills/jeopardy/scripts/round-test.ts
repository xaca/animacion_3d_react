// Jeopardy self-check. Run from the repo root with:  npm run test:jeopardy
//
// 1. Question content (offline): every topic has 5 categories x 5 levels x 2+ questions,
//    each with 3 wrong options, all different from the answer.
// 2. Question collection (Firestore): every topic is seeded.
// 3. Live round (Firestore): creates a throwaway room, plays it with 6 fake players, deletes it.
//    Checks: setup blocks joins until openRoom, host sets team count / max size / start countdown / new names,
//    full-team rule, Start runs the countdown, empty teams dropped at start, loose players rejoin mid-game,
//    board built from the topic, reading time before the options, every team answers once (first teammate
//    counts), points for every correct team given once at the reveal, reveal locks answers.
//
// Exits with code 1 if any check fails.

import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../src/lib/firebase";
import { VALUES } from "../../../../src/Jeopardy/questions";
import { TOPIC_CONTENT } from "../../../../src/Jeopardy/content";
import { TOPICS } from "../../../../src/Jeopardy/topics";
import * as rs from "../../../../src/Jeopardy/multiplayer/roomService";

let failures = 0;
function check(ok: boolean, label: string) {
    console.log(`${ok ? "PASS" : "FAIL"}  ${label}`);
    if (!ok) failures++;
}

const words = (s: string) => s.trim().split(/\s+/).length;

// Same rule as the seed script: the correct answer must not be a length giveaway
function lengthGiveaway(answer: string, wrong: string[]): string | null {
    const aw = words(answer);
    const ac = answer.length;
    const ww = wrong.map(words);
    const wc = wrong.map((w) => w.length);
    if (ww.every((n) => aw > n) && ac > 1.5 * Math.max(...wc)) return "longest";
    if (ww.every((n) => aw < n) && 1.5 * ac < Math.min(...wc)) return "shortest";
    return null;
}

// ----- 1. Question content ---------------------------------------------------

for (const topic of TOPIC_CONTENT) {
    const categories = Object.entries(topic.categories);
    check(categories.length === 5, `${topic.id}: has 5 categories`);
    check(TOPICS.some((t) => t.id === topic.id), `${topic.id}: listed in topics.ts`);
    for (const [category, levels] of categories) {
        check(levels.length === VALUES.length, `${topic.id} / ${category}: has ${VALUES.length} difficulty levels`);
        levels.forEach((questions, level) => {
            check(questions.length >= 2, `${topic.id} / ${category} level ${level + 1}: has at least 2 questions`);
            for (const q of questions) {
                const options = [q.answer, ...q.wrong].map((o) => o.trim().toLowerCase());
                const ok = q.wrong.length === 3 && new Set(options).size === 4;
                if (!ok) check(false, `${topic.id} / ${category}: "${q.question}" needs 3 unique wrong options`);
                const g = lengthGiveaway(q.answer, q.wrong);
                if (g) check(false, `${topic.id} / ${category}: "${q.question}" answer is clearly the ${g} option`);
            }
        });
    }
}
console.log(`Content: ${TOPIC_CONTENT.flatMap((t) => Object.values(t.categories)).flat(2).length} questions checked`);

// ----- 2. Seeded collection --------------------------------------------------

for (const topic of TOPICS) {
    const snap = await getDocs(query(collection(db, "questions"), where("topic", "==", topic.id)));
    check(snap.size >= 50, `Firestore has ${topic.id} questions (${snap.size})`);
}

// ----- 3. Live round ---------------------------------------------------------

const read = async (code: string) => (await getDoc(doc(db, "rooms", code))).data() as rs.Room;
const scores = (room: rs.Room) => room.teams.map((t) => t.score).join(",");
const names = (room: rs.Room) => room.teams.map((t) => t.name);
const unique = (items: string[]) => new Set(items).size === items.length;

const code = await rs.createRoom();
console.log(`Room ${code} created`);
try {
    // Setup: 3 random teams by default, nobody can join yet, new names keep the ids, count can grow
    let room = await read(code);
    check(room.status === "setup", "fresh room starts in setup");
    check(room.version === rs.APP_VERSION, `room stores the build version (${room.version})`);
    check(room.teams.length === 3 && room.maxTeamSize === 3 && room.startSeconds === 30, "fresh room has 3 teams, max 3 per team, 30 s start countdown");
    await rs.setStartSeconds(code, 10);
    const rejected = await rs.joinRoom(code, "Zed").then(
        () => false,
        (e) => e instanceof Error && e.message === rs.ROOM_NOT_OPEN
    );
    check(rejected, "joining is rejected while the host is in setup");
    check(unique(names(room)) && room.teams.every((t) => t.color), `teams have unique names and a color (${names(room).join(", ")})`);
    const before = room.teams;
    await rs.rerollTeamNames(code);
    room = await read(code);
    check(
        room.teams.every((t, i) => t.id === before[i].id && t.name !== before[i].name) && unique(names(room)),
        `new names keep the ids (${names(room).join(", ")})`
    );
    await rs.setTeamCount(code, 4);
    room = await read(code);
    check(room.teams.length === 4 && unique(names(room)), "team count raised to 4 with unique names");
    const [alpha, beta, gamma, delta] = room.teams.map((t) => t.id);
    await rs.openRoom(code);
    room = await read(code);
    check(room.status === "lobby", "openRoom moves the room to the lobby");

    // Players: Ana, Dan, Eve -> alpha (Fay bounces: full), Ben -> beta, Cam -> gamma
    const ana = await rs.joinRoom(code, "Ana");
    const ben = await rs.joinRoom(code, "Ben");
    const cam = await rs.joinRoom(code, "Cam");
    const dan = await rs.joinRoom(code, "Dan");
    const eve = await rs.joinRoom(code, "Eve");
    const fay = await rs.joinRoom(code, "Fay");
    for (const p of [ana, dan, eve, fay]) await rs.chooseTeam(code, p.id, alpha);
    await rs.chooseTeam(code, ben.id, beta);
    await rs.chooseTeam(code, cam.id, gamma);

    room = await read(code);
    check(room.players[fay.id].team === null, "a full team cannot be joined");
    check(rs.startProblem(room) === null, "Start is available with 2+ teams with players");

    // Test players: a bot joins the emptiest team (delta, 0 players); removeBots removes only bots
    await rs.addBot(code);
    room = await read(code);
    const bots = Object.values(room.players).filter((p) => p.bot);
    check(bots.length === 1 && bots[0].team === delta && bots[0].name.includes("Bot"), "addBot puts a test player on the emptiest team");
    await rs.removeBots(code);
    room = await read(code);
    check(!Object.values(room.players).some((p) => p.bot) && Object.keys(room.players).length === 6, "removeBots removes only the test players");

    await rs.setMaxTeamSize(code, 2);
    room = await read(code);
    check(rs.startProblem(room) !== null, "lowering the max below a team's size blocks start");
    await rs.setMaxTeamSize(code, 3);

    await rs.chooseTeam(code, fay.id, delta);
    await rs.chooseTeam(code, fay.id, gamma);
    room = await read(code);
    check(room.players[fay.id].team === gamma, "switching teams moves the player");

    await rs.chooseTeam(code, fay.id, delta);
    await rs.setTeamCount(code, 3);
    room = await read(code);
    check(room.teams.length === 3 && room.players[fay.id].team === null, "lowering the count unassigns the removed team's players");
    // 4 teams again; the 4th stays empty and Fay stays without a team until the game starts
    await rs.setTeamCount(code, 4);
    room = await read(code);
    const delta2 = room.teams[3].id;

    await rs.startCountdown(code);
    room = await read(code);
    const left = room.startsAt === null ? 0 : room.startsAt - Date.now();
    check(left > 5000 && left <= 10000, `Start runs the configured 10 s countdown (${Math.round(left / 1000)} s left)`);
    await rs.cancelCountdown(code);
    room = await read(code);
    check(room.startsAt === null, "the host can cancel the countdown");
    await rs.startCountdown(code);
    await rs.startGame(code);

    room = await read(code);
    check(room.status === "board" && room.startsAt === null, "game started and the countdown cleared");
    check(room.teams.length === 3 && !room.teams.some((t) => t.id === delta2), "the empty team was eliminated");
    check(room.players[fay.id].team === null, "a player without a team stays in the room");
    await rs.chooseTeam(code, fay.id, gamma);
    room = await read(code);
    check(room.players[fay.id].team === gamma, "a loose player can join a team mid-game");

    check(room.board.length === 5, `board has 5 categories (got ${room.board.length})`);
    check(room.board.every((c) => c.tiles.length === VALUES.length), "every category has 5 tiles");
    check(rs.tilesLeft(room) === 25, "25 tiles to play at the start");

    // Teams now: alpha (Ana, Dan, Eve), beta (Ben), gamma (Cam, Fay).
    // Round 1 (reading time): options hidden and answers rejected until the host's showOptions;
    // then Ana (alpha) and Ben (beta) answer correctly at the same moment, Cam (gamma) wrong
    await rs.setReadSeconds(code, 10);
    await rs.openTile(code, 0, 1);
    room = await read(code);
    check(
        room.optionsAt === null && room.questionEndsAt === null && room.readEndsAt !== null && room.readEndsAt > Date.now(),
        "openTile starts the reading time with the options hidden and no answer timer"
    );
    check(!rs.isLastTile(room), "the first question is not the last");
    const tile = rs.activeTileOf(room)!;
    const wrong = tile.options.find((o) => o !== tile.answer)!;
    await rs.answer(code, ana.id, tile.answer); // too early
    room = await read(code);
    check(room.answers.length === 0, "answers during the reading time are ignored");
    await rs.showOptions(code);
    room = await read(code);
    check(
        rs.optionsVisible(room) && room.optionsAt !== null && room.questionEndsAt === room.optionsAt + room.timerSeconds * 1000,
        "showOptions reveals the options and starts the answer timer"
    );
    await Promise.all([rs.answer(code, ana.id, tile.answer), rs.answer(code, ben.id, tile.answer), rs.answer(code, cam.id, wrong)]);
    await rs.answer(code, dan.id, wrong); // alpha already answered through Ana
    room = await read(code);
    check(room.answers.length === 3, `one answer per team, all teams can answer (got ${room.answers.length})`);
    check(room.answers.find((a) => a.team === alpha)?.playerId === ana.id, "the first teammate's answer counts for the team");
    check(scores(room) === "0,0,0", "no points before the reveal");
    check(rs.allTeamsAnswered(room), "allTeamsAnswered once every team with players answered");
    // Timer and "all answered" can both fire the reveal: points must be given once
    await Promise.all([rs.revealAnswer(code), rs.revealAnswer(code)]);
    room = await read(code);
    const expected = room.teams.map((t) => (t.id === alpha || t.id === beta ? tile.value : 0)).join(",");
    check(room.revealed && scores(room) === expected, `both correct teams scored ${tile.value} exactly once, the wrong one 0 (scores ${scores(room)})`);

    // Next question clears the answers
    await rs.closeTile(code);
    room = await read(code);
    check(room.status === "board" && room.answers.length === 0, "Next question returns to the board with no answers");
    check(rs.tilesLeft(room) === 24, "a closed tile is consumed");

    // Round 2 (reading time 0): options at once; only Ben answers (wrong); a late answer after the reveal is ignored
    await rs.setReadSeconds(code, 0);
    await rs.openTile(code, 1, 0);
    room = await read(code);
    check(rs.optionsVisible(room), "reading time 0 shows the options at once");
    const tile2 = rs.activeTileOf(room)!;
    const wrong2 = tile2.options.find((o) => o !== tile2.answer)!;
    await rs.answer(code, ben.id, wrong2);
    room = await read(code);
    check(!rs.allTeamsAnswered(room) && rs.answerProgress(room).answered === 1, "progress counts 1 of 3 teams");
    await rs.revealAnswer(code);
    await rs.answer(code, ana.id, tile2.answer); // too late: the host closed the question
    room = await read(code);
    check(room.answers.length === 1, "answers after the reveal are ignored");
    check(scores(room) === expected, "wrong and missing answers cost no points");
    await rs.closeTile(code);

    // A player without a team can't answer
    await rs.openTile(code, 2, 0);
    const zoe = await rs.joinRoom(code, "Zoe");
    room = await read(code);
    const tile3 = rs.activeTileOf(room)!;
    await rs.answer(code, zoe.id, tile3.answer);
    room = await read(code);
    check(room.answers.length === 0, "a player without a team can't answer");
    await rs.closeTile(code);

    // Mid-game leavers: a team vanishes with its last member; no teams left -> game over
    await rs.leaveRoom(code, ben.id);
    room = await read(code);
    check(
        room.teams.length === 2 && !room.teams.some((t) => t.id === beta) && scores(room) === "400,0",
        `beta vanished when its last member left; other scores kept (${scores(room)})`
    );
    for (const p of [ana, dan, eve, cam]) await rs.leaveRoom(code, p.id);
    room = await read(code);
    check(room.status === "board" && room.teams.length === 1, "the game continues while one team still has players");
    await rs.leaveRoom(code, fay.id);
    room = await read(code);
    check(
        room.status === "end" && room.teams.length === 0 && room.players[zoe.id] !== undefined,
        "all teams gone -> game over (a teamless player doesn't keep it alive)"
    );
} catch (error) {
    check(false, `round crashed: ${error}`);
} finally {
    await rs.deleteRoom(code);
    console.log(`Room ${code} deleted`);
}

console.log(failures === 0 ? "\nAll checks passed" : `\n${failures} check(s) failed`);
process.exit(failures === 0 ? 0 : 1);
