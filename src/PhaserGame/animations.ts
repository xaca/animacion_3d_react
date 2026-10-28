import Phaser from 'phaser';
import { ATTACK_FRAMES, DIRECTIONS, PLAYER_COLS, PLAYER_H, PLAYER_ROWS, PLAYER_W } from './config';

type Frames = Phaser.Types.Animations.AnimationFrame[];

// Slices the player sheet into numbered frames and registers the animations.
// Animations are global (game-wide), so every step is guarded to make
// scene restarts and React StrictMode remounts safe.
export function registerAnimations(scene: Phaser.Scene) {
  const texture = scene.textures.get('player_sheet');

  for (let f = 0; f < PLAYER_COLS * PLAYER_ROWS; f++) {
    if (texture.has(f.toString())) continue;
    const col = f % PLAYER_COLS;
    const row = Math.floor(f / PLAYER_COLS);
    texture.add(f.toString(), 0, col * PLAYER_W, row * PLAYER_H, PLAYER_W, PLAYER_H);
  }

  const rowFrames = (row: number, count = PLAYER_COLS): Frames =>
    Array.from({ length: count }, (_, j) => ({ key: 'player_sheet', frame: (row * PLAYER_COLS + j).toString() }));

  DIRECTIONS.forEach((dir, i) => {
    createAnim(scene, `idle-${dir}`, rowFrames(i), 6);     // rows 0-3
    createAnim(scene, `walk-${dir}`, rowFrames(i + 4), 12); // rows 4-7

    // rows 8-11: wind-up, strike, recover. Extra ms per frame on top of frameRate.
    const [windUp, strike, recover] = rowFrames(i + 8, ATTACK_FRAMES);
    createAnim(scene, `attack-${dir}`, [
      { ...windUp, duration: 30 },
      { ...strike, duration: 90 },
      { ...recover, duration: 40 },
    ], 20, 0);
  });

  // Water ripple: 4 separate textures, ~300ms each
  createAnim(scene, 'water', [0, 1, 2, 3].map((n) => ({ key: `water${n}` })), 1000 / 300);

  // Slime bounce: squash ↔ stretch
  createAnim(scene, 'slime-bounce', [{ key: 'slime0' }, { key: 'slime1' }], 4);

  // Moblin: walk cycle plus single-frame poses for each attack state
  createAnim(scene, 'moblin-walk', [{ key: 'moblin_walk0' }, { key: 'moblin_walk1' }], 6);
  createAnim(scene, 'moblin-windup', [{ key: 'moblin_windup' }], 1);
  createAnim(scene, 'moblin-lunge', [{ key: 'moblin_lunge' }], 1);
  createAnim(scene, 'moblin-charge', [{ key: 'moblin_charge' }], 1);
  createAnim(scene, 'moblin-roar', [{ key: 'moblin_roar' }], 1);

  createAnim(scene, 'fireball-flicker', [{ key: 'fireball0' }, { key: 'fireball1' }], 12);
}

function createAnim(scene: Phaser.Scene, key: string, frames: Frames, frameRate: number, repeat = -1) {
  if (scene.anims.exists(key)) return;
  scene.anims.create({ key, frames, frameRate, repeat });
}
