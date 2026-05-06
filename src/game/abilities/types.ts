export type AbilityTargetType = 'single_enemy' | 'all_enemies' | 'single_ally' | 'all_allies' | 'self'

export type AbilityEffectType =
  | 'damage'
  | 'heal'
  | 'buff_attack'
  | 'buff_defense'
  | 'buff_speed'
  | 'debuff_attack'
  | 'debuff_defense'
  | 'debuff_speed'
  | 'dot'      // damage over time
  | 'hot'      // heal over time
  | 'stun'     // skip next action
  | 'taunt'    // force enemies to target this character

export interface AbilityEffect {
  type: AbilityEffectType
  // base value — damage dealt, HP healed, stat % change, duration in ticks
  value: number
  // for dot/hot/buffs/debuffs: how many battle ticks this lasts
  duration?: number
}

export interface AbilityTierData {
  tier: 1 | 2 | 3 | 4
  effects: AbilityEffect[]
  // cooldown in battle ticks between uses
  cooldown: number
  // visual/audio variant key for this tier
  fxKey: string
}

export interface AbilityDefinition {
  id: string
  name: string
  description: string
  targetType: AbilityTargetType
  tiers: [AbilityTierData, AbilityTierData, AbilityTierData, AbilityTierData]
  spriteKey: string
}

// A live ability instance held in the player's inventory or equipped on a character
export interface Ability {
  definitionId: string
  name: string
  tier: 1 | 2 | 3 | 4
  // how many duplicates have been fused into this (resets to 0 on tier up)
  fuseCount: number
  // duplicates needed to reach next tier (always 1 dupe = 1 fuse = tier up)
  fusesRequired: 1
}

// How many copies of an ability are needed to fuse to next tier
export const FUSE_COPIES_REQUIRED = 1
export const MAX_ABILITY_TIER = 4
