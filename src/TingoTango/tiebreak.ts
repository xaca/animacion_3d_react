import { pickOne, type Sign, type Tiebreak, type TingoPlayer } from "./types";

// ✊✋✌️ automatic tie-break for the podium. Runs inside the transaction that ends the game
// (roomService.finishGame): the throws are drawn once and stored, and every screen just
// replays them — no device clock, no per-device randomness.

export const SIGNS: Sign[] = ["piedra", "papel", "tijera"];
export const SIGN_EMOJI: Record<Sign, string> = { piedra: "✊", papel: "✋", tijera: "✌️" };
export const BEATS: Record<Sign, Sign> = { piedra: "tijera", papel: "piedra", tijera: "papel" };
export const BEAT_VERB: Record<Sign, string> = { piedra: "rompe", papel: "envuelve", tijera: "corta" };

export const placeLabel = (place: number) => `${place}.${place === 1 || place === 3 ? "er" : "º"} puesto`;
export const signLabel = (sign: Sign) => `${SIGN_EMOJI[sign]} ${sign}`;

export const PODIUM_PLACES = 3;
// Throws per place at most: the last one is decisive, so the show stays short (≈ <20 s)
// even with many tied players. A 2-way tie needs 1.5 throws on average.
export const MAX_THROWS = 6;

// Who survives one throw: with exactly two different signs, the ones holding the winning
// sign; any other mix (all equal, or all three signs) is a draw → everyone stays.
export function survivorsOf(signs: Record<string, Sign>): string[] {
    const used = [...new Set(Object.values(signs))];
    if (used.length !== 2) return Object.keys(signs);
    const winning = BEATS[used[0]] === used[1] ? used[0] : used[1];
    return Object.keys(signs).filter((id) => signs[id] === winning);
}

// One place among `ids`: everyone throws until a single player is left
function playPlace(ids: string[]): { throws: Record<string, Sign>[]; winner: string } {
    const throws: Record<string, Sign>[] = [];
    let alive = ids;
    while (alive.length > 1) {
        let signs: Record<string, Sign>;
        if (throws.length === MAX_THROWS - 1) {
            // Rigged final throw: a random winner with the sign that beats everyone else's
            const winner = pickOne(alive);
            const sign = pickOne(SIGNS);
            signs = Object.fromEntries(alive.map((id) => [id, id === winner ? sign : BEATS[sign]]));
        } else {
            signs = Object.fromEntries(alive.map((id) => [id, pickOne(SIGNS)]));
        }
        throws.push(signs);
        alive = survivorsOf(signs);
    }
    return { throws, winner: alive[0] };
}

// Every tie that touches a podium place (1..3), resolved place by place from the top.
// Players on 0 never play (they're not on the podium); ties below 3rd stay shared.
export function resolveTies(players: TingoPlayer[]): Tiebreak[] {
    const scored = players.filter((p) => p.score > 0).sort((a, b) => b.score - a.score);
    const result: Tiebreak[] = [];
    let place = 1;
    for (let i = 0; i < scored.length && place <= PODIUM_PLACES; ) {
        const group = scored.filter((p) => p.score === scored[i].score);
        let remaining = group;
        for (let p = place; remaining.length > 1 && p <= PODIUM_PLACES; p++) {
            const { throws, winner } = playPlace(remaining.map((r) => r.id));
            result.push({
                place: p,
                score: group[0].score,
                contenders: remaining.map((r) => ({ id: r.id, name: r.name })),
                throws,
                winner,
            });
            remaining = remaining.filter((r) => r.id !== winner);
        }
        place += group.length;
        i += group.length;
    }
    return result;
}
