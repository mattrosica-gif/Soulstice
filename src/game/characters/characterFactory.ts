import type { Character, CharacterDefinition, GrowthRates, TemperamentId } from './types'
import {
  TEMPERAMENTS,
  GROWTH_RATE_NORMAL,
  GROWTH_RATE_BONDED,
} from './types'
import { getExpToNextLevel, computeStats } from './leveling'

// Radiant is rare (~10%), others share the remaining 90% equally
const TEMPERAMENT_WEIGHTS: [TemperamentId, number][] = [
  ['resolute',  0.225],
  ['nimble',    0.225],
  ['ironclad',  0.225],
  ['ghostlike', 0.225],
  ['radiant',   0.100],
]

function rollTemperament(): TemperamentId {
  const roll = Math.random()
  let cumulative = 0
  for (const [id, weight] of TEMPERAMENT_WEIGHTS) {
    cumulative += weight
    if (roll < cumulative) return id
  }
  return 'resolute'
}

function rollGrowthRates(isBonded: boolean): GrowthRates {
  const [min, max] = isBonded ? GROWTH_RATE_BONDED : GROWTH_RATE_NORMAL
  const roll = () => parseFloat((Math.random() * (max - min) + min).toFixed(2))
  return {
    attack:  roll(),
    defense: roll(),
    speed:   roll(),
    evasion: roll(),
    maxHp:   roll(),
  }
}

function generateInstanceId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

interface SpawnOptions {
  isBonded?: boolean
}

export function spawnCharacter(
  definition: CharacterDefinition,
  options: SpawnOptions = {}
): Character {
  const { isBonded = false } = options
  const temperament = rollTemperament()
  const growthRates = rollGrowthRates(isBonded)
  const level = 1

  return {
    instanceId: generateInstanceId(),
    definitionId: definition.id,
    name: definition.name,
    season: definition.season,
    role: definition.role,
    spriteKey: definition.spriteKey,
    isBonded,
    temperament,
    temperamentRevealed: false,
    growthRates,
    level,
    exp: 0,
    expToNextLevel: getExpToNextLevel(level),
    stats: computeStats(definition.baseStats, growthRates, temperament, level),
    equippedAbilities: Array(definition.abilitySlots).fill(null),
    gridPosition: null,
  }
}

// Spawn the bonded character for run start — picks a random character of the given season
export function spawnBondedCharacter(
  roster: CharacterDefinition[],
  season: CharacterDefinition['season']
): Character {
  const pool = roster.filter((d) => d.season === season)
  const definition = pool[Math.floor(Math.random() * pool.length)]
  return spawnCharacter(definition, { isBonded: true })
}
