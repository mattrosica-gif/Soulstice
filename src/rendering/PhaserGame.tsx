import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { BootScene } from './scenes/BootScene'
import { MainMenuScene } from './scenes/MainMenuScene'
import { OverworldScene } from './scenes/OverworldScene'
import { BattleScene } from './scenes/BattleScene'

interface PhaserGameProps {
  onMainMenuStart: () => void
  onStrangerTalk: () => void
  onExitAttempt: () => void
}

export function PhaserGame({ onMainMenuStart, onStrangerTalk, onExitAttempt }: PhaserGameProps) {
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
      scene: [BootScene, MainMenuScene, OverworldScene, BattleScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    }

    gameRef.current = new Phaser.Game(config)

    // After boot, wire MainMenu callback
    gameRef.current.events.once(Phaser.Core.Events.READY, () => {
      const mainMenu = gameRef.current?.scene.getScene('MainMenu') as MainMenuScene | undefined
      mainMenu?.scene.restart({ onStart: onMainMenuStart })
    })

    ;(window as any).__soulsticeGame = gameRef.current

    return () => {
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, [])

  // Re-wire overworld callbacks if they change (e.g. after run created)
  useEffect(() => {
    const game: Phaser.Game | undefined = (window as any).__soulsticeGame
    if (!game) return
    const overworld = game.scene.getScene('Overworld') as OverworldScene | undefined
    if (overworld) {
      overworld.onStrangerTalk = onStrangerTalk
      overworld.onExitAttempt = onExitAttempt
    }
  }, [onStrangerTalk, onExitAttempt])

  return (
    <div
      ref={containerRef}
      style={{ width: '800px', height: '560px', imageRendering: 'pixelated' }}
    />
  )
}

export function startOverworldScene(onStrangerTalk: () => void, onExitAttempt: () => void) {
  const game: Phaser.Game | undefined = (window as any).__soulsticeGame
  if (!game) return
  game.scene.getScenes(true).forEach((s) => s.scene.stop())
  game.scene.start('Overworld', { onStrangerTalk, onExitAttempt })
}

export function startBattleScene() {
  const game: Phaser.Game | undefined = (window as any).__soulsticeGame
  if (!game) return
  game.scene.getScenes(true).forEach((s) => s.scene.stop())
  game.scene.start('Battle')
}

export function unblockOverworld() {
  const game: Phaser.Game | undefined = (window as any).__soulsticeGame
  const overworld = game?.scene.getScene('Overworld') as OverworldScene | undefined
  overworld?.unblock()
}
