import { create } from 'zustand'
import type { RunState, GameScreen } from '../game/run/types'
import type { Character } from '../game/characters/types'
import type { Ability } from '../game/abilities/types'

interface RunStore {
  run: RunState | null
  setScreen: (screen: GameScreen) => void
  setRun: (run: RunState) => void
  clearRun: () => void
  addCharacterToTeam: (character: Character) => void
  removeCharacterFromTeam: (instanceId: string) => void
  addAbilityToInventory: (ability: Ability) => void
  removeAbilityFromInventory: (abilityId: string, tier: number) => void
  incrementConsecutiveLosses: () => void
  resetConsecutiveLosses: () => void
  markQuoteShown: (quoteId: string) => void
}

export const useRunStore = create<RunStore>((set) => ({
  run: null,

  setRun: (run) => set({ run }),

  clearRun: () => set({ run: null }),

  setScreen: (screen) =>
    set((state) => {
      if (!state.run) return state
      return { run: { ...state.run, screen } }
    }),

  addCharacterToTeam: (character) =>
    set((state) => {
      if (!state.run) return state
      return { run: { ...state.run, team: [...state.run.team, character] } }
    }),

  removeCharacterFromTeam: (instanceId) =>
    set((state) => {
      if (!state.run) return state
      return {
        run: {
          ...state.run,
          team: state.run.team.filter((c) => c.name !== instanceId),
        },
      }
    }),

  addAbilityToInventory: (ability) =>
    set((state) => {
      if (!state.run) return state
      return {
        run: {
          ...state.run,
          abilityInventory: [...state.run.abilityInventory, ability],
        },
      }
    }),

  removeAbilityFromInventory: (abilityId, tier) =>
    set((state) => {
      if (!state.run) return state
      const idx = state.run.abilityInventory.findIndex(
        (a) => a.definitionId === abilityId && a.tier === tier
      )
      if (idx === -1) return state
      const updated = [...state.run.abilityInventory]
      updated.splice(idx, 1)
      return { run: { ...state.run, abilityInventory: updated } }
    }),

  incrementConsecutiveLosses: () =>
    set((state) => {
      if (!state.run) return state
      return {
        run: { ...state.run, consecutiveLosses: state.run.consecutiveLosses + 1 },
      }
    }),

  resetConsecutiveLosses: () =>
    set((state) => {
      if (!state.run) return state
      return { run: { ...state.run, consecutiveLosses: 0 } }
    }),

  markQuoteShown: (quoteId) =>
    set((state) => {
      if (!state.run) return state
      return {
        run: {
          ...state.run,
          shownQuoteIds: [...state.run.shownQuoteIds, quoteId],
        },
      }
    }),
}))
