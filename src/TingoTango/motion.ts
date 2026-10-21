// Animation speed factor: 0 when the computer asks for reduced motion (GSAP durations × MOTION)
export const MOTION = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1;
