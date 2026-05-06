import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { BootScene } from './scenes/BootScene'
import { MainMenuScene } from './scenes/MainMenuScene'
import { OverworldScene } from './scenes/OverworldScene'
import { BattleScene } from './scenes/BattleScene'
import { BRIDGE } from './sceneBridge'

interface PhaserGameProps {
  onMainMenuStart:   () => void
  onStrangerTalk:    () => void
  onExitAttempt:     () => void
  onReturnToVillage: () => void
}

export function PhaserGame({ onMainMenuStart, onStrangerTalk, onExitAttempt }: PhaserGameProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef      = useRef<Phaser.Game | null>(null)

  // Keep bridge callbacks current without restarting the game
  BRIDGE.onMainMenuStart   = onMainMenuStart
  BRIDGE.onStrangerTalk    = onStrangerTalk
  BRIDGE.onExitAttempt     = onExitAttempt
  BRIDGE.onReturnToVillage = onReturnToVillage

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return

    gameRef.current = new Phaser.Game({
      type:            Phaser.AUTO,
      width:           800,
      height:          560,
      backgroundColor: '#0d1117',
      pixelArt:        true,
      parent:          containerRef.current,
      scene:           [BootScene, MainMenuScene, OverworldScene, BattleScene],
      scale: {
        mode:       Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    })

    ;(window as any).__soulsticeGame = gameRef.current

    return () => {
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        width:           '800px',
        height:          '560px',
        imageRendering:  'pixelated',
        flexShrink:      0,
      }}
    />
  )
}

export function startOverworldScene() {
  const game: Phaser.Game | undefined = (window as any).__soulsticeGame
  if (!game) return
  game.scene.getScenes(true).forEach((s) => s.scene.stop())
  game.scene.start('Overworld')
}

export function startBattleScene() {
  const game: Phaser.Game | undefined = (window as any).__soulsticeGame
  if (!game) return
  game.scene.getScenes(true).forEach((s) => s.scene.stop())
  game.scene.start('Battle')
}

export function unblockOverworld() {
  const game: Phaser.Game | undefined = (window as any).__soulsticeGame
  const ow = game?.scene.getScene('Overworld') as OverworldScene | undefined
  ow?.unblock()
}
