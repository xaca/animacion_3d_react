// Host PIN gate. A deterrent for the classroom, not real security: the check runs
// in the browser and Firestore rules can't tell host writes from player writes.
// To change the PIN, store the SHA-256 hex of the new one here:
//   node -e "console.log(require('crypto').createHash('sha256').update('NEWPIN').digest('hex'))"
const PIN_HASH = "8c6c42f379f08f03b79653a3230abd5e8079999435030fd8ca703ae35fe9b37a";
const KEY = "jeopardy-host";

export function isHostUnlocked(): boolean {
    try {
        return localStorage.getItem(KEY) === PIN_HASH;
    } catch {
        return false;
    }
}

// Remembers the unlock on this device (until lockHost) when the PIN is right
export async function tryUnlockHost(pin: string): Promise<boolean> {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pin));
    const hex = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
    if (hex !== PIN_HASH) return false;
    try {
        localStorage.setItem(KEY, PIN_HASH);
    } catch {
        // unavailable storage: unlocked for this page only
    }
    return true;
}

export function lockHost() {
    try {
        localStorage.removeItem(KEY);
    } catch {
        // ignore
    }
}
