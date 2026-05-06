import type { RunState } from '../run/types'
import { RAM_DASS_LOSS_THRESHOLD } from '../run/types'
import { RAM_DASS_QUOTES, type RamDassQuote } from './quotes'

export type RamDassTrigger = 'consecutive_loss' | 'checkpoint' | 'first_defeat' | 'any'

// Should Ram Dass appear right now?
export function shouldRamDassAppear(run: RunState): boolean {
  // Checkpoint node — handled by the run map (encounter type 'ram_dass')
  if (run.screen === 'ram_dass') return true

  // First ever defeat this run
  if (run.consecutiveLosses === 1 && !run.shownQuoteIds.length) return true

  // Consecutive loss threshold
  if (run.consecutiveLosses >= RAM_DASS_LOSS_THRESHOLD) return true

  return false
}

export function getTriggerType(run: RunState): RamDassTrigger {
  if (run.screen === 'ram_dass') return 'checkpoint'
  if (run.consecutiveLosses === 1 && !run.shownQuoteIds.length) return 'first_defeat'
  if (run.consecutiveLosses >= RAM_DASS_LOSS_THRESHOLD) return 'consecutive_loss'
  return 'any'
}

// Pick the best unseen quote for the current trigger
export function selectQuote(run: RunState): RamDassQuote | null {
  const trigger = getTriggerType(run)
  const unseen = RAM_DASS_QUOTES.filter((q) => !run.shownQuoteIds.includes(q.id))

  if (unseen.length === 0) return null

  // Prefer quotes that match the trigger type
  const matching = unseen.filter((q) => q.trigger === trigger || q.trigger === 'any')
  const pool = matching.length > 0 ? matching : unseen

  return pool[Math.floor(Math.random() * pool.length)]
}

// Bonded character's unique reaction line when Ram Dass appears
// Keyed by season — the bonded character's reaction reflects their nature
export const BONDED_REACTIONS: Record<string, string> = {
  spring: 'They look up, rain still falling on their face. Something shifts.',
  summer: 'They go quiet. For the first time since you met them.',
  autumn: 'A long exhale. Like they\'ve heard this before. Like they needed to hear it again.',
  winter: 'They don\'t move. But their eyes do.',
}
