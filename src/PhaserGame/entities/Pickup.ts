import Phaser from 'phaser';
import { DEPTH, RUPEES } from '../config';
import type { RupeeKind } from '../config';

export type PickupKind = RupeeKind | 'heart';

const BLINK_AFTER_MS = 7000;
const LIFETIME_MS = 10000;

export class Pickup extends Phaser.Physics.Arcade.Sprite {
  readonly kind: PickupKind;
  private collectable = false;

  constructor(scene: Phaser.Scene, x: number, y: number, kind: PickupKind) {
    super(scene, x, y, kind === 'heart' ? 'heart_full' : `rupee_${kind}`);
    this.kind = kind;
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(2).setDepth(DEPTH.pickups);
    (this.body as Phaser.Physics.Arcade.Body).moves = false; // position is driven by tweens

    // Pop out of the ground, then bob gently
    scene.tweens.add({
      targets: this, y: y - 14, duration: 160, ease: 'Quad.Out', yoyo: true,
      onComplete: () => {
        this.collectable = true;
        scene.tweens.add({ targets: this, y: y - 3, duration: 500, ease: 'Sine.InOut', yoyo: true, repeat: -1 });
      },
    });

    scene.time.delayedCall(BLINK_AFTER_MS, () => {
      if (this.active) scene.tweens.add({ targets: this, alpha: 0.2, duration: 120, yoyo: true, repeat: -1 });
    });
    scene.time.delayedCall(LIFETIME_MS, () => { if (this.active) this.destroy(); });
  }

  /** Can't be grabbed mid-pop, so the drop is visible for a moment. */
  get canCollect() {
    return this.collectable;
  }

  get rupeeValue() {
    return this.kind === 'heart' ? 0 : RUPEES[this.kind].value;
  }

  destroy(fromScene?: boolean) {
    this.scene?.tweens.killTweensOf(this);
    super.destroy(fromScene);
  }
}
