// ─── Tile IDs ────────────────────────────────────────────────────────────────
export const GRASS  = 0;
export const WATER  = 1;
export const TREE   = 2;
export const SAND   = 3;
export const FLOWER = 4;
export const BUSH   = 5; // cuttable with the sword
export const SLIME  = 6; // enemy spawn point (drawn as grass)
export const MOBLIN = 7; // fire-breathing enemy spawn point (drawn as grass)

export const TILE_SIZE = 32;

// ─── Player sprite sheet ─────────────────────────────────────────────────────
export const PLAYER_W = 16;
export const PLAYER_H = 24;
export const PLAYER_COLS = 6;
export const PLAYER_ROWS = 12; // 0-3 idle · 4-7 walk · 8-11 attack (down, right, up, left)
export const ATTACK_FRAMES = 3;

export type Direction = 'down' | 'right' | 'up' | 'left';
export const DIRECTIONS: Direction[] = ['down', 'right', 'up', 'left'];

// ─── Pixel-art colors ────────────────────────────────────────────────────────
export const COLORS = {
  grassBase:   0x5a8a3c, grassLight:  0x6ea84a,
  treeBase:    0x2d5a1b, treeTrunk:   0x6b4226, treeTop: 0x3a7a22, treeHighlight: 0x4e9e2e,
  waterDeep:   0x1a5f8a, waterShallow:0x2a7fbf, waterLight: 0x3da0e0,
  sand:        0xd4b483, sandDark:    0xb8965a,
  flower1:     0xffd700, flower2:     0xff6b8a,
  bushDark:    0x2f6b1f, bushBase:    0x48902c, bushLight:  0x6cc04a,
};

// ─── Gameplay ────────────────────────────────────────────────────────────────
export const PLAYER_MAX_HP = 3;

export type RupeeKind = 'green' | 'blue' | 'red';
export const RUPEES: Record<RupeeKind, { value: number; color: number; light: number }> = {
  green: { value: 1,  color: 0x2ecc40, light: 0xa8f0a0 },
  blue:  { value: 5,  color: 0x2a6fdb, light: 0x9cc4ff },
  red:   { value: 20, color: 0xd62828, light: 0xffa0a0 },
};

// Depth layers (entities use their y position, between these)
export const DEPTH = { pickups: 5, effects: 5000 };
