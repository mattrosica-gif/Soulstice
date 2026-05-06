import type { Character } from '../characters/types'
import type { Ability } from '../abilities/types'

// Battle grid is 3 cols x 2 rows for the player, mirrored for enemy
export const GRID_COLS = 3
export const GRID_ROWS = 2

export type BattlePhase =
  | 'placement'   // player positioning characters on grid
  | 'fighting'    // auto-battle running
  | 'intervention'// player's timed intervention window is open
  | 'victory'
  | 'defeat'

export interface StatusEffect {
  type: string
  value: number
  ticksRemaining: number
  sourceCharacterId: string
}

export interface BattleCharacter {
  // runtime id unique to this battle instance
  instanceId: string
  character: Character
  currentHp: number
  statusEffects: StatusEffect[]
  // ticks until this character can act again
  actionCooldownTicks: number
  // ticks until each equipped ability is available again
  abilityCooldownTicks: (number)[]
  isAlive: boolean
}

export interface BattleState {
  phase: BattlePhase
  tick: number
  // tick interval in ms
  tickRateMs: number
  playerTeam: BattleCharacter[]
  enemyTeam: BattleCharacter[]
  // log of events this battle for replay/display
  eventLog: BattleEvent[]
  // how many player interventions remain this battle
  interventionsRemaining: number
  maxInterventions: number
}

export type BattleEventType =
  | 'damage'
  | 'heal'
  | 'status_applied'
  | 'status_expired'
  | 'character_defeated'
  | 'ability_used'
  | 'season_counter'   // triggered when season advantage proc'd

export interface BattleEvent {
  tick: number
  type: BattleEventType
  sourceInstanceId: string
  targetInstanceId: string
  value?: number
  abilityId?: string
  seasonCounter?: boolean
}

// Player intervention: choose a character and an ability to fire manually
export interface InterventionAction {
  sourceInstanceId: string
  abilityIndex: number
  targetInstanceId: string
}
