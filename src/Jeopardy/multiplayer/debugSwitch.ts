import { setRoomDebug } from "./roomService";

// Teacher's debug switch (profile menu, lobby link, console). A failure most likely means
// the Firestore rules with the `debug` field aren't deployed yet; the game is unaffected.
export async function toggleRoomDebug(code: string, on: boolean) {
    try {
        await setRoomDebug(code, on);
    } catch (e) {
        console.error("Could not switch debug mode", e);
        alert("Could not switch debug mode. Check your connection (and that the latest Firestore rules are deployed).");
    }
}
