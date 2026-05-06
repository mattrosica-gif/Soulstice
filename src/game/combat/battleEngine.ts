import type {
  BattleState,
  BattleCharacter,
  BattleEvent,
  BattlePhase,
  StatusEffect,
  InterventionAction,
} from './types'
import type { Character } from '../characters/types'
import type { AbilityDefinition, AbilityEffect } from '../abilities/types'
import { getAbilityById } from '../abilities/abilityPool'
import { getActionCooldown, calcDamage, calcHeal, calcBasicAttack } from './combatMath'

// ── Initialization ───────────────────────────────────────────────────────────

function makeBattleCharacter(character: Character): BattleCharacter {
  return {
    instanceId: character.instanceId,
    character,
    currentHp: character.stats.hp,
    statusEffects: [],
    actionCooldownTicks: getActionCooldown(character.stats.speed),
    abilityCooldownTicks: character.equippedAbilities.map(() => 0),
    isAlive: true,
  }
}

export function initBattle(
  playerTeam: Character[],
  enemyTeam: Character[]
): BattleState {
  return {
    phase: 'placement',
    tick: 0,
    tickRateMs: 200,
    playerTeam: playerTeam.map(makeBattleCharacter),
    enemyTeam: enemyTeam.map(makeBattleCharacter),
    eventLog: [],
    interventionsRemaining: 2,
    maxInterventions: 2,
  }
}

// Start the auto-battle (called after player finishes placement)
export function startBattle(state: BattleState): BattleState {
  return { ...state, phase: 'fighting' }
}

// ── Targeting AI ─────────────────────────────────────────────────────────────

// Returns living enemies — prioritizes lowest HP (focus fire)
function getEnemyTargets(
  source: BattleCharacter,
  enemies: BattleCharacter[]
): BattleCharacter[] {
  const living = enemies.filter((e) => e.isAlive)
  return [...living].sort((a, b) => a.currentHp - b.currentHp)
}

// Returns living allies (excluding self)
function getAllyTargets(
  source: BattleCharacter,
  allies: BattleCharacter[]
): BattleCharacter[] {
  return allies.filter((a) => a.isAlive && a.instanceId !== source.instanceId)
}

function resolveTargets(
  source: BattleCharacter,
  targetType: AbilityDefinition['targetType'],
  allies: BattleCharacter[],
  enemies: BattleCharacter[]
): BattleCharacter[] {
  switch (targetType) {
    case 'single_enemy':   return getEnemyTargets(source, enemies).slice(0, 1)
    case 'all_enemies':    return enemies.filter((e) => e.isAlive)
    case 'single_ally':    return getAllyTargets(source, allies).slice(0, 1)
    case 'all_allies':     return allies.filter((a) => a.isAlive)
    case 'self':           return [source]
  }
}

// ── Effect Application ───────────────────────────────────────────────────────

function applyEffect(
  source: BattleCharacter,
  target: BattleCharacter,
  effect: AbilityEffect,
  tick: number,
  events: BattleEvent[]
): BattleCharacter {
  switch (effect.type) {
    case 'damage': {
      const { damage, evaded, seasonCounter } = calcDamage(source, target, effect.value)
      events.push({
        tick,
        type: evaded ? 'damage' : 'damage',
        sourceInstanceId: source.instanceId,
        targetInstanceId: target.instanceId,
        value: damage,
        seasonCounter,
      })
      const newHp = Math.max(0, target.currentHp - damage)
      return { ...target, currentHp: newHp, isAlive: newHp > 0 }
    }

    case 'heal': {
      const amount = calcHeal(effect.value)
      const newHp = Math.min(target.character.stats.maxHp, target.currentHp + amount)
      events.push({ tick, type: 'heal', sourceInstanceId: source.instanceId, targetInstanceId: target.instanceId, value: amount })
      return { ...target, currentHp: newHp }
    }

    case 'dot':
    case 'hot':
    case 'buff_attack':
    case 'buff_defense':
    case 'buff_speed':
    case 'debuff_attack':
    case 'debuff_defense':
    case 'debuff_speed':
    case 'stun':
    case 'taunt': {
      const statusEffect: StatusEffect = {
        type: effect.type,
        value: effect.value,
        ticksRemaining: effect.duration ?? 1,
        sourceCharacterId: source.instanceId,
      }
      events.push({ tick, type: 'status_applied', sourceInstanceId: source.instanceId, targetInstanceId: target.instanceId, value: effect.value })
      return { ...target, statusEffects: [...target.statusEffects, statusEffect] }
    }

    default:
      return target
  }
}

// ── Status Effect Ticking ────────────────────────────────────────────────────

function tickStatusEffects(
  battleChar: BattleCharacter,
  tick: number,
  events: BattleEvent[]
): BattleCharacter {
  if (!battleChar.isAlive) return battleChar

  let { currentHp, statusEffects } = battleChar
  const remaining: StatusEffect[] = []

  for (const effect of statusEffects) {
    if (effect.type === 'dot') {
      const damage = Math.max(1, effect.value)
      currentHp = Math.max(0, currentHp - damage)
      events.push({ tick, type: 'damage', sourceInstanceId: effect.sourceCharacterId, targetInstanceId: battleChar.instanceId, value: damage })
    }

    if (effect.type === 'hot') {
      const heal = Math.max(1, effect.value)
      currentHp = Math.min(battleChar.character.stats.maxHp, currentHp + heal)
      events.push({ tick, type: 'heal', sourceInstanceId: effect.sourceCharacterId, targetInstanceId: battleChar.instanceId, value: heal })
    }

    const newTicks = effect.ticksRemaining - 1
    if (newTicks > 0) {
      remaining.push({ ...effect, ticksRemaining: newTicks })
    } else {
      events.push({ tick, type: 'status_expired', sourceInstanceId: effect.sourceCharacterId, targetInstanceId: battleChar.instanceId })
    }
  }

  return {
    ...battleChar,
    currentHp,
    isAlive: currentHp > 0,
    statusEffects: remaining,
  }
}

// ── Stat Modifier Helpers (reads active buffs/debuffs) ───────────────────────

function getStatModifier(battleChar: BattleCharacter, statType: string): number {
  return battleChar.statusEffects
    .filter((e) => e.type === statType)
    .reduce((sum, e) => sum + e.value, 0)
}

// ── Character Action ─────────────────────────────────────────────────────────

function chooseAndExecuteAction(
  source: BattleCharacter,
  allies: BattleCharacter[],
  enemies: BattleCharacter[],
  tick: number,
  events: BattleEvent[]
): { allies: BattleCharacter[]; enemies: BattleCharacter[]; updatedSource: BattleCharacter } {
  const isStunned = source.statusEffects.some((e) => e.type === 'stun')

  if (isStunned) {
    return { allies, enemies, updatedSource: source }
  }

  // Try each equipped ability slot in order
  const { equippedAbilities } = source.character
  let actionTaken = false
  let updatedAllies = [...allies]
  let updatedEnemies = [...enemies]
  let updatedSource = { ...source }

  for (let slotIdx = 0; slotIdx < equippedAbilities.length; slotIdx++) {
    const abilityId = equippedAbilities[slotIdx]
    if (!abilityId) continue
    if (updatedSource.abilityCooldownTicks[slotIdx] > 0) continue

    const definition = getAbilityById(abilityId.split(':')[0])
    if (!definition) continue

    // Find the ability tier from the character's equipped ability string ("id:tier")
    const tier = parseInt(abilityId.split(':')[1] ?? '1', 10) as 1 | 2 | 3 | 4
    const tierData = definition.tiers[tier - 1]

    const isTargetingEnemies = ['single_enemy', 'all_enemies'].includes(definition.targetType)
    const sourceTeamIsPlayer = allies === updatedAllies
    const targetPool = isTargetingEnemies ? updatedEnemies : updatedAllies
    const targets = resolveTargets(updatedSource, definition.targetType, updatedAllies, updatedEnemies)

    if (targets.length === 0) continue

    events.push({
      tick,
      type: 'ability_used',
      sourceInstanceId: updatedSource.instanceId,
      targetInstanceId: targets[0].instanceId,
      abilityId: definition.id,
    })

    // Apply each effect to each target
    for (const effect of tierData.effects) {
      for (const target of targets) {
        const isEnemy = updatedEnemies.some((e) => e.instanceId === target.instanceId)
        const updatedTarget = applyEffect(updatedSource, target, effect, tick, events)

        if (isEnemy) {
          updatedEnemies = updatedEnemies.map((e) => e.instanceId === target.instanceId ? updatedTarget : e)
        } else {
          updatedAllies = updatedAllies.map((a) => a.instanceId === target.instanceId ? updatedTarget : a)
        }
      }
    }

    // Set ability on cooldown
    const newCooldowns = [...updatedSource.abilityCooldownTicks]
    newCooldowns[slotIdx] = tierData.cooldown
    updatedSource = { ...updatedSource, abilityCooldownTicks: newCooldowns }
    actionTaken = true
    break
  }

  // No ability fired — basic attack
  if (!actionTaken) {
    const targets = getEnemyTargets(updatedSource, updatedEnemies).slice(0, 1)
    if (targets.length > 0) {
      const target = targets[0]
      const { damage, evaded, seasonCounter } = calcBasicAttack(updatedSource, target)
      events.push({
        tick,
        type: 'damage',
        sourceInstanceId: updatedSource.instanceId,
        targetInstanceId: target.instanceId,
        value: damage,
        seasonCounter,
      })
      const newHp = Math.max(0, target.currentHp - damage)
      const updatedTarget = { ...target, currentHp: newHp, isAlive: newHp > 0 }
      updatedEnemies = updatedEnemies.map((e) => e.instanceId === target.instanceId ? updatedTarget : e)
    }
  }

  return { allies: updatedAllies, enemies: updatedEnemies, updatedSource }
}

// ── Main Tick ────────────────────────────────────────────────────────────────

export function tickBattle(state: BattleState): BattleState {
  if (state.phase !== 'fighting') return state

  const tick = state.tick + 1
  const events: BattleEvent[] = []

  let playerTeam = [...state.playerTeam]
  let enemyTeam = [...state.enemyTeam]

  // Decrement action cooldowns and fire actions for ready characters
  // Process all characters sorted by speed (fastest acts first on ties)
  const allChars = [
    ...playerTeam.map((c) => ({ char: c, isPlayer: true })),
    ...enemyTeam.map((c) => ({ char: c, isPlayer: false })),
  ].sort((a, b) => b.char.character.stats.speed - a.char.character.stats.speed)

  for (const { char, isPlayer } of allChars) {
    if (!char.isAlive) continue

    // Find the current instance from the mutable team arrays
    const teamRef = isPlayer ? playerTeam : enemyTeam
    const currentChar = teamRef.find((c) => c.instanceId === char.instanceId)
    if (!currentChar || !currentChar.isAlive) continue

    // Decrement action cooldown
    const newActionCooldown = currentChar.actionCooldownTicks - 1

    if (newActionCooldown > 0) {
      // Not ready to act yet — also decrement ability cooldowns
      const newAbilityCooldowns = currentChar.abilityCooldownTicks.map((cd) => Math.max(0, cd - 1))
      const updated = { ...currentChar, actionCooldownTicks: newActionCooldown, abilityCooldownTicks: newAbilityCooldowns }
      if (isPlayer) playerTeam = playerTeam.map((c) => c.instanceId === updated.instanceId ? updated : c)
      else enemyTeam = enemyTeam.map((c) => c.instanceId === updated.instanceId ? updated : c)
      continue
    }

    // Ready to act
    const { allies: newAllies, enemies: newEnemies, updatedSource } = chooseAndExecuteAction(
      { ...currentChar, actionCooldownTicks: 0 },
      isPlayer ? playerTeam : enemyTeam,
      isPlayer ? enemyTeam : playerTeam,
      tick,
      events
    )

    // Reset action cooldown for next action
    const resetSource = {
      ...updatedSource,
      actionCooldownTicks: getActionCooldown(currentChar.character.stats.speed),
      abilityCooldownTicks: updatedSource.abilityCooldownTicks.map((cd) => Math.max(0, cd - 1)),
    }

    if (isPlayer) {
      playerTeam = newAllies.map((c) => c.instanceId === resetSource.instanceId ? resetSource : c)
      enemyTeam = newEnemies
    } else {
      enemyTeam = newAllies.map((c) => c.instanceId === resetSource.instanceId ? resetSource : c)
      playerTeam = newEnemies
    }
  }

  // Tick status effects for all living characters
  playerTeam = playerTeam.map((c) => tickStatusEffects(c, tick, events))
  enemyTeam = enemyTeam.map((c) => tickStatusEffects(c, tick, events))

  // Log defeats
  for (const c of [...playerTeam, ...enemyTeam]) {
    if (!c.isAlive && state.playerTeam.concat(state.enemyTeam).find((p) => p.instanceId === c.instanceId)?.isAlive) {
      events.push({ tick, type: 'character_defeated', sourceInstanceId: c.instanceId, targetInstanceId: c.instanceId })
    }
  }

  // Check win/loss
  const playerAlive = playerTeam.some((c) => c.isAlive)
  const enemyAlive = enemyTeam.some((c) => c.isAlive)

  let phase: BattlePhase = 'fighting'
  if (!enemyAlive) phase = 'victory'
  else if (!playerAlive) phase = 'defeat'

  return {
    ...state,
    tick,
    phase,
    playerTeam,
    enemyTeam,
    eventLog: [...state.eventLog, ...events],
  }
}

// ── Player Intervention ───────────────────────────────────────────────────────

export function applyIntervention(
  state: BattleState,
  action: InterventionAction
): BattleState {
  if (state.interventionsRemaining <= 0) return state
  if (state.phase !== 'fighting') return state

  const source = state.playerTeam.find((c) => c.instanceId === action.sourceInstanceId)
  const target = [...state.playerTeam, ...state.enemyTeam].find((c) => c.instanceId === action.targetInstanceId)

  if (!source || !target || !source.isAlive || !target.isAlive) return state

  const abilityId = source.character.equippedAbilities[action.abilityIndex]
  if (!abilityId) return state

  const definition = getAbilityById(abilityId.split(':')[0])
  if (!definition) return state

  const tier = parseInt(abilityId.split(':')[1] ?? '1', 10) as 1 | 2 | 3 | 4
  const tierData = definition.tiers[tier - 1]
  const events: BattleEvent[] = []

  let playerTeam = [...state.playerTeam]
  let enemyTeam = [...state.enemyTeam]

  const targets = resolveTargets(source, definition.targetType, playerTeam, enemyTeam)

  for (const effect of tierData.effects) {
    for (const t of targets) {
      const isEnemy = enemyTeam.some((e) => e.instanceId === t.instanceId)
      const updatedTarget = applyEffect(source, t, effect, state.tick, events)
      if (isEnemy) enemyTeam = enemyTeam.map((e) => e.instanceId === t.instanceId ? updatedTarget : e)
      else playerTeam = playerTeam.map((a) => a.instanceId === t.instanceId ? updatedTarget : a)
    }
  }

  return {
    ...state,
    playerTeam,
    enemyTeam,
    interventionsRemaining: state.interventionsRemaining - 1,
    eventLog: [...state.eventLog, ...events],
  }
}
