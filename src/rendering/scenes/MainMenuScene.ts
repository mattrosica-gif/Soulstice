import Phaser from 'phaser'
import { PALETTE } from '../palette'
import { BRIDGE } from '../sceneBridge'

const RAIN_COUNT = 120

interface RainDrop {
  x: number
  y: number
  speed: number
  length: number
  alpha: number
}

export class MainMenuScene extends Phaser.Scene {
  private rain: RainDrop[] = []
  private rainGraphics!: Phaser.GameObjects.Graphics
  private lanterns: Phaser.GameObjects.Image[] = []
  constructor() { super({ key: 'MainMenu' }) }

  create() {
    const { width, height } = this.scale

    // Background gradient — night sky to ground
    const bg = this.add.graphics()
    bg.fillGradientStyle(PALETTE.nightDeep, PALETTE.nightDeep, PALETTE.nightWarm, PALETTE.mossDeep, 1)
    bg.fillRect(0, 0, width, height)

    // Ground strip
    const ground = this.add.graphics()
    ground.fillStyle(PALETTE.mossDeep, 1)
    ground.fillRect(0, height - 60, width, 60)
    ground.fillStyle(PALETTE.mossMid, 1)
    ground.fillRect(0, height - 62, width, 4)

    // Atmospheric lanterns in the background
    const lanternPositions = [
      { x: width * 0.12, y: height * 0.55 },
      { x: width * 0.88, y: height * 0.6 },
      { x: width * 0.35, y: height * 0.7 },
      { x: width * 0.65, y: height * 0.68 },
    ]
    for (const pos of lanternPositions) {
      const l = this.add.image(pos.x, pos.y, 'lantern').setAlpha(0.7)
      this.lanterns.push(l)
      // Gentle flicker
      this.tweens.add({
        targets: l,
        alpha: { from: 0.5, to: 0.9 },
        duration: 1200 + Math.random() * 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      })
    }

    // Rain setup
    this.rainGraphics = this.add.graphics()
    this.initRain(width, height)

    // Title
    const titleY = height * 0.32
    this.add.text(width / 2, titleY, 'SOULSTICE', {
      fontFamily: '"Courier New", monospace',
      fontSize: '52px',
      color: '#e8d5b0',
      stroke: '#0d1117',
      strokeThickness: 6,
      shadow: { offsetX: 0, offsetY: 0, color: '#c4893a', blur: 18, fill: true },
    }).setOrigin(0.5)

    this.add.text(width / 2, titleY + 58, 'a cozy auto-battler', {
      fontFamily: '"Courier New", monospace',
      fontSize: '16px',
      color: '#8a7a65',
    }).setOrigin(0.5)

    // Start prompt — blink
    const startText = this.add.text(width / 2, height * 0.62, 'press any key to begin', {
      fontFamily: '"Courier New", monospace',
      fontSize: '18px',
      color: '#c4893a',
    }).setOrigin(0.5)

    this.tweens.add({
      targets: startText,
      alpha: { from: 1, to: 0.2 },
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

    // Input
    this.input.keyboard?.once('keydown', () => this.handleStart())
    this.input.once('pointerdown', () => this.handleStart())
  }

  private handleStart() {
    BRIDGE.onMainMenuStart()
  }

  private initRain(width: number, height: number) {
    this.rain = Array.from({ length: RAIN_COUNT }, () => this.makeRainDrop(width, height, true))
  }

  private makeRainDrop(width: number, height: number, randomY = false): RainDrop {
    return {
      x: Math.random() * width,
      y: randomY ? Math.random() * height : -10,
      speed: 6 + Math.random() * 8,
      length: 8 + Math.random() * 14,
      alpha: 0.15 + Math.random() * 0.35,
    }
  }

  update() {
    const { width, height } = this.scale
    this.rainGraphics.clear()

    for (const drop of this.rain) {
      drop.x -= drop.speed * 0.18   // slight diagonal
      drop.y += drop.speed

      if (drop.y > height + 20) {
        Object.assign(drop, this.makeRainDrop(width, height))
      }

      this.rainGraphics.lineStyle(1, PALETTE.rainBlue, drop.alpha)
      this.rainGraphics.beginPath()
      this.rainGraphics.moveTo(drop.x, drop.y)
      this.rainGraphics.lineTo(drop.x - drop.length * 0.18, drop.y - drop.length)
      this.rainGraphics.strokePath()
    }
  }
}
