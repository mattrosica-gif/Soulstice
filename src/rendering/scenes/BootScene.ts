import Phaser from 'phaser'
import { PALETTE } from '../palette'
import {
  drawCharacter, drawRamDass, drawPlayerTopDown,
  springAccessory, summerAccessory, autumnAccessory, winterAccessory,
} from '../sprites/drawCharacter'

const CHAR_W = 48
const CHAR_H = 56
const TILE   = 32

export class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'Boot' }) }

  create() {
    this.makeCharacterTextures()
    this.makeOverworldTextures()
    this.makeTileTextures()
    this.makeUITextures()
    this.scene.start('MainMenu')
  }

  private makeCharacterTextures() {
    const configs = [
      {
        season: 'spring',
        bodyColor: 0x6ab870, bodyLight: 0x9ed898, bodyDark: 0x3a7840,
        accessoryFn: springAccessory,
      },
      {
        season: 'summer',
        bodyColor: 0xd86030, bodyLight: 0xf09060, bodyDark: 0x903820,
        accessoryFn: summerAccessory,
      },
      {
        season: 'autumn',
        bodyColor: 0xb87038, bodyLight: 0xd89860, bodyDark: 0x784818,
        accessoryFn: autumnAccessory,
      },
      {
        season: 'winter',
        bodyColor: 0x5898c8, bodyLight: 0x88c0e8, bodyDark: 0x285888,
        accessoryFn: winterAccessory,
      },
    ]

    for (const cfg of configs) {
      // Normal
      const g = this.make.graphics({ x: 0, y: 0, add: false })
      drawCharacter(g, { ...cfg, bonded: false })
      g.generateTexture(`char_${cfg.season}`, CHAR_W, CHAR_H)
      g.destroy()

      // Bonded (amber glow ring)
      const gb = this.make.graphics({ x: 0, y: 0, add: false })
      drawCharacter(gb, { ...cfg, bonded: true })
      gb.generateTexture(`char_${cfg.season}_bonded`, CHAR_W, CHAR_H)
      gb.destroy()
    }
  }

  private makeOverworldTextures() {
    // Player
    const pg = this.make.graphics({ x: 0, y: 0, add: false })
    drawPlayerTopDown(pg, 0x5a78c8)
    pg.generateTexture('player', 24, 24)
    pg.destroy()

    // Stranger NPC (brownish coat)
    const ng = this.make.graphics({ x: 0, y: 0, add: false })
    drawPlayerTopDown(ng, 0x7a5828)
    ng.generateTexture('npc_stranger', 24, 24)
    ng.destroy()

    // Ram Dass NPC
    const rg = this.make.graphics({ x: 0, y: 0, add: false })
    drawRamDass(rg)
    rg.generateTexture('npc_ramdass', 48, 56)
    rg.destroy()
  }

  private makeTileTextures() {
    const make = (key: string, cb: (g: Phaser.GameObjects.Graphics) => void) => {
      const g = this.make.graphics({ x: 0, y: 0, add: false })
      cb(g)
      g.generateTexture(key, TILE, TILE)
      g.destroy()
    }

    make('tile_grass', (g) => {
      g.fillStyle(0x2d4a3e, 1)
      g.fillRect(0, 0, TILE, TILE)
      // Subtle dot texture
      g.fillStyle(0x3d6050, 0.5)
      for (let i = 0; i < 8; i++) {
        g.fillRect((i * 9 + 3) % TILE, (i * 13 + 7) % TILE, 2, 2)
      }
    })

    make('tile_path', (g) => {
      g.fillStyle(0x4a4238, 1)
      g.fillRect(0, 0, TILE, TILE)
      g.fillStyle(0x5a5248, 0.6)
      g.fillRect(1, 1, 14, 14)
      g.fillRect(17, 1, 14, 14)
      g.fillRect(1, 17, 14, 14)
      g.fillRect(17, 17, 14, 14)
      g.lineStyle(1, 0x2a2420, 0.4)
      g.strokeRect(0, 0, TILE, TILE)
    })

    make('tile_wall', (g) => {
      g.fillStyle(0x2a2535, 1)
      g.fillRect(0, 0, TILE, TILE)
      g.fillStyle(0x3a3548, 0.5)
      g.fillRect(0, 0, 15, 10); g.fillRect(17, 0, 15, 10)
      g.fillRect(0, 12, 15, 10); g.fillRect(17, 12, 15, 10)
      g.fillRect(0, 24, 15, 8);  g.fillRect(17, 24, 15, 8)
    })

    make('tile_floor', (g) => {
      g.fillStyle(0x2a2230, 1)
      g.fillRect(0, 0, TILE, TILE)
      g.lineStyle(1, 0x3a3248, 0.3)
      g.strokeRect(0, 0, TILE, TILE)
    })

    make('tile_water', (g) => {
      g.fillStyle(0x182840, 1)
      g.fillRect(0, 0, TILE, TILE)
      g.fillStyle(0x2a4860, 0.6)
      g.fillRect(3, 10, 26, 5)
      g.fillRect(6, 20, 20, 4)
    })

    make('tile_fence', (g) => {
      g.fillStyle(0x2d4a3e, 1)
      g.fillRect(0, 0, TILE, TILE)
      g.fillStyle(0x6a4c28, 1)
      g.fillRect(0, 10, TILE, 5)
      g.fillRect(5, 4, 4, 24)
      g.fillRect(23, 4, 4, 24)
    })

    make('tile_lantern', (g) => {
      g.fillStyle(0x2d4a3e, 1)
      g.fillRect(0, 0, TILE, TILE)
      // Post
      g.fillStyle(0x5a4020, 1)
      g.fillRect(14, 10, 4, 22)
      // Glow
      g.fillStyle(PALETTE.amberGlow, 0.2)
      g.fillCircle(16, 12, 12)
      g.fillStyle(PALETTE.amberGlow, 0.5)
      g.fillCircle(16, 12, 6)
      g.fillStyle(PALETTE.amber, 1)
      g.fillCircle(16, 12, 3)
    })
  }

  private makeUITextures() {
    // Battle grid cell — warm wood tone
    const cell = this.make.graphics({ x: 0, y: 0, add: false })
    cell.fillStyle(0x2a2218, 0.7)
    cell.fillRoundedRect(1, 1, 62, 62, 6)
    cell.lineStyle(1, 0xc4893a, 0.25)
    cell.strokeRoundedRect(1, 1, 62, 62, 6)
    cell.generateTexture('grid_cell', 64, 64)
    cell.destroy()

    // HP bar bg
    const hpBg = this.make.graphics({ x: 0, y: 0, add: false })
    hpBg.fillStyle(0x1a1208, 0.9)
    hpBg.fillRoundedRect(0, 0, 52, 8, 4)
    hpBg.generateTexture('hp_bar_bg', 52, 8)
    hpBg.destroy()

    // Lantern (UI element)
    const lan = this.make.graphics({ x: 0, y: 0, add: false })
    lan.fillStyle(PALETTE.amberGlow, 0.1)
    lan.fillCircle(24, 24, 24)
    lan.fillStyle(PALETTE.amberGlow, 0.4)
    lan.fillCircle(24, 24, 10)
    lan.fillStyle(PALETTE.amber, 1)
    lan.fillCircle(24, 24, 4)
    lan.generateTexture('lantern', 48, 48)
    lan.destroy()

    // Interact prompt
    const prompt = this.make.graphics({ x: 0, y: 0, add: false })
    prompt.fillStyle(0x1a1208, 0.9)
    prompt.fillRoundedRect(0, 0, 48, 22, 4)
    prompt.lineStyle(1, PALETTE.amber, 0.7)
    prompt.strokeRoundedRect(0, 0, 48, 22, 4)
    prompt.generateTexture('interact_prompt', 48, 22)
    prompt.destroy()

    // Warm panel background for battle
    const panel = this.make.graphics({ x: 0, y: 0, add: false })
    panel.fillStyle(0x1a1510, 0.85)
    panel.fillRoundedRect(0, 0, 200, 120, 8)
    panel.lineStyle(1, 0xc4893a, 0.3)
    panel.strokeRoundedRect(0, 0, 200, 120, 8)
    panel.generateTexture('warm_panel', 200, 120)
    panel.destroy()
  }
}
