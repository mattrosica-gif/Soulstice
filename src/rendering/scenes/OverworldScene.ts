import Phaser from 'phaser'
import { PALETTE } from '../palette'

const TILE = 32
const MAP_W = 28   // tiles wide
const MAP_H = 24   // tiles tall
const PLAYER_SPEED = 120

// Tile IDs
const T = {
  GRASS:   0,
  PATH:    1,
  WALL:    2,
  FLOOR:   3,
  WATER:   4,
  FENCE:   5,
  LANTERN: 6,
}

// 0=grass 1=path 2=wall 3=floor 4=water 5=fence 6=lantern
// Map is 28 wide x 24 tall
const MAP_DATA: number[][] = [
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,5,5,5,5,5,0,0,0,0,0,0,0,5,5,5,5,5,0,0,0,0,0,2],
  [2,0,0,0,5,2,2,2,2,2,5,0,0,0,0,5,2,2,2,2,2,2,5,0,0,0,0,2],
  [2,0,0,0,5,2,3,3,3,2,5,0,0,0,0,5,2,3,3,3,3,2,5,0,0,0,0,2],
  [2,0,0,0,5,2,3,3,3,2,5,0,0,0,0,5,2,3,3,3,3,2,5,0,0,0,0,2],
  [2,0,0,0,5,2,2,2,2,2,5,0,0,0,0,5,2,2,2,2,2,2,5,0,0,0,0,2],
  [2,0,0,0,5,5,5,5,5,5,0,0,0,0,0,0,5,5,5,5,5,5,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,6,0,0,0,1,1,1,1,1,1,0,0,6,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,5,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,5,0,0,0,0,2],
  [2,0,0,0,5,5,5,0,1,1,1,1,1,1,1,1,1,1,1,1,0,5,5,5,0,0,0,2],
  [2,0,0,0,0,5,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,5,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2], // south wall with path exit
]

// Solid tiles (collision)
const SOLID = new Set([T.WALL, T.FENCE, T.WATER])

// NPC positions in tile coords
const STRANGER_POS = { tx: 13, ty: 14 }   // center of the town square, on the path
const EXIT_TILE_Y  = 23                    // row of the south exit

interface NPC {
  sprite: Phaser.GameObjects.Image
  tx: number
  ty: number
  interactable: boolean
}

export class OverworldScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Image
  private playerTileX = 13
  private playerTileY = 8
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private wasd!: Record<string, Phaser.Input.Keyboard.Key>
  private interactKey!: Phaser.Input.Keyboard.Key
  private npcs: NPC[] = []
  private rainGraphics!: Phaser.GameObjects.Graphics
  private rain: Array<{ x: number; y: number; speed: number; length: number; alpha: number }> = []
  private interactPrompt!: Phaser.GameObjects.Container
  private nearNPC: NPC | null = null
  onStrangerTalk?: () => void
  onExitAttempt?: () => void
  private blocked = false   // prevents input during dialog

  constructor() { super({ key: 'Overworld' }) }

  init(data: { onStrangerTalk?: () => void; onExitAttempt?: () => void }) {
    this.onStrangerTalk = data.onStrangerTalk
    this.onExitAttempt = data.onExitAttempt
  }

  create() {
    const mapW = MAP_W * TILE
    const mapH = MAP_H * TILE

    // Draw tilemap
    this.drawTilemap()

    // Rain (world-space, moves with camera)
    this.rainGraphics = this.add.graphics().setDepth(10)
    this.initRain(mapW, mapH)

    // Player
    this.player = this.add.image(
      this.playerTileX * TILE + TILE / 2,
      this.playerTileY * TILE + TILE / 2,
      'player'
    ).setDepth(5)

    // NPCs
    this.spawnNPCs()

    // Camera
    this.cameras.main.setBounds(0, 0, mapW, mapH)
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1)
    this.cameras.main.setZoom(1.5)

    // Interaction prompt
    this.interactPrompt = this.createInteractPrompt()
    this.interactPrompt.setVisible(false).setDepth(20)

    // Input
    this.cursors = this.input.keyboard!.createCursorKeys()
    this.wasd = {
      up:    this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down:  this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left:  this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    }
    this.interactKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E)

    // Ambient lantern flicker
    this.time.addEvent({ delay: 120, callback: this.flickerLanterns, callbackScope: this, loop: true })
  }

  private drawTilemap() {
    const tileKeys = ['tile_grass','tile_path','tile_wall','tile_floor','tile_water','tile_fence','tile_lantern']
    for (let row = 0; row < MAP_H; row++) {
      for (let col = 0; col < MAP_W; col++) {
        const t = MAP_DATA[row][col]
        this.add.image(col * TILE + TILE / 2, row * TILE + TILE / 2, tileKeys[t]).setDepth(0)
      }
    }
  }

  private spawnNPCs() {
    // The complaining stranger — sitting on the path in the square
    const strangerSprite = this.add.image(
      STRANGER_POS.tx * TILE + TILE / 2,
      STRANGER_POS.ty * TILE + TILE / 2,
      'npc_stranger'
    ).setDepth(4)

    // Gentle bob
    this.tweens.add({
      targets: strangerSprite,
      y: strangerSprite.y - 3,
      duration: 1400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

    this.npcs.push({ sprite: strangerSprite, tx: STRANGER_POS.tx, ty: STRANGER_POS.ty, interactable: true })
  }

  private createInteractPrompt(): Phaser.GameObjects.Container {
    const bg = this.add.image(0, 0, 'interact_prompt')
    const text = this.add.text(0, 0, '[E] talk', {
      fontFamily: '"Courier New", monospace',
      fontSize: '9px',
      color: '#c4893a',
    }).setOrigin(0.5)
    return this.add.container(0, 0, [bg, text])
  }

  private playerWorldX() { return this.playerTileX * TILE + TILE / 2 }
  private playerWorldY() { return this.playerTileY * TILE + TILE / 2 }

  private isSolid(tx: number, ty: number): boolean {
    if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) return true
    const t = MAP_DATA[ty]?.[tx]
    if (t === undefined) return true
    if (SOLID.has(t)) return true
    // NPCs block movement
    return this.npcs.some((n) => n.tx === tx && n.ty === ty)
  }

  private tryMove(dx: number, dy: number) {
    if (this.blocked) return
    const nx = this.playerTileX + dx
    const ny = this.playerTileY + dy
    if (this.isSolid(nx, ny)) return

    // Check exit at south wall
    if (ny >= EXIT_TILE_Y && this.onExitAttempt) {
      this.onExitAttempt()
      return
    }

    this.playerTileX = nx
    this.playerTileY = ny

    this.tweens.add({
      targets: this.player,
      x: this.playerWorldX(),
      y: this.playerWorldY(),
      duration: 140,
      ease: 'Linear',
    })
  }

  private moveDebounce = false

  update() {
    if (this.blocked) return

    if (!this.moveDebounce) {
      let dx = 0, dy = 0
      if (this.cursors.left.isDown  || this.wasd.left.isDown)  dx = -1
      if (this.cursors.right.isDown || this.wasd.right.isDown) dx =  1
      if (this.cursors.up.isDown    || this.wasd.up.isDown)    dy = -1
      if (this.cursors.down.isDown  || this.wasd.down.isDown)  dy =  1

      if (dx !== 0 || dy !== 0) {
        this.tryMove(dx, dy)
        this.moveDebounce = true
        this.time.delayedCall(160, () => { this.moveDebounce = false })
      }
    }

    // Check proximity to NPCs
    this.nearNPC = null
    for (const npc of this.npcs) {
      const dist = Math.abs(npc.tx - this.playerTileX) + Math.abs(npc.ty - this.playerTileY)
      if (dist <= 1 && npc.interactable) {
        this.nearNPC = npc
        break
      }
    }

    // Show/hide interact prompt
    if (this.nearNPC) {
      this.interactPrompt.setVisible(true)
      this.interactPrompt.setPosition(this.playerWorldX(), this.playerWorldY() - 36)
    } else {
      this.interactPrompt.setVisible(false)
    }

    // Interact
    if (Phaser.Input.Keyboard.JustDown(this.interactKey) && this.nearNPC) {
      this.blocked = true
      this.interactPrompt.setVisible(false)
      if (this.onStrangerTalk) this.onStrangerTalk()
    }

    // Update rain (in camera space)
    this.updateRain()
  }

  private initRain(w: number, h: number) {
    this.rain = Array.from({ length: 100 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      speed: 5 + Math.random() * 7,
      length: 7 + Math.random() * 12,
      alpha: 0.12 + Math.random() * 0.28,
    }))
  }

  private updateRain() {
    const cam = this.cameras.main
    const vw = cam.width / cam.zoom
    const vh = cam.height / cam.zoom
    const ox = cam.scrollX
    const oy = cam.scrollY

    this.rainGraphics.clear()
    for (const drop of this.rain) {
      drop.x -= drop.speed * 0.15
      drop.y += drop.speed
      if (drop.y > oy + vh + 20 || drop.x < ox - 20) {
        drop.y = oy - 10
        drop.x = ox + Math.random() * vw
      }
      this.rainGraphics.lineStyle(1, PALETTE.rainBlue, drop.alpha)
      this.rainGraphics.beginPath()
      this.rainGraphics.moveTo(drop.x, drop.y)
      this.rainGraphics.lineTo(drop.x - drop.length * 0.15, drop.y - drop.length)
      this.rainGraphics.strokePath()
    }
  }

  private flickerLanterns() {
    // Handled by tweens — no-op, reserved for future lantern sprite effects
  }

  // Called by React when dialog is dismissed — unblock movement
  unblock() { this.blocked = false }
}
