import type { BattleCharacter } from './types'
import { SEASON_COUNTERS, SEASON_COUNTER_MULTIPLIER, SEASON_WEAK_MULTIPLIER } from '../characters/types'

// How many ticks between a character's actions — lower speed = higher cooldown
export function getActionCooldown(speed: number): number {
  return Math.max(1, Math.floor(100 / Math.max(1, speed)))
}

// Season damage multiplier between attacker and defender
export function getSeasonMultiplier(
  attackerSeason: string,
  defenderSeason: string
): number {
  const counters = SEASON_COUNTERS[attackerSeason as keyof typeof SEASON_COUNTERS]
  if (counters?.includes(defenderSeason as never)) return SEASON_COUNTER_MULTIPLIER

  const defenderCounters = SEASON_COUNTERS[defenderSeason as keyof typeof SEASON_COUNTERS]
  if (defenderCounters?.includes(attackerSeason as never)) return SEASON_WEAK_MULTIPLIER

  return 1.0
}

// Standard RPG defense reduction — asymptotic, never reaches 0
// At defense 100: ~50% reduction. At defense 200: ~67%. At defense 50: ~33%
function defenseReduction(defense: number): number {
  return 100 / (100 + defense)
}

// Final damage dealt from an ability hit
export function calcDamage(
  attacker: BattleCharacter,
  defender: BattleCharacter,
  baseValue: number
): { damage: number; evaded: boolean; seasonCounter: boolean } {
  // Evasion check
  if (Math.random() < defender.character.stats.evasion) {
    return { damage: 0, evaded: true, seasonCounter: false }
  }

  const seasonMult = getSeasonMultiplier(
    attacker.character.season,
    defender.character.season
  )

  const raw = baseValue * (attacker.character.stats.attack / 100)
  const reduced = raw * defenseReduction(defender.character.stats.defense)
  const final = Math.max(1, Math.round(reduced * seasonMult))

  return {
    damage: final,
    evaded: false,
    seasonCounter: seasonMult === SEASON_COUNTER_MULTIPLIER,
  }
}

// Healing is straightforward — no defense, no evasion
export function calcHeal(baseValue: number): number {
  return Math.max(1, Math.round(baseValue))
}

// Basic attack — no ability, pure stat-based damage
export function calcBasicAttack(
  attacker: BattleCharacter,
  defender: BattleCharacter
): ReturnType<typeof calcDamage> {
  // Basic attack base value is 50% of attacker's attack stat
  const baseValue = attacker.character.stats.attack * 0.5
  return calcDamage(attacker, defender, baseValue)
}
