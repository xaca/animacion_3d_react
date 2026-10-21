// Changes the TingoTango host PIN. Usage:  npm run pin:tingo -- 2468
// Writes the SHA-256 hash of the new PIN into src/TingoTango/hostAuth.ts; deploy to make it live.
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const pin = process.argv[2];
if (!pin || !/^\d{4}$/.test(pin)) {
    console.error("Usage: npm run pin:tingo -- <4 digits>   (e.g. npm run pin:tingo -- 2468)");
    process.exit(1);
}

const file = "src/TingoTango/hostAuth.ts";
const hash = createHash("sha256").update(pin).digest("hex");
const src = readFileSync(file, "utf8");
const line = /const PIN_HASH = "[0-9a-f]{64}";/;
if (!line.test(src)) {
    console.error(`Could not find the PIN_HASH line in ${file}`);
    process.exit(1);
}
if (src.includes(`"${hash}"`)) {
    console.log(`The TingoTango host PIN is already ${pin} — nothing to change.`);
    process.exit(0);
}
writeFileSync(file, src.replace(line, `const PIN_HASH = "${hash}";`));
console.log(`TingoTango host PIN changed to ${pin}. Make it live with:  npm run deploy`);
console.log("Devices unlocked with the old PIN will be asked for the new one.");
