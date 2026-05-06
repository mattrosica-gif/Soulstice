// Soulstice color palette — cozy rainy night
export const PALETTE = {
  // Backgrounds
  nightDeep:    0x0d1117,
  nightMid:     0x161b22,
  nightWarm:    0x1c1f2e,

  // Rain
  rainBlue:     0x4a7fa5,
  rainFog:      0x2a3f5c,

  // Ground / world
  mossDeep:     0x1e3326,
  mossMid:      0x2d4a3e,
  mossLight:    0x3d6b52,

  // Warm accents (lanterns, fire, Ram Dass glow)
  amber:        0xc4893a,
  amberSoft:    0xe8b86d,
  amberGlow:    0xffd78a,

  // UI
  textCream:    0xe8d5b0,
  textMuted:    0x8a7a65,
  panelDark:    0x12151e,
  panelBorder:  0x2a2d3e,

  // Season accents
  spring:       0x7ec87e,
  springLight:  0xb4e8a0,
  summer:       0xe87e3e,
  summerLight:  0xf5a86a,
  autumn:       0xc47a3a,
  autumnLight:  0xe8a86a,
  winter:       0x7ab4d4,
  winterLight:  0xb4d8f0,

  // HP bar
  hpGreen:      0x4caf50,
  hpYellow:     0xffb300,
  hpRed:        0xf44336,

  // Ram Dass special
  ramDassGold:  0xffd700,
  ramDassAura:  0xffe08a,
} as const

export const SEASON_COLORS: Record<string, number> = {
  spring: PALETTE.spring,
  summer: PALETTE.summer,
  autumn: PALETTE.autumn,
  winter: PALETTE.winter,
}

export const SEASON_LIGHT_COLORS: Record<string, number> = {
  spring: PALETTE.springLight,
  summer: PALETTE.summerLight,
  autumn: PALETTE.autumnLight,
  winter: PALETTE.winterLight,
}
