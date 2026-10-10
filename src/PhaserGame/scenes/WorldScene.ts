import Phaser from 'phaser';
import { BUSH, COLORS, DEPTH, FLOWER, PLAYER_MAX_HP, SAND, SLIME, TILE_SIZE, TREE, WATER } from '../config';
import type { RupeeKind } from '../config';
import { MAP, MAP_COLS, MAP_ROWS } from '../map';
import { generateTextures } from '../textures';
import { registerAnimations } from '../animations';
import { Player } from '../entities/Player';
import { Slime } from '../entities/Slime';
import { Pickup } from '../entities/Pickup';
import type { PickupKind } from '../entities/Pickup';

const BUSH_DROP_CHANCE = 0.35;
const SLIME_DROP_CHANCE = 0.7;

type Emitter = Phaser.GameObjects.Particles.ParticleEmitter;

export class WorldScene extends Phaser.Scene {
  private player!: Player;
  private solidLayer!: Phaser.Physics.Arcade.StaticGroup;
  private bushes!: Phaser.Physics.Arcade.StaticGroup;
  private slimes!: Phaser.Physics.Arcade.Group;
  private pickups!: Phaser.Physics.Arcade.Group;
  private fx!: { leaves: Emitter; puffs: Emitter; sparks: Emitter };
  private debugGfx!: Phaser.GameObjects.Graphics;
  private isGameOver = false;

  constructor() {
    super({ key: 'WorldScene' });
  }

  preload() {
    generateTextures(this);
  }

  create() {
    const mapW = MAP_COLS * TILE_SIZE;
    const mapH = MAP_ROWS * TILE_SIZE;

    // Scene instances are reused on restart: reset state here, not in field initializers
    this.isGameOver = false;
    this.physics.resume();
    this.registry.set({ hp: PLAYER_MAX_HP, rupees: 0, gameOver: false });

    // Background
    this.add.rectangle(0, 0, mapW, mapH, COLORS.grassBase).setOrigin(0);

    registerAnimations(this); // before buildMap: water tiles play 'water'
    this.slimes = this.physics.add.group({ collideWorldBounds: true });
    this.pickups = this.physics.add.group();
    this.buildMap();
    this.createEffects();

    this.player = new Player(this, MAP_COLS / 2 * TILE_SIZE, MAP_ROWS / 2 * TILE_SIZE);

    // ── Collisions ──
    this.physics.add.collider(this.player, this.solidLayer);
    this.physics.add.collider(this.player, this.bushes);
    this.physics.add.collider(this.slimes, this.solidLayer);
    this.physics.add.collider(this.slimes, this.bushes);
    this.physics.add.collider(this.slimes, this.slimes);
    this.physics.add.overlap(this.player, this.slimes, (_p, s) => this.onTouchSlime(s as Slime));
    this.physics.add.overlap(this.player, this.pickups, (_p, p) => this.onTouchPickup(p as Pickup));

    // ── Camera ──
    this.cameras.main.setBounds(0, 0, mapW, mapH).startFollow(this.player, true, 0.1, 0.1).setZoom(1.5);
    this.physics.world.setBounds(0, 0, mapW, mapH);

    // ── HUD & debug ──
    if (!this.scene.isActive('UIScene')) this.scene.launch('UIScene');
    this.debugGfx = this.add.graphics().setDepth(DEPTH.effects + 1);
    this.input.keyboard!.on('keydown-G', () => this.toggleDebug());
  }

  private buildMap() {
    this.solidLayer = this.physics.add.staticGroup();
    this.bushes = this.physics.add.staticGroup();

    for (let row = 0; row < MAP_ROWS; row++) {
      for (let col = 0; col < MAP_COLS; col++) {
        const tile = MAP[row][col];
        const cx = col * TILE_SIZE + TILE_SIZE / 2;
        const cy = row * TILE_SIZE + TILE_SIZE / 2;

        if (tile === SAND) this.add.image(cx, cy, 'sand');
        else if (tile === FLOWER) this.add.image(cx, cy, 'flower');
        else if (tile === WATER) {
          this.add.sprite(cx, cy, 'water0').play('water');
          const body = this.solidLayer.create(cx, cy, 'water0') as Phaser.Physics.Arcade.Sprite;
          body.setVisible(false).refreshBody();
        } else if (tile === TREE) {
          this.add.image(cx, cy, 'grass');
          this.add.image(cx, cy, 'tree');
          const body = this.solidLayer.create(cx, cy, 'tree') as Phaser.Physics.Arcade.Sprite;
          body.setVisible(false).refreshBody();
        } else {
          // GRASS, plus the floor under bushes and slime spawns
          this.add.image(cx, cy, 'grass');
          if (tile === BUSH) this.bushes.create(cx, cy, 'bush');
          if (tile === SLIME) this.slimes.add(new Slime(this, cx, cy));
        }
      }
    }
  }

  private createEffects() {
    const base = { emitting: false, alpha: { start: 1, end: 0 } };
    this.fx = {
      leaves: this.add.particles(0, 0, 'leaf', {
        ...base, speed: { min: 40, max: 120 }, lifespan: 500, gravityY: 220,
        scale: { start: 2, end: 1.5 }, rotate: { min: 0, max: 360 },
      }),
      puffs: this.add.particles(0, 0, 'puff', {
        ...base, speed: { min: 20, max: 70 }, lifespan: 400, scale: { start: 2, end: 0 },
      }),
      sparks: this.add.particles(0, 0, 'spark', {
        ...base, speed: { min: 40, max: 110 }, lifespan: 300, scale: { start: 2, end: 0 }, tint: 0xfff2a0,
      }),
    };
    Object.values(this.fx).forEach((e) => e.setDepth(DEPTH.effects));
  }

  update(time: number) {
    if (!this.isGameOver) {
      this.player.update();
      if (this.player.isDead) this.onPlayerDied();
    }
    this.slimes.getChildren().forEach((s) => (s as Slime).update(time, this.player));
    this.resolveSwordHits();
  }

  // ─── Sword ─────────────────────────────────────────────────────────────────

  private resolveSwordHits() {
    const rect = this.player.getSwordHitbox();
    this.debugGfx.clear();
    if (!rect) return;

    if (this.physics.world.drawDebug) {
      this.debugGfx.lineStyle(1, 0xff3030).strokeRectShape(rect);
    }

    const bodies = this.physics.overlapRect(rect.x, rect.y, rect.width, rect.height, true, true);
    for (const body of bodies) {
      const target = body.gameObject;
      if (!target || !this.player.registerHit(target)) continue;

      if (target instanceof Slime) this.hitSlime(target);
      else if (this.bushes.contains(target)) this.cutBush(target as Phaser.Physics.Arcade.Sprite);
    }
  }

  private cutBush(bush: Phaser.Physics.Arcade.Sprite) {
    const { x, y } = bush;
    bush.destroy(); // grass is already drawn underneath
    this.fx.leaves.explode(10, x, y);
    this.dropLoot(x, y, BUSH_DROP_CHANCE);
  }

  private hitSlime(slime: Slime) {
    const killed = slime.hit(this.player.x, this.player.y);
    this.fx.sparks.explode(6, slime.x, slime.y);
    this.cameras.main.shake(80, 0.003);
    this.hitStop(50);

    if (killed) {
      this.fx.puffs.explode(10, slime.x, slime.y);
      this.dropLoot(slime.x, slime.y, SLIME_DROP_CHANCE);
    }
  }

  // ─── Loot ──────────────────────────────────────────────────────────────────

  private dropLoot(x: number, y: number, chance: number) {
    if (Math.random() > chance) return;

    let kind: PickupKind;
    if (this.player.hp < PLAYER_MAX_HP && Math.random() < 0.25) {
      kind = 'heart';
    } else {
      const roll = Math.random();
      kind = (roll < 0.7 ? 'green' : roll < 0.95 ? 'blue' : 'red') as RupeeKind;
    }
    this.pickups.add(new Pickup(this, x, y, kind));
  }

  private onTouchPickup(pickup: Pickup) {
    if (!pickup.canCollect || this.player.isDead) return;

    if (pickup.kind === 'heart') {
      this.player.heal(1);
      this.registry.set('hp', this.player.hp);
    } else {
      this.registry.inc('rupees', pickup.rupeeValue);
    }
    this.fx.sparks.explode(8, pickup.x, pickup.y);
    pickup.destroy();
  }

  // ─── Damage & game over ────────────────────────────────────────────────────

  private onTouchSlime(slime: Slime) {
    if (slime.isDead) return;
    if (!this.player.takeDamage(1, slime.x, slime.y)) return;

    this.registry.set('hp', this.player.hp);
    this.cameras.main.shake(150, 0.008);
    this.hitStop(80);
  }

  private onPlayerDied() {
    this.isGameOver = true;
    this.slimes.setVelocity(0, 0);
    this.time.delayedCall(700, () => {
      this.physics.pause();
      this.registry.set('gameOver', true);
      this.input.keyboard!.once('keydown-R', () => this.scene.restart());
    });
  }

  /** Freezes physics for a moment so hits feel heavier. */
  private hitStop(ms: number) {
    this.physics.pause();
    this.time.delayedCall(ms, () => {
      if (!this.isGameOver) this.physics.resume();
    });
  }

  private toggleDebug() {
    const world = this.physics.world;
    if (!world.debugGraphic) world.createDebugGraphic().setDepth(DEPTH.effects + 1);
    world.drawDebug = !world.drawDebug;
    world.debugGraphic.clear();
  }
}
