import type { CharacterStats, GrowthRates, TemperamentId } from './types'
import { TEMPERAMENTS } from './types'

export const MAX_LEVEL = 25

// EXP required to level up FROM a given level
// Curve: level^2 * 15 — keeps runs feeling progressive without going too high
// Level 1→2: 15 | Level 5→6: 375 | Level 10→11: 1500 | Level 20→21: 6000
export function getExpToNextLevel(level: number): number {
  if (level >= MAX_LEVEL) return Infinity
  return Math.floor(level * level * 15)
}

// How much EXP a battle rewards per character — scales with floor depth
export function getBattleExpReward(floor: number): number {
  return Math.floor(25 + floor * 8)
}

// Stat value at a given level, factoring growth rate
// Formula: base + (base * growthRate * level * 0.08)
// A growthRate 1.0 character at level 25 has 3x their base stat
// A growthRate 0.3 character at level 25 has 1.6x their base stat
function scaleStat(base: number, growthRate: number, level: number): number {
  return Math.round(base + base * growthRate * (level - 1) * 0.08)
}

// Apply temperament multipliers to a stat value
function applyTemperament(
  value: number,
  statKey: keyof GrowthRates,
  temperamentId: TemperamentId
): number {
  const temperament = TEMPERAMENTS[temperamentId]
  if (temperament.bonusStat === statKey) return Math.round(value * 1.15)
  if (temperament.penaltyStat === statKey) return Math.round(value * 0.90)
  return value
}

export function computeStats(
  baseStats: Omit<CharacterStats, 'hp'>,
  growthRates: GrowthRates,
  temperamentId: TemperamentId,
  level: number
): CharacterStats {
  const maxHp  = applyTemperament(scaleStat(baseStats.maxHp,  growthRates.maxHp,  level), 'maxHp',   temperamentId)
  const attack = applyTemperament(scaleStat(baseStats.attack, growthRates.attack, level), 'attack',  temperamentId)
  const defense= applyTemperament(scaleStat(baseStats.defense,growthRates.defense,level), 'defense', temperamentId)
  const speed  = applyTemperament(scaleStat(baseStats.speed,  growthRates.speed,  level), 'speed',   temperamentId)
  // Evasion stays as 0.0–1.0 probability, cap at 0.60 to keep combat fair
  const baseEvasion = applyTemperament(
    Math.round(scaleStat(baseStats.evasion * 100, growthRates.evasion, level)) / 100,
    'evasion',
    temperamentId
  )
  const evasion = Math.min(baseEvasion, 0.60)

  return { hp: maxHp, maxHp, attack, defense, speed, evasion }
}

// Returns the updated character after gaining exp — handles multi-level-ups
export function awardExp(
  character: import('./types').Character,
  expGained: number,
  definition: import('./types').CharacterDefinition
): import('./types').Character {
  if (character.level >= MAX_LEVEL) return character

  let { level, exp, stats } = character
  exp += expGained

  while (level < MAX_LEVEL) {
    const threshold = getExpToNextLevel(level)
    if (exp < threshold) break
    exp -= threshold
    level++
    stats = computeStats(definition.baseStats, character.growthRates, character.temperament, level)
  }

  return {
    ...character,
    level,
    exp,
    expToNextLevel: getExpToNextLevel(level),
    stats,
    // reveal temperament on first level up if not already shown
    temperamentRevealed: character.temperamentRevealed || level > 1,
  }
}
