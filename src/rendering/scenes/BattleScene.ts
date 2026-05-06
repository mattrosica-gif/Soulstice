import Phaser from 'phaser'
import { PALETTE } from '../palette'
import { BRIDGE } from '../sceneBridge'
import { useBattleStore } from '../../store/battleStore'
import { tickBattle } from '../../game/combat/battleEngine'
import type { BattleCharacter, BattleEvent } from '../../game/combat/types'

const CELL   = 64
const COLS   = 3
const ROWS   = 2
const GAP    = 40
const TICK   = 220

export class BattleScene extends Phaser.Scene {
  private rain: Array<{x:number;y:number;speed:number;len:number;alpha:number}> = []
  private rainGfx!: Phaser.GameObjects.Graphics
  private charSprites = new Map<string, {
    img: Phaser.GameObjects.Image
    hpGfx: Phaser.GameObjects.Graphics
    label: Phaser.GameObjects.Text
    bob: Phaser.Tweens.Tween
  }>()
  private tickTimer!: Phaser.Time.TimerEvent
  private feedTexts: Phaser.GameObjects.Text[] = []
  private resultShown = false

  constructor() { super({ key: 'Battle' }) }

  create() {
    const { width: W, height: H } = this.scale

    // Warm ground background
    const bg = this.add.graphics()
    bg.fillGradientStyle(0x0d0f14, 0x0d0f14, 0x1a1510, 0x201a10, 1)
    bg.fillRect(0, 0, W, H)

    // Warm wooden floor strip
    const floor = this.add.graphics()
    floor.fillStyle(0x2a2018, 1)
    floor.fillRect(0, H - 90, W, 90)
    floor.fillStyle(0x3a2e20, 0.5)
    for (let x = 0; x < W; x += 18) {
      floor.fillRect(x, H - 90, 1, 90)
    }

    // Ambient fog at top
    const fog = this.add.graphics()
    fog.fillGradientStyle(0x0d0f14, 0x0d0f14, 0x0d0f14, 0x0d0f14, 0.8, 0.8, 0, 0)
    fog.fillRect(0, 0, W, 80)

    // Lanterns — four warm glows
    const lanternPositions = [W * 0.1, W * 0.3, W * 0.7, W * 0.9]
    for (const lx of lanternPositions) {
      const l = this.add.image(lx, H - 80, 'lantern').setScale(1.4).setAlpha(0.7)
      this.tweens.add({
        targets: l, alpha: { from: 0.5, to: 0.9 },
        duration: 1000 + Math.random() * 600,
        yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
      })
    }

    // Dividing line (subtle)
    const divider = this.add.graphics()
    divider.lineStyle(1, PALETTE.amber, 0.15)
    divider.lineBetween(W / 2, 20, W / 2, H - 95)

    this.rainGfx = this.add.graphics().setDepth(8)
    this.initRain(W, H)

    this.drawGrids(W, H)
    this.buildSprites(W, H)
    this.buildHUD(W, H)

    this.tickTimer = this.time.addEvent({
      delay: TICK, callback: this.onTick, callbackScope: this, loop: true,
    })
  }

  private gridOrigin(isPlayer: boolean, W: number, H: number) {
    const gw = COLS * CELL
    const gh = ROWS * CELL
    const x = isPlayer ? W / 2 - GAP / 2 - gw : W / 2 + GAP / 2
    const y = H / 2 - gh / 2 - 20
    return { x, y }
  }

  private drawGrids(W: number, H: number) {
    for (const isPlayer of [true, false]) {
      const { x: ox, y: oy } = this.gridOrigin(isPlayer, W, H)
      // Warm backing panel
      const panel = this.add.graphics()
      panel.fillStyle(isPlayer ? 0x1e1a10 : 0x1a1014, 0.6)
      panel.fillRoundedRect(ox - 4, oy - 4, COLS * CELL + 8, ROWS * CELL + 8, 8)
      panel.lineStyle(1, isPlayer ? 0xc4893a : 0x884428, 0.25)
      panel.strokeRoundedRect(ox - 4, oy - 4, COLS * CELL + 8, ROWS * CELL + 8, 8)

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          this.add.image(ox + c * CELL + CELL / 2, oy + r * CELL + CELL / 2, 'grid_cell')
        }
      }

      // Label
      this.add.text(ox + (COLS * CELL) / 2, oy - 18,
        isPlayer ? 'YOUR TEAM' : 'ENEMIES', {
          fontFamily: '"Courier New", monospace',
          fontSize: '10px',
          color: isPlayer ? '#c4893a' : '#884428',
          alpha: 0.8,
        }).setOrigin(0.5)
    }
  }

  private buildSprites(W: number, H: number) {
    const { battle } = useBattleStore.getState()
    if (!battle) return
    this.placeTeam(battle.playerTeam, true, W, H)
    this.placeTeam(battle.enemyTeam, false, W, H)
  }

  private placeTeam(team: BattleCharacter[], isPlayer: boolean, W: number, H: number) {
    const { x: ox, y: oy } = this.gridOrigin(isPlayer, W, H)
    team.forEach((bc, i) => {
      const col = i % COLS, row = Math.floor(i / COLS)
      const cx = ox + col * CELL + CELL / 2
      const cy = oy + row * CELL + CELL / 2

      const season = bc.character.season
      const key = bc.character.isBonded ? `char_${season}_bonded` : `char_${season}`
      const img = this.add.image(cx, cy, key).setScale(0.85).setDepth(5)

      // Mirror enemies so they face left
      if (!isPlayer) img.setFlipX(true)

      const hpGfx = this.add.graphics().setDepth(6)
      this.drawHpBar(hpGfx, cx, cy + 36, 1.0, PALETTE.hpGreen)

      const label = this.add.text(cx, cy + 45, bc.character.name, {
        fontFamily: '"Courier New", monospace',
        fontSize: '8px',
        color: '#8a7060',
      }).setOrigin(0.5).setDepth(6)

      const bob = this.tweens.add({
        targets: img, y: cy - 4,
        duration: 800 + Math.random() * 400,
        yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
        delay: Math.random() * 400,
      })

      this.charSprites.set(bc.instanceId, { img, hpGfx, label, bob })
    })
  }

  private buildHUD(W: number, H: number) {
    // Bottom bar — warm wood panel
    const hud = this.add.graphics().setDepth(7)
    hud.fillStyle(0x1a1510, 0.9)
    hud.fillRect(0, H - 44, W, 44)
    hud.lineStyle(1, PALETTE.amber, 0.2)
    hud.lineBetween(0, H - 44, W, H - 44)

    this.add.text(12, H - 32, 'battle log', {
      fontFamily: '"Courier New", monospace',
      fontSize: '9px',
      color: '#5a4838',
    }).setDepth(8)
  }

  private drawHpBar(
    g: Phaser.GameObjects.Graphics, cx: number, cy: number,
    frac: number, color: number,
  ) {
    g.clear()
    const w = 46, h = 5
    g.fillStyle(0x1a1208, 0.9)
    g.fillRoundedRect(cx - w / 2, cy, w, h, 2)
    const filled = Math.max(0, Math.round(w * frac))
    if (filled > 0) {
      g.fillStyle(color, 1)
      g.fillRoundedRect(cx - w / 2 + 1, cy + 1, filled - 2, h - 2, 2)
    }
  }

  private onTick() {
    const store = useBattleStore.getState()
    if (!store.battle || store.battle.phase !== 'fighting') return

    const next = tickBattle(store.battle)
    store.tickBattle(next)
    this.syncSprites([...next.playerTeam, ...next.enemyTeam])
    this.showFeed(next.eventLog.slice(-4))

    if (!this.resultShown && (next.phase === 'victory' || next.phase === 'defeat')) {
      this.resultShown = true
      this.tickTimer.remove()
      this.showResult(next.phase)
    }
  }

  private syncSprites(all: BattleCharacter[]) {
    for (const bc of all) {
      const s = this.charSprites.get(bc.instanceId)
      if (!s) continue
      const frac = bc.currentHp / bc.character.stats.maxHp
      const color = frac > 0.5 ? PALETTE.hpGreen : frac > 0.25 ? PALETTE.hpYellow : PALETTE.hpRed
      this.drawHpBar(s.hpGfx, s.img.x, s.img.y + 36, frac, color)
      if (!bc.isAlive) {
        s.bob.stop()
        s.img.setAlpha(0.2).setTint(0x442222)
        s.label.setStyle({ color: '#3a2828' })
      }
    }
  }

  private showFeed(events: BattleEvent[]) {
    this.feedTexts.forEach((t) => t.destroy())
    this.feedTexts = []
    const { width: W, height: H } = this.scale
    events.forEach((ev, i) => {
      let msg = ''
      if (ev.type === 'damage' && ev.value)   msg = `${ev.value} dmg${ev.seasonCounter ? ' ✦' : ''}`
      else if (ev.type === 'heal' && ev.value) msg = `+${ev.value} heal`
      else if (ev.type === 'ability_used')     msg = 'ability ✧'
      else if (ev.type === 'character_defeated') msg = '✦ fallen'
      if (!msg) return
      const t = this.add.text(W / 2 - 60 + i * 80, H - 36, msg, {
        fontFamily: '"Courier New", monospace',
        fontSize: '10px',
        color: ev.type === 'heal' ? '#7ec87e' : ev.seasonCounter ? '#ffd700' : '#8a7060',
      }).setDepth(9)
      this.feedTexts.push(t)
    })
  }

  private showResult(result: 'victory' | 'defeat') {
    const { width: W, height: H } = this.scale

    // Dark overlay
    const overlay = this.add.graphics().setDepth(20)
    overlay.fillStyle(0x000000, 0)
    overlay.fillRect(0, 0, W, H)
    this.tweens.add({ targets: overlay, alpha: 0.6, duration: 500 })

    // Result panel
    const panelW = 320, panelH = 160
    const px = W / 2 - panelW / 2, py = H / 2 - panelH / 2

    const panel = this.add.graphics().setDepth(21)
    panel.fillStyle(0x1a1510, 0.97)
    panel.fillRoundedRect(px, py, panelW, panelH, 12)
    panel.lineStyle(2, result === 'victory' ? 0xc4893a : 0x884428, 0.8)
    panel.strokeRoundedRect(px, py, panelW, panelH, 12)

    const resultText = result === 'victory' ? 'Victory' : 'Defeated'
    const color      = result === 'victory' ? '#c4893a' : '#884428'
    const subText    = result === 'victory'
      ? 'The rain keeps falling.'
      : '"The quieter you become,\nthe more you can hear."'

    this.add.text(W / 2, py + 38, resultText, {
      fontFamily: '"Courier New", monospace',
      fontSize:   '32px',
      color,
      stroke:     '#0d0f14',
      strokeThickness: 4,
    }).setOrigin(0.5).setDepth(22).setAlpha(0).setDepth(22)
    // Fade in
    this.tweens.add({
      targets: this.children.getByName('result') ?? this.add.existing(
        this.add.text(W / 2, py + 38, resultText, {
          fontFamily: '"Courier New", monospace', fontSize: '32px',
          color, stroke: '#0d0f14', strokeThickness: 4,
        }).setOrigin(0.5).setDepth(22).setAlpha(0)
      ),
      alpha: 1, duration: 600, ease: 'Power2',
    })

    this.add.text(W / 2, py + 72, subText, {
      fontFamily: '"Courier New", monospace',
      fontSize:   '12px',
      color:      '#8a7060',
      align:      'center',
      lineSpacing: 4,
    }).setOrigin(0.5).setDepth(22)

    // Return button
    const btnW = 160, btnH = 36
    const bx = W / 2 - btnW / 2, by = py + 108

    const btn = this.add.graphics().setDepth(23).setInteractive(
      new Phaser.Geom.Rectangle(bx, by, btnW, btnH),
      Phaser.Geom.Rectangle.Contains
    )
    const drawBtn = (hover: boolean) => {
      btn.clear()
      btn.fillStyle(hover ? 0x3a2e20 : 0x2a2018, 1)
      btn.fillRoundedRect(bx, by, btnW, btnH, 6)
      btn.lineStyle(1, 0xc4893a, hover ? 0.9 : 0.5)
      btn.strokeRoundedRect(bx, by, btnW, btnH, 6)
    }
    drawBtn(false)

    this.add.text(W / 2, by + btnH / 2, 'return to village', {
      fontFamily: '"Courier New", monospace',
      fontSize:   '13px',
      color:      '#c4893a',
    }).setOrigin(0.5).setDepth(24)

    btn.on('pointerover',  () => drawBtn(true))
    btn.on('pointerout',   () => drawBtn(false))
    btn.on('pointerdown',  () => BRIDGE.onReturnToVillage())
  }

  private initRain(W: number, H: number) {
    this.rain = Array.from({ length: 60 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      speed: 4 + Math.random() * 6, len: 6 + Math.random() * 10,
      alpha: 0.08 + Math.random() * 0.18,
    }))
  }

  update() {
    const { width: W, height: H } = this.scale
    this.rainGfx.clear()
    for (const d of this.rain) {
      d.x -= d.speed * 0.15; d.y += d.speed
      if (d.y > H + 10) { d.y = -10; d.x = Math.random() * W }
      this.rainGfx.lineStyle(1, PALETTE.rainBlue, d.alpha)
      this.rainGfx.beginPath()
      this.rainGfx.moveTo(d.x, d.y)
      this.rainGfx.lineTo(d.x - d.len * 0.15, d.y - d.len)
      this.rainGfx.strokePath()
    }
  }
}
