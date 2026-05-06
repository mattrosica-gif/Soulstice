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

// A live character instance within a run
export interface Character {
  // matches a CharacterDefinition id
  definitionId: string
  // snapshot of definition at time of recruit (name, season, role, spriteKey)
  name: string
  season: Season
  role: CharacterRole
  spriteKey: string
  level: number
  exp: number
  expToNextLevel: number
  stats: CharacterStats
  // ability ids currently equipped, indexed by slot (0-2)
  equippedAbilities: (string | null)[]
  // grid position during battle [col, row], null when not placed
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
