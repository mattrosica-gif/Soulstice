import Phaser from 'phaser'
import { PALETTE, SEASON_COLORS } from '../palette'
import { useBattleStore } from '../../store/battleStore'
import { tickBattle } from '../../game/combat/battleEngine'
import type { BattleCharacter } from '../../game/combat/types'

const CELL_SIZE = 64
const GRID_COLS = 3
const GRID_ROWS = 2
const GRID_GAP = 24       // gap between player grid and enemy grid
const TICK_MS = 200       // ms per battle tick

interface CharacterSprite {
  instanceId: string
  base: Phaser.GameObjects.Image
  hpBarBg: Phaser.GameObjects.Image
  hpBarFill: Phaser.GameObjects.Graphics
  nameText: Phaser.GameObjects.Text
  bobTween: Phaser.Tweens.Tween
}

export class BattleScene extends Phaser.Scene {
  private rainGraphics!: Phaser.GameObjects.Graphics
  private rain: Array<{ x: number; y: number; speed: number; length: number; alpha: number }> = []
  private characterSprites: Map<string, CharacterSprite> = new Map()
  private tickTimer!: Phaser.Time.TimerEvent
  private eventFeedTexts: Phaser.GameObjects.Text[] = []

  constructor() { super({ key: 'Battle' }) }

  create() {
    const { width, height } = this.scale

    // Dark rainy background
    const bg = this.add.graphics()
    bg.fillGradientStyle(PALETTE.nightDeep, PALETTE.nightDeep, PALETTE.nightWarm, PALETTE.mossDeep, 1)
    bg.fillRect(0, 0, width, height)

    // Ground
    const ground = this.add.graphics()
    ground.fillStyle(PALETTE.mossDeep, 1)
    ground.fillRect(0, height - 50, width, 50)

    this.rainGraphics = this.add.graphics()
    this.initRain(width, height)

    this.drawGrids(width, height)
    this.buildCharacterSprites()

    // Lantern atmosphere
    this.add.image(40, height - 80, 'lantern').setAlpha(0.6).setScale(1.2)
    this.add.image(width - 40, height - 80, 'lantern').setAlpha(0.6).setScale(1.2)

    // Tick timer — drives the auto-battle
    this.tickTimer = this.time.addEvent({
      delay: TICK_MS,
      callback: this.runTick,
      callbackScope: this,
      loop: true,
    })
  }

  // Grid layout — player left, enemy right, centered vertically
  private gridOrigin(isPlayer: boolean, width: number, height: number) {
    const totalGridW = GRID_COLS * CELL_SIZE
    const totalGridH = GRID_ROWS * CELL_SIZE
    const centerX = width / 2
    const centerY = height / 2 - 20

    const x = isPlayer
      ? centerX - GRID_GAP / 2 - totalGridW
      : centerX + GRID_GAP / 2
    const y = centerY - totalGridH / 2
    return { x, y }
  }

  private drawGrids(width: number, height: number) {
    for (const isPlayer of [true, false]) {
      const { x: ox, y: oy } = this.gridOrigin(isPlayer, width, height)
      for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
          this.add.image(ox + col * CELL_SIZE + CELL_SIZE / 2, oy + row * CELL_SIZE + CELL_SIZE / 2, 'grid_cell')
        }
      }

      // Label
      this.add.text(ox + (GRID_COLS * CELL_SIZE) / 2, oy - 16, isPlayer ? 'YOUR TEAM' : 'ENEMIES', {
        fontFamily: '"Courier New", monospace',
        fontSize: '11px',
        color: isPlayer ? '#7ec87e' : '#e87e3e',
      }).setOrigin(0.5)
    }
  }

  private buildCharacterSprites() {
    const { battle } = useBattleStore.getState()
    if (!battle) return

    const { width, height } = this.scale

    this.placeTeamSprites(battle.playerTeam, true, width, height)
    this.placeTeamSprites(battle.enemyTeam, false, width, height)
  }

  private placeTeamSprites(
    team: BattleCharacter[],
    isPlayer: boolean,
    width: number,
    height: number
  ) {
    const { x: ox, y: oy } = this.gridOrigin(isPlayer, width, height)

    team.forEach((bc, idx) => {
      const col = idx % GRID_COLS
      const row = Math.floor(idx / GRID_COLS)
      const cx = ox + col * CELL_SIZE + CELL_SIZE / 2
      const cy = oy + row * CELL_SIZE + CELL_SIZE / 2

      const season = bc.character.season
      const textureKey = bc.character.isBonded ? `char_${season}_bonded` : `char_${season}`

      const base = this.add.image(cx, cy, textureKey).setScale(2)

      // HP bar
      const hpBarBg = this.add.image(cx, cy + 22, 'hp_bar_bg')
      const hpBarFill = this.add.graphics()
      this.drawHpBar(hpBarFill, cx - 24, cy + 19, 1.0, PALETTE.hpGreen)

      // Name
      const nameText = this.add.text(cx, cy + 30, bc.character.name, {
        fontFamily: '"Courier New", monospace',
        fontSize: '9px',
        color: '#8a7a65',
      }).setOrigin(0.5)

      // Idle bob tween
      const bobTween = this.tweens.add({
        targets: base,
        y: cy - 3,
        duration: 900 + Math.random() * 300,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: Math.random() * 500,
      })

      this.characterSprites.set(bc.instanceId, { instanceId: bc.instanceId, base, hpBarBg, hpBarFill, nameText, bobTween })
    })
  }

  private drawHpBar(g: Phaser.GameObjects.Graphics, x: number, y: number, fraction: number, color: number) {
    g.clear()
    const filled = Math.max(0, Math.round(46 * fraction))
    g.fillStyle(color, 1)
    g.fillRect(x, y, filled, 4)
  }

  private runTick() {
    const store = useBattleStore.getState()
    if (!store.battle || store.battle.phase !== 'fighting') return

    const next = tickBattle(store.battle)
    store.tickBattle(next)

    this.syncSpritesToState(next.playerTeam.concat(next.enemyTeam))

    // Log recent events to feed
    const recent = next.eventLog.slice(-3)
    this.updateEventFeed(recent)

    if (next.phase === 'victory' || next.phase === 'defeat') {
      this.tickTimer.remove()
      this.showBattleResult(next.phase)
    }
  }

  private syncSpritesToState(allChars: BattleCharacter[]) {
    for (const bc of allChars) {
      const sprite = this.characterSprites.get(bc.instanceId)
      if (!sprite) continue

      const fraction = bc.currentHp / bc.character.stats.maxHp
      const color = fraction > 0.5 ? PALETTE.hpGreen : fraction > 0.25 ? PALETTE.hpYellow : PALETTE.hpRed
      this.drawHpBar(sprite.hpBarFill, sprite.base.x - 24, sprite.base.y + 19, fraction, color)

      if (!bc.isAlive) {
        sprite.base.setAlpha(0.25)
        sprite.bobTween.stop()
        sprite.nameText.setStyle({ color: '#444444' })
      }
    }
  }

  private updateEventFeed(events: import('../../game/combat/types').BattleEvent[]) {
    // Clean up old texts
    this.eventFeedTexts.forEach((t) => t.destroy())
    this.eventFeedTexts = []

    const { height } = this.scale
    events.forEach((event, i) => {
      let msg = ''
      if (event.type === 'damage' && event.value)  msg = `${event.value} dmg${event.seasonCounter ? ' ★' : ''}`
      else if (event.type === 'heal' && event.value) msg = `+${event.value} hp`
      else if (event.type === 'character_defeated')  msg = 'defeated'
      else if (event.type === 'ability_used')        msg = `ability used`
      if (!msg) return

      const t = this.add.text(10, height - 100 + i * 16, msg, {
        fontFamily: '"Courier New", monospace',
        fontSize: '11px',
        color: event.type === 'heal' ? '#7ec87e' : event.seasonCounter ? '#ffd700' : '#8a7a65',
      })
      this.eventFeedTexts.push(t)
    })
  }

  private showBattleResult(result: 'victory' | 'defeat') {
    const { width, height } = this.scale
    const color = result === 'victory' ? '#7ec87e' : '#f44336'
    const label = result === 'victory' ? 'VICTORY' : 'DEFEAT'

    const text = this.add.text(width / 2, height / 2, label, {
      fontFamily: '"Courier New", monospace',
      fontSize: '48px',
      color,
      stroke: '#0d1117',
      strokeThickness: 8,
    }).setOrigin(0.5).setAlpha(0)

    this.tweens.add({ targets: text, alpha: 1, duration: 600, ease: 'Power2' })
  }

  // Rain identical to MainMenuScene
  private initRain(width: number, height: number) {
    this.rain = Array.from({ length: 80 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: 5 + Math.random() * 7,
      length: 6 + Math.random() * 12,
      alpha: 0.10 + Math.random() * 0.25,
    }))
  }

  update() {
    const { width, height } = this.scale
    this.rainGraphics.clear()
    for (const drop of this.rain) {
      drop.x -= drop.speed * 0.18
      drop.y += drop.speed
      if (drop.y > height + 20) { drop.y = -10; drop.x = Math.random() * width }
      this.rainGraphics.lineStyle(1, PALETTE.rainBlue, drop.alpha)
      this.rainGraphics.beginPath()
      this.rainGraphics.moveTo(drop.x, drop.y)
      this.rainGraphics.lineTo(drop.x - drop.length * 0.18, drop.y - drop.length)
      this.rainGraphics.strokePath()
    }
  }
}
