import Phaser from 'phaser'

// Cute round character drawing — Kirby/blob proportions
// Big round head with shine, tiny body, dot eyes, seasonal accessory
// Size: 48x56 canvas

export interface CharacterDrawOptions {
  bodyColor:    number
  bodyLight:    number   // highlight (lighter)
  bodyDark:     number   // shadow (darker)
  accessoryFn:  (g: Phaser.GameObjects.Graphics, cx: number, headY: number) => void
  bonded?:      boolean
}

export function drawCharacter(
  g: Phaser.GameObjects.Graphics,
  opts: CharacterDrawOptions,
) {
  const cx   = 24   // center x
  const cy   = 28   // center y of head
  const R    = 18   // head radius

  // Drop shadow
  g.fillStyle(0x000000, 0.25)
  g.fillEllipse(cx, 54, 30, 8)

  // Bonded amber outline ring
  if (opts.bonded) {
    g.lineStyle(3, 0xffd78a, 0.85)
    g.strokeCircle(cx, cy, R + 5)
  }

  // Body/head — layered circles for depth
  g.fillStyle(opts.bodyDark, 1)
  g.fillCircle(cx + 2, cy + 2, R)          // shadow offset

  g.fillStyle(opts.bodyColor, 1)
  g.fillCircle(cx, cy, R)                   // main body

  g.fillStyle(opts.bodyLight, 1)
  g.fillCircle(cx - 5, cy - 6, R * 0.55)   // highlight blob

  // Eyes — big expressive dots
  g.fillStyle(0x1a1208, 1)
  g.fillCircle(cx - 6, cy - 1, 4)
  g.fillCircle(cx + 6, cy - 1, 4)

  // Eye shine
  g.fillStyle(0xffffff, 1)
  g.fillCircle(cx - 5, cy - 3, 1.5)
  g.fillCircle(cx + 7, cy - 3, 1.5)

  // Tiny feet
  g.fillStyle(opts.bodyDark, 1)
  g.fillRoundedRect(cx - 11, cy + R - 2, 9,  10, 4)
  g.fillRoundedRect(cx + 2,  cy + R - 2, 9,  10, 4)

  g.fillStyle(opts.bodyColor, 1)
  g.fillRoundedRect(cx - 12, cy + R - 3, 9, 10, 4)
  g.fillRoundedRect(cx + 3,  cy + R - 3, 9, 10, 4)

  // Seasonal accessory drawn on top
  opts.accessoryFn(g, cx, cy - R)
}

// ── Seasonal accessories ─────────────────────────────────────────────────────

// Spring: flower crown — three pink petals + yellow center
export function springAccessory(g: Phaser.GameObjects.Graphics, cx: number, headTop: number) {
  const y = headTop + 2
  // Petals
  g.fillStyle(0xf07898, 1)
  g.fillCircle(cx - 8, y, 5)
  g.fillCircle(cx,     y - 4, 5)
  g.fillCircle(cx + 8, y, 5)
  // Center
  g.fillStyle(0xffe066, 1)
  g.fillCircle(cx, y, 4)
  // Stem dots
  g.fillStyle(0x5aaa6a, 1)
  g.fillCircle(cx - 4, y + 6, 2)
  g.fillCircle(cx + 4, y + 6, 2)
}

// Summer: sun visor — curved brim + glowing disc
export function summerAccessory(g: Phaser.GameObjects.Graphics, cx: number, headTop: number) {
  const y = headTop + 1
  // Disc glow
  g.fillStyle(0xffcc00, 0.35)
  g.fillCircle(cx, y, 14)
  // Main disc
  g.fillStyle(0xe8a020, 1)
  g.fillCircle(cx, y, 10)
  g.fillStyle(0xffe066, 1)
  g.fillCircle(cx, y, 6)
  // Rays
  g.fillStyle(0xe8a020, 1)
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2
    const rx = cx + Math.cos(angle) * 13
    const ry = y  + Math.sin(angle) * 13
    g.fillCircle(rx, ry, 2.5)
  }
}

// Autumn: acorn cap — wide flat cap with ridged rim
export function autumnAccessory(g: Phaser.GameObjects.Graphics, cx: number, headTop: number) {
  const y = headTop + 3
  // Cap base (dark brown)
  g.fillStyle(0x5a3010, 1)
  g.fillEllipse(cx, y, 28, 10)
  // Cap top dome
  g.fillStyle(0x7a4820, 1)
  g.fillEllipse(cx, y - 4, 22, 12)
  // Stem
  g.fillStyle(0x5a3010, 1)
  g.fillRect(cx - 2, y - 10, 4, 7)
  // Rim detail
  g.lineStyle(1, 0x3a1808, 0.5)
  g.strokeEllipse(cx, y, 28, 10)
}

// Winter: ice crystal crown — jagged spikes + blue jewel
export function winterAccessory(g: Phaser.GameObjects.Graphics, cx: number, headTop: number) {
  const y = headTop + 2
  // Crown band
  g.fillStyle(0x2a6888, 1)
  g.fillRect(cx - 12, y, 24, 6)
  // Ice spikes
  g.fillStyle(0xb8e8fc, 1)
  const spikes = [cx - 10, cx - 4, cx + 2, cx + 8]
  for (const sx of spikes) {
    g.fillTriangle(sx, y, sx + 5, y, sx + 2.5, y - 9)
  }
  // Jewel center
  g.fillStyle(0x78ccee, 1)
  g.fillCircle(cx, y + 3, 4)
  g.fillStyle(0xdcf4fc, 1)
  g.fillCircle(cx - 1, y + 2, 1.5)
}

// Ram Dass NPC — seated figure, white robes, long white beard, warm eyes
export function drawRamDass(g: Phaser.GameObjects.Graphics) {
  const cx = 24

  // Warm aura
  g.fillStyle(0xffd700, 0.1)
  g.fillCircle(cx, 28, 28)

  // Robes — wide at bottom (seated)
  g.fillStyle(0xddd8c8, 1)
  g.fillEllipse(cx, 42, 38, 20)

  // Body
  g.fillStyle(0xe8e4d8, 1)
  g.fillCircle(cx, 28, 14)

  // Head highlight
  g.fillStyle(0xf0ece0, 1)
  g.fillCircle(cx - 4, 22, 8)

  // Long white beard — teardrop shape
  g.fillStyle(0xffffff, 1)
  g.fillEllipse(cx, 34, 14, 18)
  g.fillEllipse(cx, 32, 10, 10)

  // Warm eyes
  g.fillStyle(0x8a5820, 1)
  g.fillCircle(cx - 5, 26, 2.5)
  g.fillCircle(cx + 5, 26, 2.5)

  // Eye shine
  g.fillStyle(0xffeebb, 1)
  g.fillCircle(cx - 4, 25, 1)
  g.fillCircle(cx + 6, 25, 1)

  // Mala beads hint
  g.fillStyle(0xc47820, 0.7)
  for (let i = 0; i < 5; i++) {
    g.fillCircle(cx - 8 + i * 4, 36, 1.5)
  }
}

// Player top-down overworld sprite — 24x24, viewed from above
export function drawPlayerTopDown(g: Phaser.GameObjects.Graphics, color = 0x5a78c8) {
  const cx = 12, cy = 12
  // Shadow
  g.fillStyle(0x000000, 0.2)
  g.fillEllipse(cx + 1, cy + 1, 16, 16)
  // Body circle (cloak from above)
  g.fillStyle(color, 1)
  g.fillCircle(cx, cy, 9)
  // Head
  g.fillStyle(0xf5c89a, 1)
  g.fillCircle(cx, cy - 3, 5)
  // Hair
  g.fillStyle(0x3a2010, 1)
  g.fillCircle(cx, cy - 6, 4)
  // Direction indicator (facing down by default)
  g.fillStyle(0xf5c89a, 0.8)
  g.fillCircle(cx, cy + 2, 2)
}
