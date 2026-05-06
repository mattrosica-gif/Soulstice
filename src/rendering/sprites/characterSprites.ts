// Detailed pixel art character sprites — Vivi (FF9) inspired
// 24 wide x 32 tall, PIXEL_SCALE 3 → 72x96 on screen
// Each season has a unique silhouette: hat shape, cloak style, color palette

import type { PixelMap } from './pixelMap'

// ── SPRING CHARACTER ─────────────────────────────────────────────────────────
// Flower-crowned hood, light flowing cloak, nimble and bright
// Colors: K=outline, G=cloak green, g=cloak light, d=cloak dark, S=skin, E=eye, F=flower pink, f=flower light, W=white highlight

export const SPRING_SPRITE: PixelMap = [
  '_______KKKKKKKKK________',  //  0
  '______KFFFFFFFFfK_______',  //  1
  '_____KFFFFFFFFFFFk______',  //  2
  '____KFFFfFFFFFfffFK_____',  //  3
  '____KFFFFFFFFFFFFfK_____',  //  4
  '_____KFFFFFFFFFFF K_____',  //  5
  '______KKKKSSSKKKK_______',  //  6  hood opening
  '_____KGGGKSSSKGGgK______',  //  7  face + hood sides
  '____KGGGGKSEKSKGGGK_____',  //  8
  '____KGGGGKSSSkKGGGK_____',  //  9
  '_____KGGGKKKKKKGGgK_____',  // 10  chin / neck
  '____KGGGGGGGGGGGGgK_____',  // 11  shoulders
  '___KGGgGGGGGGGGGGGGK____',  // 12
  '___KGGGGGGGGGGGGGGgK____',  // 13  body
  '___KGdGGGGGGGGGGGdGK____',  // 14
  '____KGGGGGGGGGGGGGk_____',  // 15
  '____KGdGGGGGGGGGdGK_____',  // 16
  '_____KGGGGGGGGGGgK______',  // 17
  '_____KGdGGGGGGGdGK______',  // 18
  '______KGGGGGGGGgK_______',  // 19
  '______KGdGGGGGdK________',  // 20
  '_______KGGGGGGGK________',  // 21  lower cloak
  '______KKGgGGGGgKK_______',  // 22  cloak split
  '_____KGK_KGGGgK_KGK_____',  // 23  legs visible
  '_____KGK_KGGGgK_KGK_____',  // 24
  '____KddK_KdddgK_KddK____',  // 25  feet dark
  '___KKKkK_KKKKkK_KKkKK___',  // 26  feet outline
  '________________________',  // 27
]

// ── SUMMER CHARACTER ─────────────────────────────────────────────────────────
// Sun-disc shoulder armor, flame-red robes, aggressive wide stance
// R=robe red, r=robe light, D=robe dark, S=skin, E=eye, Y=sun gold, y=sun light, K=outline

export const SUMMER_SPRITE: PixelMap = [
  '_________KyYYyK_________',  //  0  sun disc top
  '________KYYYYYyK________',  //  1
  '_______KYyYYYYYYK_______',  //  2
  '______KYYYYyYYYYyK______',  //  3
  '______KyKKKKKKKKyK______',  //  4  disc rim
  '_______KK_KSSKK_KK______',  //  5  neck gap
  '______KRRKKSSKKRRrK_____',  //  6  shoulders
  '_____KRRRrKSSKrRRRRK____',  //  7
  '_____KRRRRKEKEKRRRrK____',  //  8  face
  '_____KRRRRKSSKKRRRrK____',  //  9
  '______KRRRKKKKRRRrK_____',  // 10  neck
  '_____KRRRRRRRRRRRrRK____',  // 11  chest
  '____KRRrRRRRRRRRRRRRK___',  // 12
  '____KRRRRRRRRRRRRRrRK___',  // 13
  '____KRDRRRRRRRRRRDRRK___',  // 14
  '_____KRRRRRRRRRRRRrK____',  // 15
  '_____KRDRRRRRRRRDRRK____',  // 16
  '______KRRRRRRRRRRrK_____',  // 17
  '______KRDRRRRRRDRrK_____',  // 18
  '_______KRRRRRRRRrK______',  // 19
  '_______KRDRRRRDRrK______',  // 20
  '________KRRRRRRrK_______',  // 21
  '_______KKRrRRRrKKK______',  // 22  split
  '______KRK_KRRRrK_KRK____',  // 23
  '______KRK_KRRRrK_KRK____',  // 24
  '_____KDdK_KDDdDK_KDdK___',  // 25
  '____KKKkK_KKKKkK_KKkKK__',  // 26
  '________________________',  // 27
]

// ── AUTUMN CHARACTER ─────────────────────────────────────────────────────────
// Deep hood pulled forward, wide heavy cloak, hunched silhouette
// B=brown cloak, b=cloak light, d=cloak dark, S=skin, E=eye, O=orange accent, K=outline

export const AUTUMN_SPRITE: PixelMap = [
  '________KKKKKKKK________',  //  0
  '_______KBBBBBBBbK_______',  //  1  hood peak
  '______KBBBBBBBBBbK______',  //  2
  '_____KBBbBBBBBBBBBK_____',  //  3
  '____KBBBBBBBBBBBBBbK____',  //  4
  '____KBBBBBBBBBBBBBbK____',  //  5
  '____KBBBBBBBBBBBBBbK____',  //  6  wide hood
  '____KBBBKKKKKKKBBBbK____',  //  7  hood shadow opening
  '____KBBKdddddddKBBbK____',  //  8  deep shadow inside hood
  '____KBBKddSSSddKBBbK____',  //  9  face barely visible
  '____KBBKddSEEddKBBbK____',  // 10
  '____KBBKdddddddKBBbK____',  // 11
  '___KBBBBBBBBBBBBBBbBK___',  // 12  wide hunched shoulders
  '__KBBbBBBBBBBBBBBBBBBK__',  // 13
  '__KBBBBBBBBBBBBBBBBBbBK_',  // 14
  '__KBBdBBBBOOOOBBBBdBBK__',  // 15  orange accent band
  '__KBBBBBBBBBBBBBBBBBbK__',  // 16
  '__KBBdBBBBBBBBBBBBdBBK__',  // 17
  '___KBBBBBBBBBBBBBBBbK___',  // 18
  '___KBBdBBBBBBBBBBdBBK___',  // 19
  '____KBBBBBBBBBBBBBbK____',  // 20
  '____KBBdBBBBBBBBdBBK____',  // 21
  '_____KBBBBBBBBBBBbK_____',  // 22
  '____KKBbBBBBBBBbBKK_____',  // 23  split
  '___KBK__KBBBbBK__KBK____',  // 24
  '___KBK__KBBBbBK__KBK____',  // 25
  '__KddK__KdddddK__KddK___',  // 26
  '_KKKkK__KKKKkKK__KKkKK__',  // 27
]

// ── WINTER CHARACTER ─────────────────────────────────────────────────────────
// Ice crystal crown, heavy fur-trimmed armored cloak, imposing wide stance
// C=ice blue cloak, c=cloak light, D=dark blue, W=white fur, I=ice crystal, S=skin, E=eye, K=outline

export const WINTER_SPRITE: PixelMap = [
  '_____KIIKKKiKKKIIK______',  //  0  ice crown spikes
  '____KIIIiKIIIKiIIIK_____',  //  1
  '____KiIIIIIIIIIIIcK_____',  //  2  crown band
  '____KIIIiIIIIIiIIcK_____',  //  3
  '_____KKKKiIIIiKKKK______',  //  4  crown base
  '_____KCCCKKKKKCCcK______',  //  5  neck
  '____KWWWWKSSKWWWwK______',  //  6  fur collar + face
  '___KWWWWWKSSKWWWwWK_____',  //  7
  '___KCCWWWKEKEKWWwCK_____',  //  8  eyes
  '___KCCWWWKSSKWWwCCK_____',  //  9
  '___KCCCCCKKKKCCCcCK_____',  // 10
  '__KCCcCCCCCCCCCCCcCK____',  // 11  broad armored shoulders
  '_KCCCCCCCCCCCCCCCCCcCK__',  // 12  very wide
  '_KCCcCCCCCCCCCCCCCCCCK__',  // 13
  '_KCCCCDCCCCCCCCCCDCCcK__',  // 14
  '_KCCCCCCCCCCCCCCCCCcCK__',  // 15
  '_KCCCDCCCCCCCCCCCCDcCK__',  // 16
  '__KCCCCCCCCCCCCCCCCcK___',  // 17
  '__KCCCDCCCCCCCCCCDCcK___',  // 18
  '___KCCCCCCCCCCCCCCcK____',  // 19
  '___KCCCDCCCCCCCCDCcK____',  // 20
  '____KCCCCCCCCCCCCcK_____',  // 21
  '____KCCDCCCCCCCDCcK_____',  // 22
  '_____KCCCCCCCCCCcK______',  // 23
  '____KKCcCCCCCCcCKK______',  // 24  split
  '___KCK__KCCCcCK__KCK____',  // 25
  '___KCK__KCCCcCK__KCK____',  // 26
  '__KDDK__KDDdDDK__KDDK___',  // 27
]

// ── PLAYER (overworld top-down) ───────────────────────────────────────────────
// Simple top-down character for overworld walking — 16x16 base

export const PLAYER_OVERWORLD_SPRITE: PixelMap = [
  '________________',
  '____KKKKKK______',
  '___KSSSSSSk_____',
  '___KSEKKESK_____',
  '___KSSSSSSk_____',
  '____KKKKKK______',
  '___KCCCCCCk_____',
  '__KCCcCCCCcK____',
  '__KCCCCCCCcK____',
  '___KCCCCCCk_____',
  '____KCCCCk______',
  '___KK_KKK_KK____',
  '___KK_KKK_KK____',
  '__KddK_KddK_____',
  '__KKkK_KKkK_____',
  '________________',
]

// ── RAM DASS (overworld NPC) ──────────────────────────────────────────────────
// Sitting cross-legged, long white beard, robes, warm glow

export const RAM_DASS_NPC_SPRITE: PixelMap = [
  '____KKKKKKK_____',
  '___KWWWWWWwK____',  // white head/hair
  '__KWWWwWWWWwK___',
  '__KWWWWWWWWwK___',
  '__KWKSSSSKWwK___',  // face
  '__KWKSEESKWwK___',
  '__KWKSSSSKWwK___',
  '__KWWWWWWWwK____',
  '_KRRRRRRRRRrK___',  // robe shoulders
  '_KRRrRRRRRRrRK__',
  '_KRRRRRRRRRRrK__',
  '__KRRrRRRRRrK___',
  '___KRRRRRRrK____',
  '_KKKRRRRRRrKKK__',  // seated — legs spread
  'KRRKKRRRRrKKRRK_',
  'KRrKKRRRRrKKRrK_',
]

export const SEASON_SPRITES: Record<string, PixelMap> = {
  spring: SPRING_SPRITE,
  summer: SUMMER_SPRITE,
  autumn: AUTUMN_SPRITE,
  winter: WINTER_SPRITE,
}

// Color palettes per season — maps pixel codes to hex colors
export const SEASON_PALETTES: Record<string, Record<string, number>> = {
  spring: {
    K: 0x111111, F: 0xe87ea8, f: 0xf5b8d0, G: 0x5aaa6a, g: 0x7ecc7e, d: 0x2d7040,
    S: 0xf5c89a, E: 0x2a1a0a, W: 0xffffff,
  },
  summer: {
    K: 0x111111, R: 0xd4541e, r: 0xf07840, D: 0x8a2a08, Y: 0xe8c020, y: 0xf5d85a,
    S: 0xf5c89a, E: 0x1a0a0a, d: 0x5a2008,
  },
  autumn: {
    K: 0x111111, B: 0x8a5020, b: 0xb07840, d: 0x4a2808, O: 0xe87820, S: 0xf5c89a,
    E: 0x1a0a0a,
  },
  winter: {
    K: 0x111111, C: 0x4a88b8, c: 0x7ab4d4, D: 0x1a4870, W: 0xe8e8f0, w: 0xffffff,
    I: 0xb8e0f8, i: 0xdcf0fc, S: 0xe8e8f0, E: 0x0a1a2a,
  },
}

export const PLAYER_PALETTE: Record<string, number> = {
  K: 0x111111, S: 0xf5c89a, E: 0x1a0a0a, C: 0x4a70b0, c: 0x6a90d0, d: 0x2a3050,
}

export const RAM_DASS_PALETTE: Record<string, number> = {
  K: 0x111111, W: 0xf5f0e8, w: 0xffffff, S: 0xd4a870, E: 0x8a5820,
  R: 0xd4c890, r: 0xe8dca8,
}
