import type { Ability } from './types'
import { MAX_ABILITY_TIER } from './types'
import { getAbilityById } from './abilityPool'

// Spawn a fresh Tier 1 ability instance from a definition id
export function spawnAbility(definitionId: string): Ability | null {
  const definition = getAbilityById(definitionId)
  if (!definition) return null
  return {
    definitionId,
    name: definition.name,
    tier: 1,
    fuseCount: 0,
    fusesRequired: 1,
  }
}

export type FuseResult =
  | { success: true;  upgraded: Ability }
  | { success: false; reason: 'already_max_tier' | 'definition_not_found' }

// Fuse a duplicate into an existing ability — upgrades tier if fusesRequired met
// In Soulstice: one duplicate always equals one tier upgrade (fusesRequired is always 1)
export function fuseAbility(existing: Ability): FuseResult {
  if (existing.tier >= MAX_ABILITY_TIER) {
    return { success: false, reason: 'already_max_tier' }
  }

  const definition = getAbilityById(existing.definitionId)
  if (!definition) {
    return { success: false, reason: 'definition_not_found' }
  }

  const newTier = (existing.tier + 1) as Ability['tier']

  return {
    success: true,
    upgraded: {
      ...existing,
      tier: newTier,
      fuseCount: 0,
      fusesRequired: 1,
      name: definition.name, // name stays the same, tier is shown separately in UI
    },
  }
}

// Given a player's ability inventory and a newly found ability,
// either fuse it (if a copy exists) or add it fresh
export function receiveAbility(
  inventory: Ability[],
  incomingDefinitionId: string
): { inventory: Ability[]; fused: boolean; result: Ability | null } {
  const existingIdx = inventory.findIndex(
    (a) => a.definitionId === incomingDefinitionId && a.tier < MAX_ABILITY_TIER
  )

  if (existingIdx !== -1) {
    const fuseResult = fuseAbility(inventory[existingIdx])
    if (fuseResult.success) {
      const updated = [...inventory]
      updated[existingIdx] = fuseResult.upgraded
      return { inventory: updated, fused: true, result: fuseResult.upgraded }
    }
  }

  // No fuseable copy — add as new Tier 1
  const fresh = spawnAbility(incomingDefinitionId)
  if (!fresh) return { inventory, fused: false, result: null }

  return { inventory: [...inventory, fresh], fused: false, result: fresh }
}
