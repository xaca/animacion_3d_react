import Phaser from 'phaser';
import { PLAYER_MAX_HP } from '../config';
import type { Direction } from '../config';

const SPEED = 90;

// Attack timing (ms since the attack started). Matches the attack-* animations (~310ms).
const ATTACK_MS = 300;
const SWING_START = 60, SWING_END = 200;    // sword sweeps between these
const HITBOX_START = 80, HITBOX_END = 260;  // sword can hit between these
const SWORD_REACH = 22;                     // hitbox distance from the body center
const HITBOX_SIZE = 28;

const HURT_MS = 180;
const INVINCIBLE_MS = 1000;
const KNOCKBACK = 220;

const DIR_VEC: Record<Direction, [number, number]> = { down: [0, 1], right: [1, 0], up: [0, -1], left: [-1, 0] };
// Sword texture points up (angle 0); Phaser angles grow clockwise
const DIR_ANGLE: Record<Direction, number> = { up: 0, right: 90, down: 180, left: -90 };

type Mode = 'move' | 'attack' | 'hurt' | 'dead';

export class Player extends Phaser.Physics.Arcade.Sprite {
  hp = PLAYER_MAX_HP;

  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd: Record<'up' | 'down' | 'left' | 'right', Phaser.Input.Keyboard.Key>;
  private attackKey: Phaser.Input.Keyboard.Key;
  private sword: Phaser.GameObjects.Image;

  private facing: Direction = 'down';
  private mode: Mode = 'move';
  private attackStartedAt = 0;
  private hurtUntil = 0;
  private invincibleUntil = 0;
  private hitThisSwing = new Set<Phaser.GameObjects.GameObject>();

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player_sheet', '0');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true).setScale(2);
    this.arcadeBody.setSize(10, 10).setOffset(3, 14);

    this.sword = scene.add.image(x, y, 'sword').setOrigin(0.5, 1).setScale(2).setVisible(false);

    const keyboard = scene.input.keyboard!;
    this.cursors = keyboard.createCursorKeys();
    this.wasd = keyboard.addKeys({
      up:    Phaser.Input.Keyboard.KeyCodes.W,
      down:  Phaser.Input.Keyboard.KeyCodes.S,
      left:  Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    }) as Player['wasd'];
    this.attackKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.play('idle-down');
  }

  get arcadeBody() {
    return this.body as Phaser.Physics.Arcade.Body;
  }

  get isDead() {
    return this.mode === 'dead';
  }

  update() {
    const now = this.scene.time.now;
    this.setDepth(this.y);

    if (this.mode === 'dead') return;

    if (this.mode === 'hurt') {
      if (now < this.hurtUntil) return;
      this.mode = 'move';
      this.clearTint();
    }

    if (this.mode === 'attack') {
      this.updateSword(now);
      if (now - this.attackStartedAt >= ATTACK_MS) this.endAttack();
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.attackKey)) {
      this.startAttack(now);
      return;
    }

    this.move();
  }

  private move() {
    let vx = 0, vy = 0;

    if (this.cursors.left.isDown  || this.wasd.left.isDown)  { vx = -SPEED; this.facing = 'left';  }
    if (this.cursors.right.isDown || this.wasd.right.isDown) { vx =  SPEED; this.facing = 'right'; }
    if (this.cursors.up.isDown    || this.wasd.up.isDown)    { vy = -SPEED; this.facing = 'up';    }
    if (this.cursors.down.isDown  || this.wasd.down.isDown)  { vy =  SPEED; this.facing = 'down';  }

    if (vx !== 0 && vy !== 0) { vx *= 0.707; vy *= 0.707; }
    this.setVelocity(vx, vy);

    const moving = vx !== 0 || vy !== 0;
    this.anims.play(`${moving ? 'walk' : 'idle'}-${this.facing}`, true);
  }

  // ─── Sword ─────────────────────────────────────────────────────────────────

  private startAttack(now: number) {
    this.mode = 'attack';
    this.attackStartedAt = now;
    this.hitThisSwing.clear();
    this.setVelocity(0, 0);
    this.play(`attack-${this.facing}`);
    this.sword.setVisible(true);
    this.updateSword(now);
  }

  private endAttack() {
    this.mode = 'move';
    this.sword.setVisible(false);
  }

  // Sweeps the sword clockwise across the facing direction, pivoting at the hand
  private updateSword(now: number) {
    const [vx, vy] = DIR_VEC[this.facing];
    const t = Phaser.Math.Clamp((now - this.attackStartedAt - SWING_START) / (SWING_END - SWING_START), 0, 1);
    const sweep = Phaser.Math.Linear(-100, 15, Phaser.Math.Easing.Cubic.Out(t));

    this.sword
      .setPosition(this.x + vx * 6, this.y + 4 + vy * 4)
      .setAngle(DIR_ANGLE[this.facing] + sweep)
      .setDepth(this.facing === 'up' ? this.depth - 1 : this.depth + 1);
  }

  /** World-space rectangle the sword hits this frame, or null when it can't hit. */
  getSwordHitbox(): Phaser.Geom.Rectangle | null {
    if (this.mode !== 'attack') return null;
    const t = this.scene.time.now - this.attackStartedAt;
    if (t < HITBOX_START || t > HITBOX_END) return null;

    const [vx, vy] = DIR_VEC[this.facing];
    const { x, y } = this.arcadeBody.center;
    const half = HITBOX_SIZE / 2;
    return new Phaser.Geom.Rectangle(x + vx * SWORD_REACH - half, y + vy * SWORD_REACH - half, HITBOX_SIZE, HITBOX_SIZE);
  }

  /** Returns true the first time a target is hit during the current swing. */
  registerHit(target: Phaser.GameObjects.GameObject) {
    if (this.hitThisSwing.has(target)) return false;
    this.hitThisSwing.add(target);
    return true;
  }

  // ─── Damage ────────────────────────────────────────────────────────────────

  /** Returns true if the damage was applied (false while invincible or dead). */
  takeDamage(amount: number, fromX: number, fromY: number) {
    const now = this.scene.time.now;
    if (this.mode === 'dead' || now < this.invincibleUntil) return false;

    this.hp = Math.max(0, this.hp - amount);
    this.endAttack();

    if (this.hp === 0) {
      this.die();
      return true;
    }

    this.mode = 'hurt';
    this.hurtUntil = now + HURT_MS;
    this.invincibleUntil = now + INVINCIBLE_MS;
    this.setTint(0xff7070);

    const away = new Phaser.Math.Vector2(this.x - fromX, this.y - fromY).normalize().scale(KNOCKBACK);
    this.setVelocity(away.x, away.y);

    // Blink while invincible
    this.scene.tweens.add({
      targets: this, alpha: 0.3, duration: 80, yoyo: true, repeat: Math.floor(INVINCIBLE_MS / 160) - 1,
      onComplete: () => this.setAlpha(1),
    });
    return true;
  }

  heal(amount: number) {
    this.hp = Math.min(PLAYER_MAX_HP, this.hp + amount);
  }

  private die() {
    this.mode = 'dead';
    this.setVelocity(0, 0);
    this.anims.stop();
    this.setFrame('0').setTint(0x9090a0);
    this.scene.tweens.add({ targets: this, angle: 720, scale: 1.6, duration: 700, ease: 'Cubic.Out' });
  }

  destroy(fromScene?: boolean) {
    this.sword?.destroy();
    super.destroy(fromScene);
  }
}
