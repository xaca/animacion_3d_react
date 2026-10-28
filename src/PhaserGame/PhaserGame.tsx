import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { WorldScene } from './scenes/WorldScene';
import { UIScene } from './scenes/UIScene';

const PhaserGame = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserInstance = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (phaserInstance.current) return;
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO, width: 800, height: 600, parent: gameRef.current!,
      backgroundColor: '#1a3a0a', pixelArt: true, antialias: false, roundPixels: true,
      physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 }, debug: false } },
      scene: [WorldScene, UIScene],
    };
    phaserInstance.current = new Phaser.Game(config);
    return () => {
      if (phaserInstance.current) {
        phaserInstance.current.destroy(true);
        phaserInstance.current = null;
      }
    };
  }, []);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: 'linear-gradient(135deg, #0d1f0a 0%, #1a3a10 50%, #0d1f0a 100%)',
    }}>
      <h1 style={{ fontFamily: "'Press Start 2P', monospace", color: '#7ec850', fontSize: '18px', marginBottom: '16px', textShadow: '2px 2px 0 #1a3a0a, 0 0 20px #3a8a2088', letterSpacing: '2px' }}>
        ⚔️ ZELDA WORLD ⚔️
      </h1>
      <div style={{ border: '4px solid #4a7a28', borderRadius: '4px', boxShadow: '0 0 40px #3a8a2066, inset 0 0 20px #00000088' }}>
        <div ref={gameRef} />
      </div>
      <p style={{ fontFamily: 'monospace', color: '#5a8a3c', fontSize: '12px', marginTop: '12px', opacity: 0.7 }}>
        WASD / Flechas para moverte · Espacio para atacar · Corta arbustos y derrota slimes y moblins · G para debug
      </p>
    </div>
  );
};
export default PhaserGame;
