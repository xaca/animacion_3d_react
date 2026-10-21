import { setRoomDebug } from "./roomService";

// Teacher's debug switch (profile menu). A failure most likely means the Firestore rules
// with the `debug` field aren't deployed yet; the game is unaffected.
export async function toggleRoomDebug(code: string, on: boolean) {
    try {
        await setRoomDebug(code, on);
    } catch (e) {
        console.error("Could not switch debug mode", e);
        alert("No se pudo cambiar el modo debug. Revisa la conexión (y que las reglas de Firestore estén desplegadas).");
    }
}
