// Game sounds, synthesized with the Web Audio API: no packages, no audio files, no
// latency. Everything plays on the TEACHER's screen (the classroom speakers); phones
// stay silent. The AudioContext is created/resumed lazily on a user gesture (autoplay
// policy), the master gain stays low, and with sound off every call returns at once.

const KEY = "tingo-sound";

let on = readSwitch();
let ctx: AudioContext | null = null;
let master: GainNode | null = null;

function readSwitch(): boolean {
    try {
        return localStorage.getItem(KEY) !== "off";
    } catch {
        return true;
    }
}

export const isSoundOn = () => on;

export function setSoundOn(next: boolean) {
    on = next;
    try {
        localStorage.setItem(KEY, next ? "on" : "off");
    } catch {
        // remembered for this page only
    }
}

function ensure(): AudioContext | null {
    if (!on) return null;
    try {
        if (!ctx) {
            ctx = new AudioContext();
            master = ctx.createGain();
            master.gain.value = 0.15; // quiet by default: it's a classroom
            master.connect(ctx.destination);
        }
        if (ctx.state === "suspended") void ctx.resume();
        return ctx;
    } catch {
        return null;
    }
}

type ToneOptions = { type?: OscillatorType; gain?: number; delay?: number; slideTo?: number };

// One note with a quick attack and an exponential fade; `slideTo` bends the pitch
function tone(freq: number, duration: number, { type = "sine", gain = 1, delay = 0, slideTo }: ToneOptions = {}) {
    const c = ensure();
    if (!c || !master) return;
    const osc = c.createOscillator();
    const g = c.createGain();
    const t0 = c.currentTime + delay;
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + duration);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
    osc.connect(g);
    g.connect(master);
    osc.start(t0);
    osc.stop(t0 + duration + 0.05);
}

// Call on the host's first click (Start), so the context is unlocked before the show
export function unlockSound() {
    ensure();
}

// One "tingo" of the chant: a short blip whose pitch climbs with `heat` (0..1) as the
// round approaches the tango, so the suspense is audible
export function blip(heat = 0) {
    tone(480 + heat * 420 + Math.random() * 40, 0.09, { type: "triangle", gain: 0.8 });
}

// ¡Tango!: three rising notes and a low hit
export function tangoSting() {
    tone(392, 0.14, { type: "triangle" });
    tone(494, 0.14, { type: "triangle", delay: 0.12 });
    tone(587, 0.4, { type: "triangle", delay: 0.24 });
    tone(98, 0.45, { type: "square", gain: 0.5, delay: 0.24 });
}

// The options appeared
export function popSound() {
    tone(620, 0.09, { type: "sine", slideTo: 920, gain: 0.7 });
}

// Last seconds of the answer countdown
export function tick() {
    tone(1050, 0.045, { type: "square", gain: 0.35 });
}

// Correct answer: major arpeggio up
export function correctSound() {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.18, { type: "triangle", delay: i * 0.09 }));
}

// Wrong (or no) answer: short falling buzz
export function wrongSound() {
    tone(220, 0.35, { type: "square", gain: 0.5, slideTo: 110 });
}

// Podium: a longer fanfare for the winner
export function fanfare() {
    [392, 523, 659, 784, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, { type: "triangle", delay: i * 0.13 }));
}
