// Pixel map sprite system — define characters as 2D color-code arrays
// Each cell is one "pixel" drawn at PIXEL_SCALE size
// Color codes: _ = transparent, K = black outline, and custom per sprite

export const PIXEL_SCALE = 3  // each pixel = 3x3 real pixels → 24x32 = 72x96 on screen

export type PixelMap = string[]

// Draw a pixel map onto a Phaser Graphics object
export function renderPixelMap(
  g: Phaser.GameObjects.Graphics,
  map: PixelMap,
  palette: Record<string, number>,
  scale = PIXEL_SCALE,
) {
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      const code = map[row][col]
      if (code === '_') continue
      const color = palette[code]
      if (color === undefined) continue
      g.fillStyle(color, 1)
      g.fillRect(col * scale, row * scale, scale, scale)
    }
  }
}

// Shared outline black
export const K = 0x111111
export const TRANSPARENT = '_'
