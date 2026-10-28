import Phaser from 'phaser';
import { DEPTH } from '../config';

const SPEED = 140;
const LIFETIME_MS = 1500;

export class Fireball extends Phaser.Physics.Arcade.Sprite {
  private expiresAt = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'fireball0');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(2).setDepth(DEPTH.effects - 1); // flies above everything on the ground
    (this.body as Phaser.Physics.Arcade.Body).setCircle(3, 1, 1);
    this.play('fireball-flicker');
  }

  /** Call after adding to a physics group: group defaults reset the velocity. */
  launch(angle: number) {
    this.expiresAt = this.scene.time.now + LIFETIME_MS;
    this.setRotation(angle);
    this.scene.physics.velocityFromRotation(angle, SPEED, (this.body as Phaser.Physics.Arcade.Body).velocity);
  }

  get isExpired() {
    return this.scene.time.now >= this.expiresAt;
  }
}
