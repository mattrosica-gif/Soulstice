import Phaser from 'phaser'
import { PALETTE } from '../palette'
import { renderPixelMap, PIXEL_SCALE } from '../sprites/pixelMap'
import {
  SEASON_SPRITES, SEASON_PALETTES,
  PLAYER_OVERWORLD_SPRITE, PLAYER_PALETTE,
  RAM_DASS_NPC_SPRITE, RAM_DASS_PALETTE,
} from '../sprites/characterSprites'

const SPRITE_W = 24
const SPRITE_H = 28  // trimmed bottom row
const OVERWORLD_W = 16
const OVERWORLD_H = 16

export class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'Boot' }) }

  create() {
    this.generateCharacterSprites()
    this.generateOverworldSprites()
    this.generateTileTextures()
    this.generateUITextures()
    this.scene.start('Overworld')
  }

  private generateCharacterSprites() {
    const seasons = ['spring', 'summer', 'autumn', 'winter'] as const
    for (const season of seasons) {
      const map = SEASON_SPRITES[season]
      const palette = SEASON_PALETTES[season]
      const w = SPRITE_W * PIXEL_SCALE
      const h = SPRITE_H * PIXEL_SCALE

      // Normal variant
      const g = this.make.graphics({ x: 0, y: 0, add: false })
      renderPixelMap(g, map.slice(0, SPRITE_H), palette, PIXEL_SCALE)
      g.generateTexture(`char_${season}`, w, h)
      g.destroy()

      // Bonded variant — add amber glow outline
      const gb = this.make.graphics({ x: 0, y: 0, add: false })
      renderPixelMap(gb, map.slice(0, SPRITE_H), palette, PIXEL_SCALE)
      gb.lineStyle(2, PALETTE.amberGlow, 0.8)
      gb.strokeRect(2, 2, w - 4, h - 4)
      gb.generateTexture(`char_${season}_bonded`, w, h)
      gb.destroy()
    }
  }

  private generateOverworldSprites() {
    // Player top-down sprite
    const pg = this.make.graphics({ x: 0, y: 0, add: false })
    renderPixelMap(pg, PLAYER_OVERWORLD_SPRITE, PLAYER_PALETTE, PIXEL_SCALE)
    pg.generateTexture('player', OVERWORLD_W * PIXEL_SCALE, OVERWORLD_H * PIXEL_SCALE)
    pg.destroy()

    // Ram Dass NPC sprite
    const rg = this.make.graphics({ x: 0, y: 0, add: false })
    renderPixelMap(rg, RAM_DASS_NPC_SPRITE, RAM_DASS_PALETTE, PIXEL_SCALE)
    // Warm aura underneath
    rg.fillStyle(PALETTE.amberGlow, 0.12)
    rg.fillCircle(OVERWORLD_W * PIXEL_SCALE / 2, OVERWORLD_H * PIXEL_SCALE / 2, OVERWORLD_W * PIXEL_SCALE * 0.7)
    rg.generateTexture('npc_ramdass', OVERWORLD_W * PIXEL_SCALE, OVERWORLD_H * PIXEL_SCALE)
    rg.destroy()

    // Generic NPC sprite (the complaining stranger)
    const ng = this.make.graphics({ x: 0, y: 0, add: false })
    renderPixelMap(ng, PLAYER_OVERWORLD_SPRITE, {
      ...PLAYER_PALETTE,
      C: 0x7a5030, c: 0x9a6840,  // brown coat instead of blue
    }, PIXEL_SCALE)
    ng.generateTexture('npc_stranger', OVERWORLD_W * PIXEL_SCALE, OVERWORLD_H * PIXEL_SCALE)
    ng.destroy()
  }

  private generateTileTextures() {
    const tileSize = 32

    const makeTile = (key: string, cb: (g: Phaser.GameObjects.Graphics) => void) => {
      const g = this.make.graphics({ x: 0, y: 0, add: false })
      cb(g)
      g.generateTexture(key, tileSize, tileSize)
      g.destroy()
    }

    // Grass — dark moss with subtle texture
    makeTile('tile_grass', (g) => {
      g.fillStyle(PALETTE.mossDeep, 1)
      g.fillRect(0, 0, tileSize, tileSize)
      g.fillStyle(PALETTE.mossMid, 0.4)
      // Subtle pixel variation
      for (let i = 0; i < 6; i++) {
        const x = (i * 7 + 3) % tileSize
        const y = (i * 11 + 5) % tileSize
        g.fillRect(x, y, 2, 2)
      }
      // Thin grid line for tile edge
      g.lineStyle(1, 0x000000, 0.08)
      g.strokeRect(0, 0, tileSize, tileSize)
    })

    // Path / cobblestone
    makeTile('tile_path', (g) => {
      g.fillStyle(0x3a3530, 1)
      g.fillRect(0, 0, tileSize, tileSize)
      g.fillStyle(0x4a4540, 0.6)
      g.fillRect(2, 2, 13, 13)
      g.fillRect(17, 2, 13, 13)
      g.fillRect(2, 17, 13, 13)
      g.fillRect(17, 17, 13, 13)
      g.lineStyle(1, 0x000000, 0.2)
      g.strokeRect(0, 0, tileSize, tileSize)
    })

    // Water / puddle
    makeTile('tile_water', (g) => {
      g.fillStyle(0x1a3050, 1)
      g.fillRect(0, 0, tileSize, tileSize)
      g.fillStyle(0x2a4870, 0.5)
      g.fillRect(4, 10, 24, 4)
      g.fillRect(8, 20, 16, 3)
    })

    // Building wall — dark stone
    makeTile('tile_wall', (g) => {
      g.fillStyle(0x282430, 1)
      g.fillRect(0, 0, tileSize, tileSize)
      g.fillStyle(0x3a3545, 0.5)
      // Brick pattern
      g.fillRect(0, 0, 16, 10)
      g.fillRect(16, 0, 16, 10)
      g.fillRect(0, 12, 16, 10)
      g.fillRect(16, 12, 16, 10)
      g.lineStyle(1, 0x000000, 0.3)
      g.strokeRect(0, 0, tileSize, tileSize)
    })

    // Building floor / interior
    makeTile('tile_floor', (g) => {
      g.fillStyle(0x2a2535, 1)
      g.fillRect(0, 0, tileSize, tileSize)
      g.lineStyle(1, 0x3a3548, 0.4)
      g.strokeRect(0, 0, tileSize, tileSize)
    })

    // Lantern post
    makeTile('tile_lantern', (g) => {
      g.fillStyle(PALETTE.mossDeep, 1)
      g.fillRect(0, 0, tileSize, tileSize)
      // Post
      g.fillStyle(0x4a3820, 1)
      g.fillRect(14, 8, 4, 24)
      // Glow
      g.fillStyle(PALETTE.amberGlow, 0.5)
      g.fillCircle(16, 10, 8)
      g.fillStyle(PALETTE.amber, 0.8)
      g.fillCircle(16, 10, 4)
    })

    // Fence
    makeTile('tile_fence', (g) => {
      g.fillStyle(PALETTE.mossDeep, 1)
      g.fillRect(0, 0, tileSize, tileSize)
      g.fillStyle(0x5a4530, 1)
      g.fillRect(0, 12, tileSize, 4)   // horizontal rail
      g.fillRect(6, 6, 3, 20)          // post left
      g.fillRect(23, 6, 3, 20)         // post right
    })
  }

  private generateUITextures() {
    // Grid cell
    const cell = this.make.graphics({ x: 0, y: 0, add: false })
    cell.fillStyle(PALETTE.panelDark, 0.5)
    cell.fillRect(0, 0, 64, 64)
    cell.lineStyle(1, PALETTE.panelBorder, 0.7)
    cell.strokeRect(0, 0, 64, 64)
    cell.generateTexture('grid_cell', 64, 64)
    cell.destroy()

    // HP bar background
    const hpBg = this.make.graphics({ x: 0, y: 0, add: false })
    hpBg.fillStyle(PALETTE.nightDeep, 0.9)
    hpBg.fillRect(0, 0, 52, 7)
    hpBg.lineStyle(1, PALETTE.panelBorder, 0.5)
    hpBg.strokeRect(0, 0, 52, 7)
    hpBg.generateTexture('hp_bar_bg', 52, 7)
    hpBg.destroy()

    // Lantern glow
    const lantern = this.make.graphics({ x: 0, y: 0, add: false })
    lantern.fillStyle(PALETTE.amberGlow, 0.08)
    lantern.fillCircle(24, 24, 24)
    lantern.fillStyle(PALETTE.amberGlow, 0.3)
    lantern.fillCircle(24, 24, 10)
    lantern.fillStyle(PALETTE.amber, 1)
    lantern.fillCircle(24, 24, 4)
    lantern.generateTexture('lantern', 48, 48)
    lantern.destroy()

    // Interaction prompt (E key icon)
    const prompt = this.make.graphics({ x: 0, y: 0, add: false })
    prompt.fillStyle(PALETTE.panelDark, 0.85)
    prompt.fillRoundedRect(0, 0, 40, 20, 3)
    prompt.lineStyle(1, PALETTE.amber, 0.8)
    prompt.strokeRoundedRect(0, 0, 40, 20, 3)
    prompt.generateTexture('interact_prompt', 40, 20)
    prompt.destroy()
  }
}
