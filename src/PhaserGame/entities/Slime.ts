import Phaser from 'phaser';
import type { Player } from './Player';

const WANDER_SPEED = 30;
const CHASE_SPEED = 55;
const CHASE_RANGE = 130;
const MAX_HP = 2;
const HURT_MS = 220;
const KNOCKBACK = 260;

type Mode = 'wander' | 'chase' | 'hurt' | 'dead';

export class Slime extends Phaser.Physics.Arcade.Sprite {
  private hp = MAX_HP;
  private mode: Mode = 'wander';
  private nextThinkAt = 0;
  private hurtUntil = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'slime0');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(2);
    (this.body as Phaser.Physics.Arcade.Body).setSize(12, 7).setOffset(2, 4);

    // Start each slime at a random point of the bounce so they don't move in sync
    this.play('slime-bounce');
    this.anims.setProgress(Math.random());
  }

  get isDead() {
    return this.mode === 'dead';
  }

  update(time: number, player: Player) {
    this.setDepth(this.y);
    if (this.mode === 'dead') return;

    if (this.mode === 'hurt') {
      if (time < this.hurtUntil) return;
      this.mode = 'wander';
      this.nextThinkAt = 0;
    }

    const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
    if (!player.isDead && dist < CHASE_RANGE) {
      this.mode = 'chase';
      this.scene.physics.moveToObject(this, player, CHASE_SPEED);
      return;
    }

    if (this.mode === 'chase') { this.mode = 'wander'; this.nextThinkAt = 0; }

    // Wander: pick a new random direction (or rest) every so often
    if (time >= this.nextThinkAt) {
      this.nextThinkAt = time + Phaser.Math.Between(800, 2000);
      if (Math.random() < 0.3) {
        this.setVelocity(0, 0);
      } else {
        const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
        this.setVelocity(Math.cos(angle) * WANDER_SPEED, Math.sin(angle) * WANDER_SPEED);
      }
    }
  }

  /** Sword hit. Returns true if this hit killed the slime. */
  hit(fromX: number, fromY: number) {
    if (this.mode === 'dead' || this.mode === 'hurt') return false;

    this.hp--;
    this.mode = 'hurt';
    this.hurtUntil = this.scene.time.now + HURT_MS;

    const away = new Phaser.Math.Vector2(this.x - fromX, this.y - fromY).normalize().scale(KNOCKBACK);
    this.setVelocity(away.x, away.y);

    // White flash
    this.setTint(0xffffff).setTintMode(Phaser.TintModes.FILL);
    this.scene.time.delayedCall(90, () => {
      if (this.active) this.clearTint().setTintMode(Phaser.TintModes.MULTIPLY);
    });

    if (this.hp <= 0) {
      this.die();
      return true;
    }
    return false;
  }

  private die() {
    this.mode = 'dead';
    (this.body as Phaser.Physics.Arcade.Body).enable = false;
    this.scene.tweens.add({
      targets: this, scaleX: 3, scaleY: 0.5, alpha: 0, duration: 180, delay: 90,
      onComplete: () => this.destroy(),
    });
  }
}
