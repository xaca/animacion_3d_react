import Phaser from 'phaser';
import { BUSH, COLORS, DEPTH, FLOWER, MOBLIN, PLAYER_MAX_HP, SAND, SLIME, TILE_SIZE, TREE, WATER } from '../config';
import type { RupeeKind } from '../config';
import { MAP, MAP_COLS, MAP_ROWS } from '../map';
import { generateTextures } from '../textures';
import { registerAnimations } from '../animations';
import { Player } from '../entities/Player';
import { Slime } from '../entities/Slime';
import { Moblin } from '../entities/Moblin';
import type { MoblinHooks } from '../entities/Moblin';
import { Fireball } from '../entities/Fireball';
import type { Enemy } from '../entities/Enemy';
import { Pickup } from '../entities/Pickup';
import type { PickupKind } from '../entities/Pickup';

const BUSH_DROP_CHANCE = 0.35;
const SLIME_DROP_CHANCE = 0.7;
const MOBLIN_DROP_CHANCE = 0.9;

type Emitter = Phaser.GameObjects.Particles.ParticleEmitter;

export class WorldScene extends Phaser.Scene {
  private player!: Player;
  private solidLayer!: Phaser.Physics.Arcade.StaticGroup;
  private bushes!: Phaser.Physics.Arcade.StaticGroup;
  private enemies!: Phaser.Physics.Arcade.Group;
  private fireballs!: Phaser.Physics.Arcade.Group;
  private pickups!: Phaser.Physics.Arcade.Group;
  private fx!: { leaves: Emitter; puffs: Emitter; sparks: Emitter; embers: Emitter; flames: Emitter };
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
    this.enemies = this.physics.add.group({ collideWorldBounds: true });
    this.fireballs = this.physics.add.group();
    this.pickups = this.physics.add.group();
    this.createEffects(); // before buildMap: moblin hooks use the emitters
    this.buildMap();

    this.player = new Player(this, MAP_COLS / 2 * TILE_SIZE, MAP_ROWS / 2 * TILE_SIZE);

    // ── Collisions ──
    this.physics.add.collider(this.player, this.solidLayer);
    this.physics.add.collider(this.player, this.bushes);
    this.physics.add.collider(this.enemies, this.solidLayer);
    this.physics.add.collider(this.enemies, this.bushes);
    this.physics.add.collider(this.enemies, this.enemies);
    this.physics.add.overlap(this.player, this.enemies, (_p, e) => this.onTouchEnemy(e as Enemy));
    this.physics.add.overlap(this.player, this.pickups, (_p, p) => this.onTouchPickup(p as Pickup));

    // Fireballs fly over water but burst on trees, burn bushes and hurt the player
    this.physics.add.overlap(this.player, this.fireballs, (_p, f) => this.onFireballHitPlayer(f as Fireball));
    this.physics.add.overlap(this.fireballs, this.solidLayer, (f) => this.popFireball(f as Fireball),
      (_f, s) => (s as Phaser.Physics.Arcade.Sprite).texture.key === 'tree');
    this.physics.add.overlap(this.fireballs, this.bushes, (f, b) => {
      this.popFireball(f as Fireball);
      if ((b as Phaser.Physics.Arcade.Sprite).active) this.cutBush(b as Phaser.Physics.Arcade.Sprite, true);
    });

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

    const moblinHooks: MoblinHooks = {
      fire: (x, y, angle) => this.spawnFireball(x, y, angle),
      charging: (x, y) => this.fx.embers.emitParticleAt(x, y, 1),
    };

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
          // GRASS, plus the floor under bushes and enemy spawns
          this.add.image(cx, cy, 'grass');
          if (tile === BUSH) this.bushes.create(cx, cy, 'bush');
          if (tile === SLIME) this.enemies.add(new Slime(this, cx, cy));
          if (tile === MOBLIN) this.enemies.add(new Moblin(this, cx, cy, moblinHooks));
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
      embers: this.add.particles(0, 0, 'ember', {
        ...base, speed: { min: 5, max: 30 }, lifespan: 300, gravityY: -60,
        scale: { start: 1.5, end: 0 }, tint: [0xfff0a0, 0xffa020, 0xd03010],
      }),
      flames: this.add.particles(0, 0, 'puff', {
        ...base, speed: { min: 20, max: 80 }, lifespan: 450, gravityY: -120,
        scale: { start: 1.6, end: 0 }, tint: [0xffe060, 0xff8020, 0xd03010],
      }),
    };
    Object.values(this.fx).forEach((e) => e.setDepth(DEPTH.effects));
  }

  update(time: number) {
    if (!this.isGameOver) {
      this.player.update();
      if (this.player.isDead) this.onPlayerDied();
    }
    this.enemies.getChildren().forEach((e) => (e as Enemy).update(time, this.player));
    this.updateFireballs();

    this.debugGfx.clear();
    this.resolveSwordHits();
    if (this.physics.world.drawDebug) {
      this.enemies.getChildren().forEach((e) => { if (e instanceof Moblin) e.drawDebug(this.debugGfx); });
    }
  }

  // ─── Sword ─────────────────────────────────────────────────────────────────

  private resolveSwordHits() {
    const rect = this.player.getSwordHitbox();
    if (!rect) return;

    if (this.physics.world.drawDebug) {
      this.debugGfx.lineStyle(1, 0xff3030).strokeRectShape(rect);
    }

    const bodies = this.physics.overlapRect(rect.x, rect.y, rect.width, rect.height, true, true);
    for (const body of bodies) {
      const target = body.gameObject;
      if (!target || !this.player.registerHit(target)) continue;

      if (target instanceof Fireball) this.popFireball(target, true);
      else if (this.enemies.contains(target)) this.hitEnemy(target as Enemy);
      else if (this.bushes.contains(target)) this.cutBush(target as Phaser.Physics.Arcade.Sprite);
    }
  }

  /** Cut with the sword, or burned by a fireball. */
  private cutBush(bush: Phaser.Physics.Arcade.Sprite, burned = false) {
    const { x, y } = bush;
    bush.destroy(); // grass is already drawn underneath
    if (burned) this.fx.flames.explode(14, x, y);
    else this.fx.leaves.explode(10, x, y);
    this.dropLoot(x, y, BUSH_DROP_CHANCE);
  }

  private hitEnemy(enemy: Enemy) {
    const killed = enemy.hit(this.player.x, this.player.y);
    this.fx.sparks.explode(6, enemy.x, enemy.y);
    this.cameras.main.shake(80, 0.003);
    this.hitStop(50);

    if (killed) {
      const isMoblin = enemy instanceof Moblin;
      this.fx.puffs.explode(isMoblin ? 16 : 10, enemy.x, enemy.y);
      this.dropLoot(enemy.x, enemy.y, isMoblin ? MOBLIN_DROP_CHANCE : SLIME_DROP_CHANCE, isMoblin);
    }
  }

  // ─── Fireballs ─────────────────────────────────────────────────────────────

  private spawnFireball(x: number, y: number, angle: number) {
    const fireball = new Fireball(this, x, y);
    this.fireballs.add(fireball);
    fireball.launch(angle); // after add: group defaults reset velocity
    this.fx.embers.explode(4, x, y);
  }

  private updateFireballs() {
    this.fireballs.getChildren().forEach((f) => {
      const fireball = f as Fireball;
      if (fireball.isExpired) this.popFireball(fireball);
      else this.fx.embers.emitParticleAt(fireball.x, fireball.y, 1);
    });
  }

  /** Destroys a fireball with a burst. Sword hits burst into sparks instead of flames. */
  private popFireball(fireball: Fireball, bySword = false) {
    if (!fireball.active) return;
    if (bySword) this.fx.sparks.explode(10, fireball.x, fireball.y);
    else this.fx.flames.explode(8, fireball.x, fireball.y);
    fireball.destroy();
  }

  private onFireballHitPlayer(fireball: Fireball) {
    if (!fireball.active || this.player.isDead) return;
    if (this.player.takeDamage(1, fireball.x, fireball.y)) {
      this.registry.set('hp', this.player.hp);
      this.cameras.main.shake(150, 0.008);
      this.hitStop(80);
    }
    this.popFireball(fireball);
  }

  // ─── Loot ──────────────────────────────────────────────────────────────────

  /** `rich` drops favor blue and red rupees. */
  private dropLoot(x: number, y: number, chance: number, rich = false) {
    if (Math.random() > chance) return;

    let kind: PickupKind;
    if (this.player.hp < PLAYER_MAX_HP && Math.random() < 0.25) {
      kind = 'heart';
    } else {
      const roll = Math.random();
      const [green, blue] = rich ? [0.3, 0.8] : [0.7, 0.95];
      kind = (roll < green ? 'green' : roll < blue ? 'blue' : 'red') as RupeeKind;
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

  private onTouchEnemy(enemy: Enemy) {
    if (enemy.isDead) return;
    if (!this.player.takeDamage(enemy.contactDamage, enemy.x, enemy.y)) return;

    this.registry.set('hp', this.player.hp);
    this.cameras.main.shake(150, 0.008);
    this.hitStop(80);
  }

  private onPlayerDied() {
    this.isGameOver = true;
    this.enemies.setVelocity(0, 0);
    this.fireballs.setVelocity(0, 0);
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
