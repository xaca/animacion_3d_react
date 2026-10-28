import Phaser from 'phaser';
import { ATTACK_FRAMES, COLORS, DIRECTIONS, PLAYER_COLS, PLAYER_H, PLAYER_ROWS, PLAYER_W, RUPEES, TILE_SIZE } from './config';
import type { Direction, RupeeKind } from './config';

// Generates every texture procedurally. Safe to call more than once:
// textures live in the global TextureManager and survive scene restarts.
export function generateTextures(scene: Phaser.Scene) {
  if (scene.textures.exists('spark')) return; // last texture generated

  const g = scene.make.graphics({}, false);
  generateTileTextures(g);
  generatePlayerSheet(g);
  generateSword(g);
  generateMoblinTextures(g);
  generateObjectTextures(g);
  g.destroy();
}

function generateTileTextures(g: Phaser.GameObjects.Graphics) {
  const T = TILE_SIZE;

  // Grass
  g.clear(); g.fillStyle(COLORS.grassBase); g.fillRect(0, 0, T, T); g.fillStyle(COLORS.grassLight);
  for (let i = 0; i < 6; i++) { g.fillRect(((i * 137) % (T - 4)) + 2, ((i * 97) % (T - 4)) + 2, 2, 1); }
  g.generateTexture('grass', T, T);

  // Sand
  g.clear(); g.fillStyle(COLORS.sand); g.fillRect(0, 0, T, T); g.fillStyle(COLORS.sandDark);
  for (let i = 0; i < 4; i++) { g.fillRect(((i * 113) % (T - 4)) + 2, ((i * 79) % (T - 4)) + 2, 3, 1); }
  g.generateTexture('sand', T, T);

  // Flower
  g.clear(); g.fillStyle(COLORS.grassBase); g.fillRect(0, 0, T, T);
  g.fillStyle(COLORS.flower1); g.fillRect(6, 10, 2, 2); g.fillRect(22, 18, 2, 2);
  g.fillStyle(COLORS.flower2); g.fillRect(14, 6, 2, 2); g.fillRect(4, 22, 2, 2);
  g.generateTexture('flower', T, T);

  // Water
  for (let frame = 0; frame < 4; frame++) {
    g.clear(); g.fillStyle(COLORS.waterDeep); g.fillRect(0, 0, T, T); g.fillStyle(COLORS.waterShallow);
    const off = frame * 4;
    for (let row = 0; row < 4; row++) { g.fillRect(0, (row * 8 + off) % T, T, 2); }
    g.fillStyle(COLORS.waterLight);
    g.fillRect((off) % (T - 6), 4, 6, 1); g.fillRect((off + 12) % (T - 4), 20, 4, 1);
    g.generateTexture(`water${frame}`, T, T);
  }

  // Tree
  g.clear(); g.fillStyle(COLORS.grassBase); g.fillRect(0, 0, T, T);
  g.fillStyle(COLORS.treeTrunk); g.fillRect(12, 22, 8, 10);
  g.fillStyle(COLORS.treeBase); g.fillRect(4, 16, 24, 14); g.fillRect(6, 18, 4, 2);
  g.fillStyle(COLORS.treeTop); g.fillRect(8, 10, 16, 10);
  g.fillStyle(COLORS.treeHighlight); g.fillRect(11, 8, 10, 6);
  g.generateTexture('tree', T, T);
}

// ─── Player sheet ────────────────────────────────────────────────────────────
// 6 columns × 12 rows. Rows 0-3 idle, 4-7 walk, 8-11 attack (down, right, up, left).
// Attack rows only use the first ATTACK_FRAMES columns: wind-up, strike, recover.
// During an attack the sword is NOT in the frame; it is a separate sprite (see 'sword').

type Pose = {
  bob: number;                // head/body vertical bob
  legL: number; legR: number; // leg offsets
  armSwing: number;           // arm offset while walking
  dx: number; dy: number;     // whole-body lean (attack)
  arm: 'sword' | 'rest' | 'strike';
};

const SKIN = 0xf5c78e, TUNIC = 0x2d8a3c, HAT = 0x228b22, BOOTS = 0x8b4513, EYES = 0x222222;
const BLADE = 0xd8d8e0, BLADE_EDGE = 0xffffff, GUARD = 0xe0b030, HILT = 0x6b4226;

const DIR_VEC: Record<Direction, [number, number]> = { down: [0, 1], right: [1, 0], up: [0, -1], left: [-1, 0] };

function generatePlayerSheet(sheet: Phaser.GameObjects.Graphics) {
  sheet.clear();

  for (let row = 0; row < PLAYER_ROWS; row++) {
    const dir = DIRECTIONS[row % 4];
    const kind = row < 4 ? 'idle' : row < 8 ? 'walk' : 'attack';
    const cols = kind === 'attack' ? ATTACK_FRAMES : PLAYER_COLS;

    for (let col = 0; col < cols; col++) {
      drawPlayer(sheet, col * PLAYER_W, row * PLAYER_H, dir, poseFor(kind, dir, col));
    }
  }
  sheet.generateTexture('player_sheet', PLAYER_W * PLAYER_COLS, PLAYER_H * PLAYER_ROWS);
}

function poseFor(kind: 'idle' | 'walk' | 'attack', dir: Direction, col: number): Pose {
  const base: Pose = { bob: 0, legL: 0, legR: 0, armSwing: 0, dx: 0, dy: 0, arm: 'sword' };

  if (kind === 'idle') {
    // Slight breathing bob
    return { ...base, bob: [0, 1, 1, 0, 0, 0][col] };
  }
  if (kind === 'walk') {
    // Leg offsets: [0, right forward, right max, 0, left forward, left max]
    const step = [0, -1, -2, 0, 1, 2][col];
    return { ...base, bob: col % 3 === 0 ? 0 : 1, legL: step, legR: -step, armSwing: Math.sign(-step) };
  }
  // attack: 0 wind-up (lean back), 1 strike (lunge forward), 2 recover
  const [vx, vy] = DIR_VEC[dir];
  if (col === 0) return { ...base, arm: 'rest', dx: -vx, dy: Math.max(0, -vy) };
  if (col === 1) return { ...base, arm: 'strike', dx: vx, dy: Math.max(0, vy), legL: -1, legR: 1 };
  return { ...base, arm: 'strike' };
}

function drawPlayer(g: Phaser.GameObjects.Graphics, sx: number, sy: number, dir: Direction, p: Pose) {
  // Shadow stays on the ground (no lean)
  g.fillStyle(0x000000, 0.25);
  g.fillEllipse(sx + 8, sy + 22, 10, 3);

  const x = sx + p.dx;
  const y = sy + p.dy;
  const b = p.bob;
  const side = dir === 'left' || dir === 'right';

  // Facing up: sword/arm are behind the body, so draw them first
  if (dir === 'up' && p.arm === 'sword') drawHeldSword(g, x + 12, y + 5 + b, x + 12, y + 10 + b);

  // Tunic
  g.fillStyle(TUNIC);
  g.fillRect(x + 4, y + 8 + b, 8, 10);

  // Head
  g.fillStyle(SKIN);
  g.fillRect(x + 5, y + 2 + b, 6, 6);

  // Eyes / back of head
  if (dir === 'up') {
    g.fillStyle(HAT); g.fillRect(x + 4, y + 1 + b, 8, 3);
  } else {
    g.fillStyle(EYES);
    if (dir !== 'right') g.fillRect(x + 6, y + 4 + b, 1, 1);
    if (dir !== 'left')  g.fillRect(x + 9, y + 4 + b, 1, 1);
  }

  // Hat
  g.fillStyle(HAT);
  g.fillRect(x + 3, y + b, 10, 3);

  // Legs
  g.fillStyle(BOOTS);
  if (side) {
    // side view: legs overlap
    const front = dir === 'right' ? p.legR : p.legL;
    const back  = dir === 'right' ? p.legL : p.legR;
    g.fillRect(x + 7, y + 17 + Math.abs(back), 2, 5 - Math.abs(back));
    g.fillRect(x + 7 + front, y + 17 + Math.abs(front), 2, 5 - Math.abs(front));
  } else {
    g.fillRect(x + 5, y + 17 + Math.abs(p.legL), 2, 5 - Math.abs(p.legL));
    g.fillRect(x + 9, y + 17 + Math.abs(p.legR), 2, 5 - Math.abs(p.legR));
  }

  // Arms
  if (p.arm === 'sword' && dir !== 'up') {
    // Sword hand faces the viewer: left side for down/left, mirrored for right
    const a = p.armSwing;
    if (dir === 'right') drawHeldSword(g, x + 13 + a, y + 7 + b, x + 12 + a, y + 10 + b);
    else                 drawHeldSword(g, x + 1 + a,  y + 7 + b, x + 2 + a,  y + 10 + b);
  } else if (p.arm === 'rest') {
    // Wind-up: hand pulled back next to the body
    g.fillStyle(SKIN);
    if (dir === 'right')     g.fillRect(x + 4, y + 10, 2, 3);
    else if (dir === 'left') g.fillRect(x + 10, y + 10, 2, 3);
    else if (dir === 'down') g.fillRect(x + 11, y + 9, 2, 3);
    else                     g.fillRect(x + 3, y + 9, 2, 3);
  } else if (p.arm === 'strike') {
    // Strike: arm stretched toward the facing direction
    g.fillStyle(SKIN);
    if (dir === 'right')     g.fillRect(x + 11, y + 11, 4, 2);
    else if (dir === 'left') g.fillRect(x + 1, y + 11, 4, 2);
    else if (dir === 'down') g.fillRect(x + 7, y + 14, 2, 4);
    else                     g.fillRect(x + 11, y + 4, 2, 4);
  }
}

// Small sword held point-up, with the hand drawn over the grip
function drawHeldSword(g: Phaser.GameObjects.Graphics, swordX: number, swordY: number, handX: number, handY: number) {
  g.fillStyle(BLADE); g.fillRect(swordX, swordY, 2, 7);
  g.fillStyle(SKIN);  g.fillRect(handX, handY, 2, 3);
}

// Standalone sword, pointing up. Origin for swinging should be the bottom of the hilt.
function generateSword(g: Phaser.GameObjects.Graphics) {
  g.clear();
  g.fillStyle(BLADE);      g.fillRect(1, 1, 3, 11);
  g.fillStyle(BLADE_EDGE); g.fillRect(2, 0, 1, 11);
  g.fillStyle(GUARD);      g.fillRect(0, 12, 5, 2);
  g.fillStyle(HILT);       g.fillRect(1, 14, 3, 4);
  g.generateTexture('sword', 5, 18);
}

// ─── Moblin ──────────────────────────────────────────────────────────────────
// 16×20 frames drawn facing right (the sprite flips for left), plus its fireball and "!" mark.

type MoblinPose = {
  dx: number;                 // whole-body lean
  legL: number; legR: number; // leg lift
  arms: 'down' | 'back' | 'forward' | 'up';
  mouth: 'closed' | 'open';
};

const MOB_SKIN = 0xb5482a, MOB_BELLY = 0xd9774a, MOB_SNOUT = 0xe89a7a, MOB_DARK = 0x5a1e12;
const MOB_HORN = 0xe8e0c8, MOB_EYE = 0xffe040, FIRE_HOT = 0xfff0a0, FIRE_MID = 0xffa020, FIRE_OUT = 0xd03010;

function generateMoblinTextures(g: Phaser.GameObjects.Graphics) {
  const base: MoblinPose = { dx: 0, legL: 0, legR: 0, arms: 'down', mouth: 'closed' };
  const poses: Record<string, MoblinPose> = {
    moblin_walk0:  { ...base, legL: 2 },
    moblin_walk1:  { ...base, legR: 2 },
    moblin_windup: { ...base, dx: -1, arms: 'back' },
    moblin_lunge:  { ...base, dx: 1, arms: 'forward', legL: 1 },
    moblin_charge: { ...base, mouth: 'open' },
    moblin_roar:   { ...base, arms: 'up', mouth: 'open' },
  };
  Object.entries(poses).forEach(([key, pose]) => {
    g.clear();
    drawMoblin(g, pose);
    g.generateTexture(key, 16, 20);
  });

  // Fireball: 2 flicker frames, 8×8
  [0, 1].forEach((frame) => {
    g.clear();
    g.fillStyle(FIRE_OUT); g.fillCircle(4, 4, 4 - frame * 0.5);
    g.fillStyle(FIRE_MID); g.fillCircle(4 + frame * 0.5, 4, 3);
    g.fillStyle(FIRE_HOT); g.fillCircle(4 + frame * 0.5, 4 - frame * 0.5, 1.5);
    g.generateTexture(`fireball${frame}`, 8, 8);
  });

  // Ember particle (tinted by the emitter)
  g.clear(); g.fillStyle(0xffffff); g.fillRect(0, 0, 2, 2); g.generateTexture('ember', 2, 2);

  // "!" alert mark, 4×9
  drawPattern(g, ['.##.', '####', '####', '.##.', '.##.', '.##.', '....', '.##.', '.##.'], 0xffe040, 'alert_mark');
}

function drawMoblin(g: Phaser.GameObjects.Graphics, p: MoblinPose) {
  // Shadow stays on the ground
  g.fillStyle(0x000000, 0.25);
  g.fillEllipse(8, 19, 12, 3);

  const x = p.dx;

  // Legs (the lifted one is shorter)
  g.fillStyle(MOB_DARK);
  g.fillRect(x + 5, 15, 2, 4 - p.legL);
  g.fillRect(x + 9, 15, 2, 4 - p.legR);

  // Arm behind the body when pulled back
  g.fillStyle(MOB_SKIN);
  if (p.arms === 'back') g.fillRect(x + 1, 9, 3, 3);

  // Body + belly
  g.fillStyle(MOB_SKIN);  g.fillRect(x + 3, 8, 10, 8);
  g.fillStyle(MOB_BELLY); g.fillRect(x + 6, 10, 5, 5);

  // Head, snout, horns, eye
  g.fillStyle(MOB_SKIN);  g.fillRect(x + 4, 2, 9, 7);
  g.fillStyle(MOB_SNOUT); g.fillRect(x + 11, 4, 4, 4);
  g.fillStyle(MOB_DARK);  g.fillRect(x + 13, 5, 1, 1);
  g.fillStyle(MOB_HORN);  g.fillRect(x + 4, 0, 2, 2); g.fillRect(x + 10, 0, 2, 2);
  g.fillStyle(MOB_EYE);   g.fillRect(x + 9, 3, 2, 2);
  g.fillStyle(MOB_DARK);  g.fillRect(x + 10, 4, 1, 1);

  // Mouth: a line when closed, glowing with fire when open
  if (p.mouth === 'open') {
    g.fillStyle(MOB_DARK); g.fillRect(x + 11, 7, 4, 3);
    g.fillStyle(FIRE_MID); g.fillRect(x + 12, 8, 3, 2);
    g.fillStyle(FIRE_HOT); g.fillRect(x + 13, 8, 2, 1);
  } else {
    g.fillStyle(MOB_DARK); g.fillRect(x + 11, 8, 3, 1);
  }

  // Front arm
  g.fillStyle(MOB_SKIN);
  if (p.arms === 'down')         g.fillRect(x + 10, 10, 2, 5);
  else if (p.arms === 'forward') g.fillRect(x + 12, 10, 4, 2);
  else if (p.arms === 'up')      { g.fillRect(x + 2, 3, 2, 5); g.fillRect(x + 12, 3, 2, 5); }
}

// ─── World objects: bush, pickups, HUD, enemies, particles ───────────────────
function generateObjectTextures(g: Phaser.GameObjects.Graphics) {
  const T = TILE_SIZE;

  // Bush (on grass, so it can replace the floor tile)
  g.clear(); g.fillStyle(COLORS.grassBase); g.fillRect(0, 0, T, T);
  g.fillStyle(0x000000, 0.2); g.fillEllipse(16, 27, 26, 6);
  g.fillStyle(COLORS.bushDark); g.fillCircle(16, 17, 12);
  g.fillStyle(COLORS.bushBase); g.fillCircle(10, 15, 7); g.fillCircle(21, 14, 7); g.fillCircle(16, 20, 8);
  g.fillStyle(COLORS.bushLight); g.fillRect(8, 11, 3, 2); g.fillRect(19, 10, 3, 2); g.fillRect(14, 18, 3, 2);
  g.generateTexture('bush', T, T);

  // Leaf particle
  g.clear(); g.fillStyle(COLORS.bushBase); g.fillRect(0, 0, 3, 2); g.fillStyle(COLORS.bushLight); g.fillRect(0, 0, 1, 1);
  g.generateTexture('leaf', 3, 2);

  // Rupees (6×10 diamond)
  (Object.keys(RUPEES) as RupeeKind[]).forEach((kind) => {
    const { color, light } = RUPEES[kind];
    g.clear();
    g.fillStyle(color); g.fillTriangle(3, 0, 0, 3, 6, 3); g.fillRect(0, 3, 6, 4); g.fillTriangle(0, 7, 6, 7, 3, 10);
    g.fillStyle(light); g.fillRect(2, 2, 1, 6);
    g.generateTexture(`rupee_${kind}`, 6, 10);
  });

  // Hearts (7×6)
  const heart = [
    '.##.##.',
    '#######',
    '#######',
    '.#####.',
    '..###..',
    '...#...',
  ];
  drawPattern(g, heart, 0xe02828, 'heart_full', [1, 1]);
  drawPattern(g, heart, 0x4a2a2a, 'heart_empty');

  // Slime: 2 frames (squash / stretch), 16×12
  const slime = (key: string, w: number, h: number) => {
    g.clear();
    g.fillStyle(0x000000, 0.25); g.fillEllipse(8, 11, 14, 3);
    g.fillStyle(0x6a2c8e); g.fillEllipse(8, 11 - h / 2, w, h);
    g.fillStyle(0x9b59b6); g.fillEllipse(8, 10 - h / 2, w - 4, h - 3);
    g.fillStyle(0xe8c8f5); g.fillRect(4, 11 - h + 2, 2, 1);
    const eyeY = 11 - h / 2 - 1;
    g.fillStyle(0xffffff); g.fillRect(5, eyeY, 2, 2); g.fillRect(9, eyeY, 2, 2);
    g.fillStyle(0x111111); g.fillRect(6, eyeY + 1, 1, 1); g.fillRect(10, eyeY + 1, 1, 1);
    g.generateTexture(key, 16, 12);
  };
  slime('slime0', 16, 8);
  slime('slime1', 12, 10);

  // Particles
  g.clear(); g.fillStyle(0xffffff); g.fillCircle(3, 3, 3); g.generateTexture('puff', 6, 6);
  g.clear(); g.fillStyle(0xffffff); g.fillRect(0, 0, 2, 2); g.generateTexture('spark', 2, 2);
}

// Draws a pixel pattern ('#' = color) with an optional white highlight pixel
function drawPattern(g: Phaser.GameObjects.Graphics, rows: string[], color: number, key: string, highlight?: [number, number]) {
  g.clear(); g.fillStyle(color);
  rows.forEach((line, y) => [...line].forEach((c, x) => { if (c === '#') g.fillRect(x, y, 1, 1); }));
  if (highlight) { g.fillStyle(0xffffff); g.fillRect(highlight[0], highlight[1], 1, 1); }
  g.generateTexture(key, rows[0].length, rows.length);
}
