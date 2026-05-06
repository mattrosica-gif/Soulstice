import type { Character } from '../characters/types'
import type { Ability } from '../abilities/types'

export type GameScreen =
  | 'main_menu'
  | 'run_start'       // pick starting character
  | 'exploration'     // overworld between encounters
  | 'pre_battle'      // team placement before a fight
  | 'battle'          // active auto-battle
  | 'post_battle'     // rewards screen after winning
  | 'ram_dass'        // Ram Dass encounter
  | 'run_end_victory'
  | 'run_end_defeat'

export type EncounterType = 'battle' | 'recruit' | 'ability_cache' | 'ram_dass' | 'rest'

export interface Encounter {
  id: string
  type: EncounterType
  // for battle encounters: enemy team definition ids
  enemyTeamIds?: string[]
  // for recruit encounters: character definition ids on offer
  recruitOptions?: string[]
  // for ability_cache encounters: ability definition ids on offer
  abilityOptions?: string[]
  completed: boolean
}

export interface RunNode {
  id: string
  encounter: Encounter
  // ids of nodes this connects to (player chooses path)
  nextNodeIds: string[]
}

export interface RewardOption {
  type: 'ability' | 'recruit' | 'exp_boost' | 'heal'
  abilityId?: string
  characterDefinitionId?: string
  expAmount?: number
  healPercent?: number
}

export interface RunState {
  // unique id for this run
  runId: string
  // current screen
  screen: GameScreen
  // run map as a graph of nodes
  nodes: Record<string, RunNode>
  currentNodeId: string | null
  // player's active team (max 5)
  team: Character[]
  // ability inventory (unequipped abilities)
  abilityInventory: Ability[]
  // consecutive losses — triggers Ram Dass above threshold
  consecutiveLosses: number
  // which Ram Dass quotes have already been shown this run
  shownQuoteIds: string[]
  // run metadata
  floor: number
  gold: number
  startedAt: number
  endedAt: number | null
  victory: boolean | null
}

export const MAX_TEAM_SIZE = 5
export const RAM_DASS_LOSS_THRESHOLD = 2  // appears after this many consecutive losses
