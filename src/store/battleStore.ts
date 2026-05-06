import { create } from 'zustand'
import type { BattleState, BattleEvent, InterventionAction } from '../game/combat/types'

interface BattleStore {
  battle: BattleState | null
  setBattle: (battle: BattleState) => void
  clearBattle: () => void
  tickBattle: (updatedBattle: BattleState) => void
  logEvent: (event: BattleEvent) => void
  applyIntervention: (action: InterventionAction) => void
}

export const useBattleStore = create<BattleStore>((set) => ({
  battle: null,

  setBattle: (battle) => set({ battle }),

  clearBattle: () => set({ battle: null }),

  tickBattle: (updatedBattle) => set({ battle: updatedBattle }),

  logEvent: (event) =>
    set((state) => {
      if (!state.battle) return state
      return {
        battle: {
          ...state.battle,
          eventLog: [...state.battle.eventLog, event],
        },
      }
    }),

  applyIntervention: (action) =>
    set((state) => {
      if (!state.battle) return state
      if (state.battle.interventionsRemaining <= 0) return state
      return {
        battle: {
          ...state.battle,
          interventionsRemaining: state.battle.interventionsRemaining - 1,
        },
      }
    }),
}))
