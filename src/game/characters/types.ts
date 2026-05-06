export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

export type CharacterRole = 'attacker' | 'defender' | 'support' | 'disruptor'

export interface CharacterStats {
  hp: number
  maxHp: number
  attack: number
  defense: number
  speed: number
  // 0.0 - 1.0, chance to dodge an attack
  evasion: number
}

export interface CharacterDefinition {
  id: string
  name: string
  description: string
  season: Season
  role: CharacterRole
  // base stats before any leveling
  baseStats: Omit<CharacterStats, 'hp'>
  // which ability slots this character can equip (1-3)
  abilitySlots: number
  // sprite identifier for the renderer
  spriteKey: string
}

export type StatKey = 'attack' | 'defense' | 'speed' | 'evasion' | 'maxHp'

export type TemperamentId = 'resolute' | 'nimble' | 'ironclad' | 'ghostlike' | 'radiant'

export interface Temperament {
  id: TemperamentId
  name: string
  // stat that gets +15%
  bonusStat: StatKey | null
  // stat that gets -10%
  penaltyStat: StatKey | null
}

export const TEMPERAMENTS: Record<TemperamentId, Temperament> = {
  resolute:  { id: 'resolute',  name: 'Resolute',  bonusStat: 'attack',  penaltyStat: 'evasion'  },
  nimble:    { id: 'nimble',    name: 'Nimble',    bonusStat: 'speed',   penaltyStat: 'defense'  },
  ironclad:  { id: 'ironclad',  name: 'Ironclad',  bonusStat: 'defense', penaltyStat: 'speed'    },
  ghostlike: { id: 'ghostlike', name: 'Ghostlike', bonusStat: 'evasion', penaltyStat: 'attack'   },
  radiant:   { id: 'radiant',   name: 'Radiant',   bonusStat: null,      penaltyStat: null       },
}

// Growth rates per stat — rolled at character creation, affect stat scaling per level
export interface GrowthRates {
  attack: number   // 0.0 – 1.0
  defense: number
  speed: number
  evasion: number
  maxHp: number
}

export const GROWTH_RATE_NORMAL: [min: number, max: number] = [0.3, 0.8]
export const GROWTH_RATE_BONDED: [min: number, max: number] = [0.7, 1.0]

// A live character instance within a run
export interface Character {
  // unique instance id for this run (not the definition id)
  instanceId: string
  definitionId: string
  name: string
  season: Season
  role: CharacterRole
  spriteKey: string
  isBonded: boolean
  // temperament revealed to player after first battle
  temperament: TemperamentId
  temperamentRevealed: boolean
  growthRates: GrowthRates
  level: number
  exp: number
  expToNextLevel: number
  stats: CharacterStats
  equippedAbilities: (string | null)[]
  gridPosition: [number, number] | null
}

// Season counter relationships
// key beats all values in its array
export const SEASON_COUNTERS: Record<Season, Season[]> = {
  summer: ['autumn'],
  autumn: ['winter'],
  winter: ['spring'],
  spring: ['summer'],
}

// Damage multiplier when attacker season counters defender season
export const SEASON_COUNTER_MULTIPLIER = 1.5
// Damage multiplier when defender season counters attacker season
export const SEASON_WEAK_MULTIPLIER = 0.67
