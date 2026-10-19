// Deletes past game rooms from Firestore; the question bank is never touched. Usage:
//   npm run clean:rooms                   delete every room
//   npm run clean:rooms -- --keep ABCD    keep that room
import { terminate } from "firebase/firestore";
import { db } from "../src/lib/firebase";
import { cleanRooms, listOldRooms } from "../src/Jeopardy/multiplayer/roomService";

const keepIdx = process.argv.indexOf("--keep");
const keep = keepIdx !== -1 ? (process.argv[keepIdx + 1] ?? "").toUpperCase() : "";

const rooms = await listOldRooms(keep);
if (rooms.length === 0) {
    console.log("No rooms to clean ✨");
} else {
    for (const r of rooms) {
        const age = r.createdAt ? `${Math.max(1, Math.round((Date.now() - r.createdAt) / 86_400_000))} d old` : "no date";
        console.log(`deleting ${r.code} (${age})`);
    }
    await cleanRooms(rooms.map((r) => r.code));
    console.log(`Deleted ${rooms.length} room(s)${keep ? `, kept ${keep}` : ""}.`);
}
await terminate(db);
