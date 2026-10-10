import Phaser from 'phaser';
import { PLAYER_MAX_HP } from '../config';

const FONT = "'Press Start 2P', monospace";

// HUD overlay. Runs in parallel with WorldScene and is not affected by its camera zoom.
// Reads everything from the game registry: hp, rupees, gameOver.
export class UIScene extends Phaser.Scene {
  private hearts: Phaser.GameObjects.Image[] = [];
  private rupeeText!: Phaser.GameObjects.Text;
  private gameOver!: Phaser.GameObjects.Container;
  private lastRupees = 0;

  constructor() {
    super({ key: 'UIScene' });
  }

  create() {
    const { width, height } = this.scale;

    // Hearts
    this.hearts = Array.from({ length: PLAYER_MAX_HP }, (_, i) =>
      this.add.image(16 + i * 20, 16, 'heart_full').setOrigin(0).setScale(2));

    // Rupee counter
    this.add.image(18, 44, 'rupee_green').setOrigin(0).setScale(2);
    this.rupeeText = this.add.text(36, 48, '0', { fontFamily: FONT, fontSize: '12px', color: '#ffffff' })
      .setStroke('#000000', 4);

    // Controls hint
    this.add.text(10, height - 10, 'WASD / Flechas: mover · Espacio: espada · G: debug', {
      fontSize: '11px', color: '#ffffff', backgroundColor: '#00000088', padding: { x: 6, y: 4 },
    }).setOrigin(0, 1);

    // Game over overlay
    this.gameOver = this.add.container(0, 0, [
      this.add.rectangle(0, 0, width, height, 0x000000, 0.65).setOrigin(0),
      this.add.text(width / 2, height / 2 - 16, 'GAME OVER', { fontFamily: FONT, fontSize: '28px', color: '#e02828' })
        .setOrigin(0.5).setStroke('#000000', 6),
      this.add.text(width / 2, height / 2 + 24, 'Pulsa R para reiniciar', { fontFamily: FONT, fontSize: '12px', color: '#ffffff' })
        .setOrigin(0.5),
    ]).setVisible(false);

    this.registry.events.on('setdata', this.render, this);
    this.registry.events.on('changedata', this.render, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.registry.events.off('setdata', this.render, this);
      this.registry.events.off('changedata', this.render, this);
    });

    this.render();
  }

  private render() {
    const hp: number = this.registry.get('hp') ?? PLAYER_MAX_HP;
    const rupees: number = this.registry.get('rupees') ?? 0;

    this.hearts.forEach((heart, i) => heart.setTexture(i < hp ? 'heart_full' : 'heart_empty'));

    this.rupeeText.setText(String(rupees));
    if (rupees > this.lastRupees) {
      this.tweens.add({ targets: this.rupeeText, scale: { from: 1.4, to: 1 }, duration: 150 });
    }
    this.lastRupees = rupees;

    this.gameOver.setVisible(!!this.registry.get('gameOver'));
  }
}
