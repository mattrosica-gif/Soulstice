import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { BootScene } from './scenes/BootScene'
import { MainMenuScene } from './scenes/MainMenuScene'
import { BattleScene } from './scenes/BattleScene'

interface PhaserGameProps {
  onMainMenuStart: () => void
}

export function PhaserGame({ onMainMenuStart }: PhaserGameProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 560,
      backgroundColor: '#0d1117',
      pixelArt: true,
      parent: containerRef.current,
      scene: [BootScene, MainMenuScene, BattleScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      callbacks: {
        postBoot: (game) => {
          // Pass React callbacks into MainMenu via scene data when it starts
          game.events.on('scene-start-MainMenu', () => {
            game.scene.getScene('MainMenu').scene.restart({ onStart: onMainMenuStart })
          })
        },
      },
    }

    gameRef.current = new Phaser.Game(config)

    // Wire the MainMenu's start callback after boot
    gameRef.current.events.once(Phaser.Core.Events.READY, () => {
      const mainMenu = gameRef.current?.scene.getScene('MainMenu') as MainMenuScene | undefined
      if (mainMenu) {
        mainMenu.scene.restart({ onStart: onMainMenuStart })
      }
    })

    return () => {
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, [])

  // Expose a way for React to transition Phaser scenes
  useEffect(() => {
    (window as any).__soulsticeGame = gameRef.current
  }, [gameRef.current])

  return (
    <div
      ref={containerRef}
      style={{ width: '800px', height: '560px', imageRendering: 'pixelated' }}
    />
  )
}

// Helper — React code calls this to tell Phaser to switch to the battle scene
export function startBattleScene() {
  const game: Phaser.Game | undefined = (window as any).__soulsticeGame
  if (!game) return
  const current = game.scene.getScenes(true)[0]
  if (current) current.scene.stop()
  game.scene.start('Battle')
}
