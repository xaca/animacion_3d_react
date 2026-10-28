import type Phaser from 'phaser';
import type { Player } from './Player';

/** What WorldScene needs from any enemy in the `enemies` group. */
export interface Enemy extends Phaser.Physics.Arcade.Sprite {
  readonly isDead: boolean;
  /** Damage dealt to the player on touch. */
  readonly contactDamage: number;
  update(time: number, player: Player): void;
  /** Sword hit. Returns true if this hit killed the enemy. */
  hit(fromX: number, fromY: number): boolean;
}
