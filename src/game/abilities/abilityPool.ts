import type { AbilityDefinition } from './types'

export const ABILITY_POOL: AbilityDefinition[] = [

  // ── SPRING ──────────────────────────────────────────────────────────────────
  {
    id: 'petal_rush',
    name: 'Petal Rush',
    description: 'A flurry of quick strikes. Hard to block, harder to predict.',
    targetType: 'single_enemy',
    spriteKey: 'petal_rush',
    tiers: [
      { tier: 1, cooldown: 3, fxKey: 'petal_rush_t1', effects: [{ type: 'damage', value: 30 }, { type: 'damage', value: 30 }] },
      { tier: 2, cooldown: 3, fxKey: 'petal_rush_t2', effects: [{ type: 'damage', value: 40 }, { type: 'damage', value: 40 }] },
      { tier: 3, cooldown: 3, fxKey: 'petal_rush_t3', effects: [{ type: 'damage', value: 55 }, { type: 'damage', value: 55 }] },
      { tier: 4, cooldown: 2, fxKey: 'petal_rush_t4', effects: [{ type: 'damage', value: 55 }, { type: 'damage', value: 55 }, { type: 'damage', value: 55 }] },
    ],
  },
  {
    id: 'mending_rain',
    name: 'Mending Rain',
    description: 'Calls a soft drizzle that restores the whole team.',
    targetType: 'all_allies',
    spriteKey: 'mending_rain',
    tiers: [
      { tier: 1, cooldown: 5, fxKey: 'mending_rain_t1', effects: [{ type: 'heal', value: 25 }] },
      { tier: 2, cooldown: 5, fxKey: 'mending_rain_t2', effects: [{ type: 'heal', value: 40 }] },
      { tier: 3, cooldown: 4, fxKey: 'mending_rain_t3', effects: [{ type: 'heal', value: 55 }] },
      { tier: 4, cooldown: 4, fxKey: 'mending_rain_t4', effects: [{ type: 'heal', value: 55 }, { type: 'hot', value: 10, duration: 3 }] },
    ],
  },
  {
    id: 'root_snare',
    name: 'Root Snare',
    description: 'Vines erupt underfoot. The target isn\'t going anywhere.',
    targetType: 'single_enemy',
    spriteKey: 'root_snare',
    tiers: [
      { tier: 1, cooldown: 4, fxKey: 'root_snare_t1', effects: [{ type: 'stun', value: 1, duration: 1 }] },
      { tier: 2, cooldown: 4, fxKey: 'root_snare_t2', effects: [{ type: 'stun', value: 1, duration: 2 }] },
      { tier: 3, cooldown: 4, fxKey: 'root_snare_t3', effects: [{ type: 'stun', value: 1, duration: 2 }, { type: 'damage', value: 30 }] },
      { tier: 4, cooldown: 3, fxKey: 'root_snare_t4', effects: [{ type: 'stun', value: 1, duration: 3 }, { type: 'damage', value: 45 }] },
    ],
  },
  {
    id: 'tailwind',
    name: 'Tailwind',
    description: 'The whole team picks up the pace.',
    targetType: 'all_allies',
    spriteKey: 'tailwind',
    tiers: [
      { tier: 1, cooldown: 6, fxKey: 'tailwind_t1', effects: [{ type: 'buff_speed', value: 20, duration: 3 }] },
      { tier: 2, cooldown: 6, fxKey: 'tailwind_t2', effects: [{ type: 'buff_speed', value: 30, duration: 3 }] },
      { tier: 3, cooldown: 5, fxKey: 'tailwind_t3', effects: [{ type: 'buff_speed', value: 40, duration: 4 }] },
      { tier: 4, cooldown: 4, fxKey: 'tailwind_t4', effects: [{ type: 'buff_speed', value: 40, duration: 5 }, { type: 'buff_attack', value: 15, duration: 5 }] },
    ],
  },

  // ── SUMMER ──────────────────────────────────────────────────────────────────
  {
    id: 'scorch',
    name: 'Scorch',
    description: 'Pure heat. Damages now and keeps burning.',
    targetType: 'single_enemy',
    spriteKey: 'scorch',
    tiers: [
      { tier: 1, cooldown: 3, fxKey: 'scorch_t1', effects: [{ type: 'damage', value: 45 }, { type: 'dot', value: 10, duration: 2 }] },
      { tier: 2, cooldown: 3, fxKey: 'scorch_t2', effects: [{ type: 'damage', value: 60 }, { type: 'dot', value: 15, duration: 2 }] },
      { tier: 3, cooldown: 3, fxKey: 'scorch_t3', effects: [{ type: 'damage', value: 75 }, { type: 'dot', value: 20, duration: 3 }] },
      { tier: 4, cooldown: 2, fxKey: 'scorch_t4', effects: [{ type: 'damage', value: 90 }, { type: 'dot', value: 25, duration: 3 }] },
    ],
  },
  {
    id: 'heat_wave',
    name: 'Heat Wave',
    description: 'A wall of heat that weakens every enemy at once.',
    targetType: 'all_enemies',
    spriteKey: 'heat_wave',
    tiers: [
      { tier: 1, cooldown: 6, fxKey: 'heat_wave_t1', effects: [{ type: 'damage', value: 20 }, { type: 'debuff_defense', value: 15, duration: 2 }] },
      { tier: 2, cooldown: 6, fxKey: 'heat_wave_t2', effects: [{ type: 'damage', value: 30 }, { type: 'debuff_defense', value: 20, duration: 2 }] },
      { tier: 3, cooldown: 5, fxKey: 'heat_wave_t3', effects: [{ type: 'damage', value: 40 }, { type: 'debuff_defense', value: 25, duration: 3 }] },
      { tier: 4, cooldown: 4, fxKey: 'heat_wave_t4', effects: [{ type: 'damage', value: 50 }, { type: 'debuff_defense', value: 30, duration: 3 }] },
    ],
  },
  {
    id: 'ignite',
    name: 'Ignite',
    description: 'Sets a target alight. Pure damage over time.',
    targetType: 'single_enemy',
    spriteKey: 'ignite',
    tiers: [
      { tier: 1, cooldown: 2, fxKey: 'ignite_t1', effects: [{ type: 'dot', value: 18, duration: 4 }] },
      { tier: 2, cooldown: 2, fxKey: 'ignite_t2', effects: [{ type: 'dot', value: 25, duration: 4 }] },
      { tier: 3, cooldown: 2, fxKey: 'ignite_t3', effects: [{ type: 'dot', value: 32, duration: 5 }] },
      { tier: 4, cooldown: 2, fxKey: 'ignite_t4', effects: [{ type: 'dot', value: 40, duration: 6 }] },
    ],
  },
  {
    id: 'battle_cry',
    name: 'Battle Cry',
    description: 'Pumps up the whole team. Everybody hits harder.',
    targetType: 'all_allies',
    spriteKey: 'battle_cry',
    tiers: [
      { tier: 1, cooldown: 6, fxKey: 'battle_cry_t1', effects: [{ type: 'buff_attack', value: 20, duration: 3 }] },
      { tier: 2, cooldown: 6, fxKey: 'battle_cry_t2', effects: [{ type: 'buff_attack', value: 30, duration: 3 }] },
      { tier: 3, cooldown: 5, fxKey: 'battle_cry_t3', effects: [{ type: 'buff_attack', value: 40, duration: 4 }] },
      { tier: 4, cooldown: 4, fxKey: 'battle_cry_t4', effects: [{ type: 'buff_attack', value: 40, duration: 5 }, { type: 'buff_speed', value: 15, duration: 5 }] },
    ],
  },

  // ── AUTUMN ──────────────────────────────────────────────────────────────────
  {
    id: 'wither',
    name: 'Wither',
    description: 'Saps the fight out of an enemy. Their attack is never the same.',
    targetType: 'single_enemy',
    spriteKey: 'wither',
    tiers: [
      { tier: 1, cooldown: 4, fxKey: 'wither_t1', effects: [{ type: 'debuff_attack', value: 20, duration: 3 }] },
      { tier: 2, cooldown: 4, fxKey: 'wither_t2', effects: [{ type: 'debuff_attack', value: 30, duration: 3 }] },
      { tier: 3, cooldown: 3, fxKey: 'wither_t3', effects: [{ type: 'debuff_attack', value: 35, duration: 4 }] },
      { tier: 4, cooldown: 3, fxKey: 'wither_t4', effects: [{ type: 'debuff_attack', value: 40, duration: 4 }, { type: 'debuff_speed', value: 20, duration: 4 }] },
    ],
  },
  {
    id: 'decay_touch',
    name: 'Decay Touch',
    description: 'Rot seeps in slowly. Damage that compounds.',
    targetType: 'single_enemy',
    spriteKey: 'decay_touch',
    tiers: [
      { tier: 1, cooldown: 3, fxKey: 'decay_touch_t1', effects: [{ type: 'dot', value: 12, duration: 5 }] },
      { tier: 2, cooldown: 3, fxKey: 'decay_touch_t2', effects: [{ type: 'dot', value: 18, duration: 5 }] },
      { tier: 3, cooldown: 3, fxKey: 'decay_touch_t3', effects: [{ type: 'dot', value: 22, duration: 6 }] },
      { tier: 4, cooldown: 2, fxKey: 'decay_touch_t4', effects: [{ type: 'dot', value: 28, duration: 7 }, { type: 'debuff_defense', value: 15, duration: 7 }] },
    ],
  },
  {
    id: 'iron_bark',
    name: 'Iron Bark',
    description: 'Bark-hard skin. Takes a hit that would floor anyone else.',
    targetType: 'self',
    spriteKey: 'iron_bark',
    tiers: [
      { tier: 1, cooldown: 5, fxKey: 'iron_bark_t1', effects: [{ type: 'buff_defense', value: 30, duration: 3 }] },
      { tier: 2, cooldown: 5, fxKey: 'iron_bark_t2', effects: [{ type: 'buff_defense', value: 45, duration: 3 }] },
      { tier: 3, cooldown: 4, fxKey: 'iron_bark_t3', effects: [{ type: 'buff_defense', value: 55, duration: 4 }] },
      { tier: 4, cooldown: 4, fxKey: 'iron_bark_t4', effects: [{ type: 'buff_defense', value: 60, duration: 5 }, { type: 'taunt', value: 1, duration: 5 }] },
    ],
  },
  {
    id: 'harvest',
    name: 'Harvest',
    description: 'Drains life from an enemy. What they lose, you gain.',
    targetType: 'single_enemy',
    spriteKey: 'harvest',
    tiers: [
      { tier: 1, cooldown: 4, fxKey: 'harvest_t1', effects: [{ type: 'damage', value: 30 }, { type: 'heal', value: 15 }] },
      { tier: 2, cooldown: 4, fxKey: 'harvest_t2', effects: [{ type: 'damage', value: 45 }, { type: 'heal', value: 22 }] },
      { tier: 3, cooldown: 4, fxKey: 'harvest_t3', effects: [{ type: 'damage', value: 55 }, { type: 'heal', value: 28 }] },
      { tier: 4, cooldown: 3, fxKey: 'harvest_t4', effects: [{ type: 'damage', value: 65 }, { type: 'heal', value: 35 }] },
    ],
  },

  // ── WINTER ──────────────────────────────────────────────────────────────────
  {
    id: 'glacial_strike',
    name: 'Glacial Strike',
    description: 'Slow to wind up. Hits like a glacier.',
    targetType: 'single_enemy',
    spriteKey: 'glacial_strike',
    tiers: [
      { tier: 1, cooldown: 5, fxKey: 'glacial_strike_t1', effects: [{ type: 'damage', value: 90 }] },
      { tier: 2, cooldown: 5, fxKey: 'glacial_strike_t2', effects: [{ type: 'damage', value: 120 }] },
      { tier: 3, cooldown: 4, fxKey: 'glacial_strike_t3', effects: [{ type: 'damage', value: 150 }] },
      { tier: 4, cooldown: 4, fxKey: 'glacial_strike_t4', effects: [{ type: 'damage', value: 180 }, { type: 'debuff_speed', value: 30, duration: 3 }] },
    ],
  },
  {
    id: 'frost_veil',
    name: 'Frost Veil',
    description: 'A cold that slows every enemy in the fight.',
    targetType: 'all_enemies',
    spriteKey: 'frost_veil',
    tiers: [
      { tier: 1, cooldown: 6, fxKey: 'frost_veil_t1', effects: [{ type: 'debuff_speed', value: 20, duration: 3 }] },
      { tier: 2, cooldown: 6, fxKey: 'frost_veil_t2', effects: [{ type: 'debuff_speed', value: 30, duration: 3 }] },
      { tier: 3, cooldown: 5, fxKey: 'frost_veil_t3', effects: [{ type: 'debuff_speed', value: 35, duration: 4 }] },
      { tier: 4, cooldown: 4, fxKey: 'frost_veil_t4', effects: [{ type: 'debuff_speed', value: 40, duration: 4 }, { type: 'damage', value: 25 }] },
    ],
  },
  {
    id: 'permafrost',
    name: 'Permafrost',
    description: 'Freezes a target solid. They are done.',
    targetType: 'single_enemy',
    spriteKey: 'permafrost',
    tiers: [
      { tier: 1, cooldown: 7, fxKey: 'permafrost_t1', effects: [{ type: 'stun', value: 1, duration: 2 }, { type: 'debuff_defense', value: 20, duration: 4 }] },
      { tier: 2, cooldown: 7, fxKey: 'permafrost_t2', effects: [{ type: 'stun', value: 1, duration: 3 }, { type: 'debuff_defense', value: 25, duration: 4 }] },
      { tier: 3, cooldown: 6, fxKey: 'permafrost_t3', effects: [{ type: 'stun', value: 1, duration: 3 }, { type: 'debuff_defense', value: 30, duration: 5 }] },
      { tier: 4, cooldown: 5, fxKey: 'permafrost_t4', effects: [{ type: 'stun', value: 1, duration: 4 }, { type: 'debuff_defense', value: 35, duration: 5 }] },
    ],
  },
  {
    id: 'last_stand',
    name: 'Last Stand',
    description: 'The colder the situation, the harder they fight.',
    targetType: 'self',
    spriteKey: 'last_stand',
    tiers: [
      { tier: 1, cooldown: 8, fxKey: 'last_stand_t1', effects: [{ type: 'buff_attack', value: 40, duration: 4 }, { type: 'buff_defense', value: 20, duration: 4 }] },
      { tier: 2, cooldown: 7, fxKey: 'last_stand_t2', effects: [{ type: 'buff_attack', value: 55, duration: 4 }, { type: 'buff_defense', value: 30, duration: 4 }] },
      { tier: 3, cooldown: 6, fxKey: 'last_stand_t3', effects: [{ type: 'buff_attack', value: 65, duration: 5 }, { type: 'buff_defense', value: 35, duration: 5 }] },
      { tier: 4, cooldown: 5, fxKey: 'last_stand_t4', effects: [{ type: 'buff_attack', value: 75, duration: 6 }, { type: 'buff_defense', value: 40, duration: 6 }, { type: 'heal', value: 40 }] },
    ],
  },
]

export const getAbilityById = (id: string) =>
  ABILITY_POOL.find((a) => a.id === id)
