import Phaser from 'phaser';
import { DEPTH, TILE_SIZE, TREE } from '../config';
import { MAP } from '../map';
import type { Player } from './Player';
import type { Enemy } from './Enemy';

const MAX_HP = 6;

const PATROL_SPEED = 28;
const PATROL_RADIUS = 80;     // wanders around its spawn point
const CHASE_SPEED = 60;
const ENRAGED_CHASE_SPEED = 80;

const ALERT_RANGE = 150;
const GIVE_UP_RANGE = 240;
const MELEE_RANGE = 50;
const FIRE_MIN_RANGE = 90;
const FIRE_MAX_RANGE = 200;

const ALERT_MS = 400;
const WINDUP_MS = 350, LUNGE_MS = 250, RECOVER_MS = 400; // melee phases
const LUNGE_SPEED = 220;
const CHARGE_MS = 600;
const AIM_LOCK_MS = 150;      // aim freezes this long before the shot, so it can be dodged
const BREATH_MS = 250;
const RECOIL = 60;
const FIRE_COOLDOWN_MS = 3000;
const ENRAGED_FIRE_COOLDOWN_MS = 1800;
const SPREAD = 0.3;           // radians between fireballs when enraged
const REPOSITION_MS = 700;
const REPOSITION_SPEED = 70;
const HURT_MS = 250;
const KNOCKBACK = 200;
const ROAR_MS = 500;

const ENRAGED_TINT = 0xff9090;

type StateName =
  | 'patrol' | 'alert' | 'chase' | 'melee' | 'fireCharge'
  | 'fireBreath' | 'reposition' | 'hurt' | 'enraged' | 'dead';

type State = { enter?: () => void; update?: (elapsed: number) => void; exit?: () => void };

export type MoblinHooks = {
  /** Spawn a fireball at the mouth, flying at `angle` (radians). */
  fire: (x: number, y: number, angle: number) => void;
  /** Called every frame while charging, to draw embers at the mouth. */
  charging: (x: number, y: number) => void;
};

export class Moblin extends Phaser.Physics.Arcade.Sprite implements Enemy {
  private hp = MAX_HP;
  private current: StateName = 'patrol';
  private stateStartedAt = 0;
  private states: Record<StateName, State>;
  private player!: Player;

  private readonly home: Phaser.Math.Vector2;
  private nextThinkAt = 0;
  private aim = 0;            // radians, toward the player
  private fireReadyAt = 0;
  private enraged = false;
  private sightClear = false; // last line-of-sight result, for debug drawing

  private alertMark: Phaser.GameObjects.Image;
  private debugText: Phaser.GameObjects.Text;

  private hooks: MoblinHooks;

  constructor(scene: Phaser.Scene, x: number, y: number, hooks: MoblinHooks) {
    super(scene, x, y, 'moblin_walk0');
    this.hooks = hooks;
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(2);
    (this.body as Phaser.Physics.Arcade.Body).setSize(10, 8).setOffset(3, 11);
    this.home = new Phaser.Math.Vector2(x, y);

    this.alertMark = scene.add.image(x, y, 'alert_mark').setScale(2).setVisible(false).setDepth(DEPTH.effects);
    this.debugText = scene.add.text(x, y, '', { fontFamily: 'monospace', fontSize: '8px', color: '#ffffff', backgroundColor: '#000000aa' })
      .setOrigin(0.5, 1).setResolution(2).setDepth(DEPTH.effects + 1).setVisible(false);

    this.states = {
      patrol: {
        enter: () => { this.nextThinkAt = 0; this.play('moblin-walk'); },
        update: () => this.updatePatrol(),
      },
      alert: {
        enter: () => { this.setVelocity(0, 0); this.anims.stop(); this.alertMark.setVisible(true); },
        update: (elapsed) => {
          this.face(this.player.x);
          if (elapsed >= ALERT_MS) this.changeState('chase');
        },
        exit: () => this.alertMark.setVisible(false),
      },
      chase: {
        enter: () => this.play('moblin-walk'),
        update: () => this.updateChase(),
      },
      melee: {
        enter: () => {
          this.setVelocity(0, 0);
          this.aim = this.angleToPlayer();
          this.play('moblin-windup');
        },
        update: (elapsed) => this.updateMelee(elapsed),
        exit: () => this.restTint(),
      },
      fireCharge: {
        enter: () => { this.setVelocity(0, 0); this.play('moblin-charge'); },
        update: (elapsed) => {
          // Track the player until shortly before firing, then hold the aim
          if (elapsed < CHARGE_MS - AIM_LOCK_MS) {
            this.aim = this.angleToPlayer();
            this.face(this.player.x);
          }
          this.setTint(Math.floor(elapsed / 80) % 2 ? 0xffb060 : 0xffffff);
          const mouth = this.mouth();
          this.hooks.charging(mouth.x, mouth.y);
          if (elapsed >= CHARGE_MS) this.changeState('fireBreath');
        },
        exit: () => this.restTint(),
      },
      fireBreath: {
        enter: () => {
          const mouth = this.mouth();
          const angles = this.enraged ? [this.aim - SPREAD, this.aim, this.aim + SPREAD] : [this.aim];
          angles.forEach((a) => this.hooks.fire(mouth.x, mouth.y, a));
          this.fireReadyAt = this.scene.time.now + (this.enraged ? ENRAGED_FIRE_COOLDOWN_MS : FIRE_COOLDOWN_MS);
          this.scene.physics.velocityFromRotation(this.aim + Math.PI, RECOIL, this.arcadeBody.velocity);
        },
        update: (elapsed) => { if (elapsed >= BREATH_MS) this.changeState('reposition'); },
      },
      reposition: {
        enter: () => {
          // Too close for fire: back off. Otherwise sidestep to find a new angle.
          const away = this.angleToPlayer() + Math.PI;
          const dist = this.distanceToPlayer();
          const angle = dist < FIRE_MIN_RANGE + 20 ? away : away + Math.PI / 2 * (Math.random() < 0.5 ? 1 : -1);
          this.scene.physics.velocityFromRotation(angle, REPOSITION_SPEED, this.arcadeBody.velocity);
          this.play('moblin-walk');
        },
        update: (elapsed) => {
          this.face(this.player.x);
          if (elapsed >= REPOSITION_MS) this.changeState('chase');
        },
      },
      hurt: {
        enter: () => this.anims.stop(),
        update: (elapsed) => {
          if (elapsed < HURT_MS) return;
          if (!this.enraged && this.hp <= MAX_HP / 2) this.changeState('enraged');
          else this.changeState('chase');
        },
      },
      enraged: {
        enter: () => {
          this.enraged = true;
          this.setVelocity(0, 0);
          this.play('moblin-roar');
          this.restTint();
          this.scene.cameras.main.shake(300, 0.006);
        },
        update: (elapsed) => { if (elapsed >= ROAR_MS) this.changeState('chase'); },
      },
      dead: {
        enter: () => this.die(),
      },
    };

    this.states.patrol.enter!();
  }

  get arcadeBody() {
    return this.body as Phaser.Physics.Arcade.Body;
  }

  get isDead() {
    return this.current === 'dead';
  }

  /** The lunge hits harder than just bumping into it. */
  get contactDamage() {
    const elapsed = this.scene.time.now - this.stateStartedAt;
    return this.current === 'melee' && elapsed >= WINDUP_MS && elapsed < WINDUP_MS + LUNGE_MS ? 2 : 1;
  }

  update(time: number, player: Player) {
    this.player = player;
    this.setDepth(this.y);
    this.alertMark.setPosition(this.x, this.y - 30);
    this.updateDebugText();
    this.states[this.current].update?.(time - this.stateStartedAt);
  }

  private changeState(next: StateName) {
    this.states[this.current].exit?.();
    this.current = next;
    this.stateStartedAt = this.scene.time.now;
    this.states[next].enter?.();
  }

  // ─── State updates ─────────────────────────────────────────────────────────

  private updatePatrol() {
    if (!this.player.isDead && this.distanceToPlayer() < ALERT_RANGE) {
      this.changeState('alert');
      return;
    }

    // Every so often pick a point near home (or rest)
    const now = this.scene.time.now;
    if (now >= this.nextThinkAt) {
      this.nextThinkAt = now + Phaser.Math.Between(1000, 2500);
      if (Math.random() < 0.3) {
        this.setVelocity(0, 0);
      } else {
        const target = this.home.clone().add(new Phaser.Math.Vector2().setToPolar(
          Phaser.Math.FloatBetween(0, Math.PI * 2), Phaser.Math.FloatBetween(0, PATROL_RADIUS)));
        this.scene.physics.moveTo(this, target.x, target.y, PATROL_SPEED);
      }
    }
    this.faceVelocity();
    if (this.arcadeBody.velocity.lengthSq() === 0) this.anims.pause();
    else this.anims.resume();
  }

  private updateChase() {
    const dist = this.distanceToPlayer();
    if (this.player.isDead || dist > GIVE_UP_RANGE) { this.changeState('patrol'); return; }
    if (dist < MELEE_RANGE) { this.changeState('melee'); return; }

    this.sightClear = hasLineOfSight(this.x, this.y, this.player.x, this.player.y);
    const fireReady = this.scene.time.now >= this.fireReadyAt;
    if (fireReady && this.sightClear && dist >= FIRE_MIN_RANGE && dist <= FIRE_MAX_RANGE) {
      this.changeState('fireCharge');
      return;
    }

    this.scene.physics.moveToObject(this, this.player, this.enraged ? ENRAGED_CHASE_SPEED : CHASE_SPEED);
    this.faceVelocity();
  }

  // Wind-up (flashing red) → lunge along the locked aim → recover (open to counter-attacks)
  private updateMelee(elapsed: number) {
    if (elapsed < WINDUP_MS) {
      this.face(this.player.x);
      this.setTint(Math.floor(elapsed / 60) % 2 ? 0xff5050 : 0xffffff);
    } else if (elapsed < WINDUP_MS + LUNGE_MS) {
      if (this.anims.currentAnim?.key !== 'moblin-lunge') {
        this.restTint();
        this.play('moblin-lunge');
        this.scene.physics.velocityFromRotation(this.aim, LUNGE_SPEED, this.arcadeBody.velocity);
      }
    } else if (elapsed < WINDUP_MS + LUNGE_MS + RECOVER_MS) {
      this.setVelocity(0, 0);
    } else {
      this.changeState('chase');
    }
  }

  // ─── Damage ────────────────────────────────────────────────────────────────

  hit(fromX: number, fromY: number) {
    // Can't be hit while already reeling, roaring or dead
    if (this.current === 'hurt' || this.current === 'enraged' || this.current === 'dead') return false;

    this.hp--;
    if (this.hp <= 0) {
      this.changeState('dead');
      return true;
    }

    this.changeState('hurt'); // also cancels a fire charge or a melee wind-up
    const away = new Phaser.Math.Vector2(this.x - fromX, this.y - fromY).normalize().scale(KNOCKBACK);
    this.setVelocity(away.x, away.y);

    // White flash
    this.setTint(0xffffff).setTintMode(Phaser.TintModes.FILL);
    this.scene.time.delayedCall(90, () => {
      if (this.active && !this.isDead) this.setTintMode(Phaser.TintModes.MULTIPLY).restTint();
    });
    return false;
  }

  private die() {
    this.arcadeBody.enable = false;
    this.alertMark.setVisible(false);
    this.anims.stop();
    this.setTint(0xffffff).setTintMode(Phaser.TintModes.FILL);
    this.scene.tweens.add({
      targets: this, scaleX: 3, scaleY: 0.5, alpha: 0, duration: 220, delay: 90,
      onComplete: () => this.destroy(),
    });
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  private restTint() {
    if (this.enraged) this.setTint(ENRAGED_TINT);
    else this.clearTint();
  }

  private face(targetX: number) {
    this.setFlipX(targetX < this.x);
  }

  private faceVelocity() {
    const vx = this.arcadeBody.velocity.x;
    if (Math.abs(vx) > 1) this.setFlipX(vx < 0);
  }

  /** World position of the mouth, where fireballs come out. */
  private mouth() {
    return { x: this.x + (this.flipX ? -12 : 12), y: this.y - 4 };
  }

  private angleToPlayer() {
    return Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y);
  }

  private distanceToPlayer() {
    return Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y);
  }

  // ─── Debug (G) ─────────────────────────────────────────────────────────────

  private updateDebugText() {
    const show = this.scene.physics.world.drawDebug && !this.isDead;
    this.debugText.setVisible(show);
    if (show) this.debugText.setText(this.current.toUpperCase()).setPosition(this.x, this.y - 22);
  }

  /** Line-of-sight ray toward the player: green when clear, red when blocked by trees. */
  drawDebug(g: Phaser.GameObjects.Graphics) {
    if (this.isDead || !this.player || this.current === 'patrol') return;
    g.lineStyle(1, this.sightClear ? 0x30ff30 : 0xff3030, 0.8).lineBetween(this.x, this.y, this.player.x, this.player.y);
  }

  destroy(fromScene?: boolean) {
    this.alertMark?.destroy();
    this.debugText?.destroy();
    super.destroy(fromScene);
  }
}

/** Steps along the line every half tile and checks the map for trees (water doesn't block fire). */
function hasLineOfSight(x1: number, y1: number, x2: number, y2: number) {
  const steps = Math.ceil(Phaser.Math.Distance.Between(x1, y1, x2, y2) / (TILE_SIZE / 2));
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const col = Math.floor(Phaser.Math.Linear(x1, x2, t) / TILE_SIZE);
    const row = Math.floor(Phaser.Math.Linear(y1, y2, t) / TILE_SIZE);
    if (MAP[row]?.[col] === TREE) return false;
  }
  return true;
}
