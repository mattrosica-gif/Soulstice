import Phaser from 'phaser'
import { PALETTE, SEASON_COLORS, SEASON_LIGHT_COLORS } from '../palette'

// Generates all procedural textures before the game starts
export class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'Boot' }) }

  create() {
    this.generateCharacterSprites()
    this.generateUISprites()
    this.scene.start('MainMenu')
  }

  // 16x16 humanoid pixel art — drawn per season with distinct silhouette
  private generateCharacterSprites() {
    const seasons = ['spring', 'summer', 'autumn', 'winter'] as const

    for (const season of seasons) {
      const primary = SEASON_COLORS[season]
      const light   = SEASON_LIGHT_COLORS[season]
      this.drawCharacterTexture(`char_${season}`, primary, light, false)
      this.drawCharacterTexture(`char_${season}_bonded`, primary, light, true)
    }

    // Ram Dass — warm gold, flowing robes, distinctive
    this.drawRamDassTexture()
  }

  private drawCharacterTexture(key: string, bodyColor: number, accentColor: number, bonded: boolean) {
    const g = this.make.graphics({ x: 0, y: 0, add: false })
    const S = 2 // pixel scale — each "pixel" is 2x2 real pixels → 32x32 total

    // Pixel art layout (16x16 grid):
    // Head: cols 5-10, rows 1-5
    // Body: cols 4-11, rows 6-12
    // Legs: cols 5-7 and 9-11, rows 13-15

    const px = (col: number, row: number, color: number) => {
      g.fillStyle(color, 1)
      g.fillRect(col * S, row * S, S, S)
    }

    // Head
    for (let c = 5; c <= 10; c++) for (let r = 1; r <= 5; r++) px(c, r, accentColor)
    // Eyes
    px(6, 3, PALETTE.nightDeep)
    px(9, 3, PALETTE.nightDeep)

    // Body
    for (let c = 4; c <= 11; c++) for (let r = 6; r <= 12; r++) px(c, r, bodyColor)

    // Bonded glow outline
    if (bonded) {
      g.lineStyle(S, PALETTE.amberGlow, 0.7)
      g.strokeRect(3 * S, 0 * S, 10 * S, 16 * S)
    }

    // Legs
    for (let r = 13; r <= 15; r++) {
      px(5, r, bodyColor); px(6, r, bodyColor)
      px(9, r, bodyColor); px(10, r, bodyColor)
    }

    g.generateTexture(key, 16 * S, 16 * S)
    g.destroy()
  }

  private drawRamDassTexture() {
    const g = this.make.graphics({ x: 0, y: 0, add: false })
    const S = 2

    const px = (col: number, row: number, color: number, alpha = 1) => {
      g.fillStyle(color, alpha)
      g.fillRect(col * S, row * S, S, S)
    }

    // Robe — wide, flowing
    for (let c = 3; c <= 12; c++) for (let r = 6; r <= 14; r++) px(c, r, PALETTE.textCream)
    // Head
    for (let c = 5; c <= 10; c++) for (let r = 1; r <= 5; r++) px(c, r, PALETTE.amberSoft)
    // Long white beard
    for (let c = 5; c <= 10; c++) for (let r = 5; r <= 9; r++) px(c, r, 0xffffff)
    // Eyes — warm
    px(6, 3, PALETTE.amber)
    px(9, 3, PALETTE.amber)
    // Warm aura halo
    for (let c = 2; c <= 13; c++) px(c, 0, PALETTE.amberGlow, 0.3)

    g.generateTexture('ramdass', 16 * S, 16 * S)
    g.destroy()
  }

  private generateUISprites() {
    // Grid cell — empty slot
    const cell = this.make.graphics({ x: 0, y: 0, add: false })
    cell.lineStyle(1, PALETTE.panelBorder, 0.6)
    cell.strokeRect(0, 0, 63, 63)
    cell.fillStyle(PALETTE.panelDark, 0.4)
    cell.fillRect(1, 1, 62, 62)
    cell.generateTexture('grid_cell', 64, 64)
    cell.destroy()

    // HP bar background
    const hpBg = this.make.graphics({ x: 0, y: 0, add: false })
    hpBg.fillStyle(PALETTE.panelDark, 0.8)
    hpBg.fillRect(0, 0, 48, 6)
    hpBg.generateTexture('hp_bar_bg', 48, 6)
    hpBg.destroy()

    // Lantern glow — soft circle for atmosphere
    const lantern = this.make.graphics({ x: 0, y: 0, add: false })
    lantern.fillStyle(PALETTE.amberGlow, 0.15)
    lantern.fillCircle(20, 20, 20)
    lantern.fillStyle(PALETTE.amberGlow, 0.4)
    lantern.fillCircle(20, 20, 8)
    lantern.fillStyle(PALETTE.amber, 1)
    lantern.fillCircle(20, 20, 3)
    lantern.generateTexture('lantern', 40, 40)
    lantern.destroy()
  }
}
