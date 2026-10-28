// TingoTango end-to-end test against the live Firestore (npm run test:tingo): validates
// the content offline, checks the seeded bank, then plays real games in throwaway rooms —
// the stepped setup, the JSON uploader and every game rule that existed before it.
// Everything it creates (rooms, the test topic) is deleted at the end. Exit 1 on failure.
import { doc, setDoc, terminate } from "firebase/firestore";
import { db } from "../src/lib/firebase";
import { TINGO_CONTENT } from "../src/TingoTango/content";
import { parseUpload, validateTopic } from "../src/TingoTango/contentValidation";
import { deleteCustomTopic, subscribeCustomTopics, uploadTopic } from "../src/TingoTango/customTopics";
import { buildQueue, firestoreQuestionSource } from "../src/TingoTango/questionSource";
import { MAX_THROWS, resolveTies, survivorsOf } from "../src/TingoTango/tiebreak";
import * as rs from "../src/TingoTango/roomService";
import { TOPICS } from "../src/TingoTango/topics";
import { POINTS, rankPlayers, type Tiebreak, type TingoPlayer } from "../src/TingoTango/types";

let fails = 0;
function check(ok: boolean, label: string) {
    console.log(`${ok ? "✔" : "✘"} ${label}`);
    if (!ok) fails++;
}
const rejected = (p: Promise<unknown>) => p.then(() => false, () => true);
async function room(code: string): Promise<rs.TingoRoom> {
    const r = await rs.fetchRoom(code);
    if (!r) throw new Error(`room ${code} vanished`);
    return r;
}

const rooms: string[] = [];
let topicId = "";

async function main() {
    // ----- Content, offline ------------------------------------------------
    console.log("\n# Content");
    for (const t of TINGO_CONTENT) check(validateTopic(t, t.id).length === 0, `seed content ${t.id} is valid`);
    const qa = (i: number) => ({ question: `Pregunta de prueba ${i}`, answer: `Respuesta ${i}`, wrong: [`Otra ${i}a`, `Otra ${i}b`, `Otra ${i}c`] });
    const upload = parseUpload({ questions: Array.from({ length: 6 }, (_, i) => qa(i)) });
    check(upload.errors.length === 0, "flat upload JSON is valid");
    check(parseUpload({ questions: [qa(1), qa(2)] }).errors.length > 0, "fewer than 5 questions rejected");
    check(parseUpload({ questions: [...[1, 2, 3, 4].map(qa), { question: "x", answer: "a", wrong: ["b"] }] }).errors.length > 0, "bad question rejected");
    check(parseUpload(TINGO_CONTENT[0]).errors.length === 0, "Jeopardy-style `categories` JSON accepted too");

    // ----- ✊✋✌️ tie-break, offline -----------------------------------------
    console.log("\n# Tie-break");
    const team = (...scores: number[]): TingoPlayer[] => scores.map((score, i) => ({ id: `p${i}`, name: `P${i}`, score }));
    // The stored throws must justify every winner: replaying them leaves exactly that player
    const justified = (tbs: Tiebreak[]) =>
        tbs.every((t) => {
            let alive = t.contenders.map((c) => c.id);
            for (const signs of t.throws) {
                if (Object.keys(signs).sort().join() !== [...alive].sort().join()) return false;
                alive = survivorsOf(signs);
            }
            return alive.length === 1 && alive[0] === t.winner;
        });
    const podiumPlaces = (players: TingoPlayer[], tbs: Tiebreak[]) =>
        rankPlayers(players.filter((p) => p.score > 0), tbs).filter((r) => r.place <= 3).map((r) => r.place).join();
    check(resolveTies(team(300, 200, 100)).length === 0, "no tie → no tie-break, podium as it is");
    let allOk = true;
    for (let i = 0; i < 300; i++) {
        const two = team(200, 200, 100);
        const three = team(100, 100, 100);
        const four = team(300, 100, 100, 100, 100);
        const [a, b, c] = [resolveTies(two), resolveTies(three), resolveTies(four)];
        allOk &&= a.length === 1 && a[0].place === 1 && podiumPlaces(two, a) === "1,2,3";
        allOk &&= b.length === 2 && b.map((t) => t.place).join() === "1,2" && podiumPlaces(three, b) === "1,2,3";
        allOk &&= c.length === 2 && c.map((t) => t.place).join() === "2,3" && rankPlayers(four, c).filter((r) => r.place === 4).length === 2;
        allOk &&= justified([...a, ...b, ...c]) && [...a, ...b, ...c].every((t) => t.throws.length <= MAX_THROWS);
    }
    check(allOk, "300 random runs: 2-, 3- and 4-way ties give unique podium places, throws justify each winner");
    check(resolveTies(team(300, 200, 150, 100, 100)).length === 0, "tie below 3rd place is not played (shared 4th)");
    check(resolveTies(team(100, 0, 0)).length === 0, "players on 0 never play a tie-break");

    // ----- Seeded bank -----------------------------------------------------
    console.log("\n# Seeded bank");
    for (const t of TOPICS) {
        const qs = await firestoreQuestionSource.load(t.id);
        check(qs.length >= 25, `${t.id}: ${qs.length} questions in tingo_questions`);
    }

    // ----- Uploader + rules ------------------------------------------------
    console.log("\n# Uploader");
    const up = await uploadTopic(upload.questions, { name: "ZZ Prueba Automatica", tagline: "se borra sola" });
    topicId = up.id;
    check(up.id === "custom-zz-prueba-automatica" && up.count === 6, `uploadTopic → ${up.id} (${up.count})`);
    const seen = await new Promise<boolean>((resolve) => {
        const timer = setTimeout(() => resolve(false), 8000);
        const stop = subscribeCustomTopics((list) => {
            if (!list.some((t) => t.id === topicId)) return;
            clearTimeout(timer);
            queueMicrotask(() => stop());
            resolve(true);
        });
    });
    check(seen, "topic card appears live (tingo_custom_topics)");
    await uploadTopic(upload.questions, { name: "ZZ Prueba Automatica", tagline: "se borra sola" });
    check((await firestoreQuestionSource.load(topicId)).length === 6, "re-upload replaces, never duplicates");
    const q = { topic: "java-fundamentos", category: "x", level: 1, question: "x", answer: "a", wrong: ["b", "c", "d"] };
    check(await rejected(setDoc(doc(db, "tingo_questions", "java-fundamentos__hack"), q)), "rules: seeded bank stays locked");
    check(await rejected(setDoc(doc(db, "tingo_questions", "custom-hack"), { topic: "custom-hack", hacked: true })), "rules: malformed custom question rejected");
    check(await rejected(setDoc(doc(db, "tingo_custom_topics", "custom-a"), { id: "custom-b", name: "x", tagline: "", createdAt: 1 })), "rules: card id must match");

    // ----- Stepped setup ---------------------------------------------------
    console.log("\n# Setup");
    const code = await rs.createRoom();
    rooms.push(code);
    check((await room(code)).status === "setup", `room ${code} starts in setup`);
    check((await rs.joinRoom(code, "Nadie").then(() => "", (e: Error) => e.message)) === rs.ROOM_NOT_OPEN, "joining during setup is rejected");
    await rs.setTopic(code, "not-a-topic");
    check((await room(code)).topic === TOPICS[0].id, "unknown topic ignored");
    await rs.setTopic(code, topicId);
    await rs.setReadSeconds(code, 5);
    await rs.setAnswerSeconds(code, 10);
    await rs.setQuestionCount(code, 5);
    await rs.applySettings(code, { readSeconds: 7 }); // not a choice: ignored
    let r = await room(code);
    check(r.topic === topicId && r.readSeconds === 5 && r.answerSeconds === 10 && r.questionCount === 5, "step settings saved (uploaded topic accepted)");
    await rs.openRoom(code);
    check((await room(code)).status === "lobby", "Abrir sala → lobby");
    const ana = await rs.joinRoom(code, "Ana");
    const beto = await rs.joinRoom(code, "Beto");
    const caro = await rs.joinRoom(code, "Caro");
    await rs.addBot(code);
    check(Object.values((await room(code)).players).filter((p) => p.bot).length === 1, "test player added in the lobby");
    await rs.removeBots(code);
    check(Object.keys((await room(code)).players).length === 3, "test players removed, 3 humans in");
    await rs.backToSetup(code);
    r = await room(code);
    check(r.status === "setup" && Object.keys(r.players).length === 3, "⚙ Ajustes → setup, players stay");
    await rs.setQuestionCount(code, 5);
    await rs.openRoom(code);

    // ----- A full game (rules from before the setup) ------------------------
    console.log("\n# Game");
    await rs.startGame(code, buildQueue(await firestoreQuestionSource.load(topicId)));
    r = await room(code);
    check(r.status === "tingo" && r.queue.length === 5 && r.round === 0, "Empezar: queue trimmed to 5, ball jumping");
    check((r.hops ?? []).length > 0, "hop schedule written for the phones");
    await rs.setReadSeconds(code, 15);
    check((await room(code)).readSeconds === 5, "settings locked once the game started");

    const picked: string[] = [];
    // Round 1: reading time locks answers, only the selected player answers, once, +POINTS once
    await rs.stopTango(code);
    r = await room(code);
    const first = r.selectedId!;
    picked.push(first);
    check(r.status === "tango" && r.round === 1 && r.optionsAt === null, "¡Tango! picks a player, reading time first");
    await rs.answer(code, first, r.question!.answer);
    check((await room(code)).choice === null, "answer rejected during the reading time");
    await rs.showOptions(code);
    r = await room(code);
    check(r.optionsAt !== null, "options shown");
    const other = [ana.id, beto.id, caro.id].find((id) => id !== first)!;
    await rs.answer(code, other, r.question!.answer);
    check((await room(code)).choice === null, "a non-selected player can't answer");
    await rs.answer(code, first, r.question!.answer);
    await rs.answer(code, first, r.question!.options.find((o) => o !== r.question!.answer)!);
    check((await room(code)).choice === r.question!.answer, "selected player answers once");
    await rs.reveal(code);
    await rs.reveal(code);
    r = await room(code);
    check(r.players[first].score === POINTS && r.players[first].scoredRound === 1, `correct answer scores ${POINTS}, once`);
    await rs.nextRound(code);
    check((await room(code)).status === "tingo", "next round: ball jumps again");

    // Round 2: wrong answer = 0, and the ball never repeats a player in the cycle
    await rs.stopTango(code);
    await rs.showOptions(code);
    r = await room(code);
    const second = r.selectedId!;
    picked.push(second);
    await rs.answer(code, second, r.question!.options.find((o) => o !== r.question!.answer)!);
    await rs.reveal(code);
    check((await room(code)).players[second].score === 0, "wrong answer scores 0");
    await rs.nextRound(code);

    // Round 3: the last one of the cycle leaves while selected → question closes, no points
    await rs.stopTango(code);
    r = await room(code);
    const third = r.selectedId!;
    picked.push(third);
    check(new Set(picked).size === 3, "fair draw: 3 rounds, 3 different players");
    await rs.leaveRoom(code, third);
    r = await room(code);
    check(r.revealed && !r.players[third], "selected player leaves → question closed, player gone");
    await rs.nextRound(code);

    // Rounds 4-5 run the queue out → podium
    for (let i = 0; i < 2; i++) {
        await rs.stopTango(code);
        await rs.showOptions(code);
        await rs.reveal(code);
        await rs.nextRound(code);
    }
    r = await room(code);
    check(r.status === "end" && (r.tiebreaks ?? []).length === 0, "queue empty → podium (end), no tie → no tie-break");

    // Otra partida, misma sala: back to the lobby, scores reset
    await rs.backToLobby(code);
    r = await room(code);
    check(r.status === "lobby" && Object.values(r.players).every((p) => p.score === 0 && p.scoredRound === undefined), "Otra partida: lobby, scores 0");
    await rs.startGame(code, buildQueue(await firestoreQuestionSource.load(TOPICS[0].id)));
    check((await room(code)).queue.length === 5, "seeded topic plays too (trimmed to 5)");
    await rs.forceTie(code);
    await rs.endGame(code);
    r = await room(code);
    const tbs = r.tiebreaks ?? [];
    check(r.status === "end", "Terminar juego → podium");
    check(tbs.length === 1 && tbs[0].place === 1 && justified(tbs), "forced tie → ✊✋✌️ stored in the room, throws justify the winner");
    check(rankPlayers(Object.values(r.players), tbs).map((x) => x.place).join() === "1,2", "podium after the tie-break: 1st and 2nd, no shared step");
    await rs.setRoomDebug(code, true);
    check((await room(code)).debug === true, "debug switch on");
    await rs.setRoomDebug(code, false);

    // Everyone leaves mid-game → end
    await rs.backToLobby(code);
    check((await room(code)).tiebreaks === undefined, "Otra partida clears the last tie-break");
    await rs.startGame(code, buildQueue(await firestoreQuestionSource.load(topicId)));
    for (const id of Object.keys((await room(code)).players)) await rs.leaveRoom(code, id);
    check((await room(code)).status === "end", "everyone left mid-game → end");

    // Nueva sala: same settings, straight to the lobby (what HostGame.freshRoom does)
    console.log("\n# New room");
    const next = await rs.createRoom();
    rooms.push(next);
    r = await room(code);
    await rs.applySettings(next, { topic: r.topic, readSeconds: r.readSeconds, answerSeconds: r.answerSeconds, questionCount: rs.questionCountOf(r) });
    await rs.openRoom(next);
    const n = await room(next);
    check(n.status === "lobby" && n.topic === topicId && n.readSeconds === 5 && n.answerSeconds === 10 && n.questionCount === 5, "Nueva sala keeps settings, opens the lobby");
}

try {
    await main();
} catch (e) {
    console.error("✘ crashed:", e);
    fails++;
} finally {
    for (const code of rooms) await rs.deleteRoom(code).catch(() => {});
    if (topicId) {
        await deleteCustomTopic(topicId).catch(() => {});
        check((await firestoreQuestionSource.load(topicId)).length === 0, "cleanup: test topic deleted with its questions");
    }
    await terminate(db);
}
console.log(fails === 0 ? "\nALL OK" : `\n${fails} FAILED`);
process.exit(fails === 0 ? 0 : 1);
