import type { Season } from '../characters/types'
import type { RunState } from './types'
import { spawnBondedCharacter } from '../characters/characterFactory'
import { CHARACTER_ROSTER } from '../characters/roster'
import { createRun } from './runFactory'

export type OpeningStep =
  | { type: 'npc_tirade'; text: string }
  | { type: 'season_prompt' }
  | { type: 'bonded_reveal'; characterName: string; season: Season }
  | { type: 'run_start' }

// Multiple NPC tirade variants — picked randomly each run
// The NPC is always complaining about the current (rainy) season before asking
const NPC_TIRADES: string[] = [
  "Three days. Three days of this. My boots haven't been dry since Tuesday, the road to the mill is just soup at this point, I nearly lost a wheel this morning — a wheel, not a spoke, the whole wheel — and don't even get me started on the smell when everything's wet like this, there's a particular kind of damp that just gets into everything and... I'm rambling. What season do you like?",

  "You know what nobody tells you about rain? It's not the wet that gets you. It's the sound. All night. Every night. Drip drip drip off the eave right above where I sleep, I've moved the bed twice, twice, and it follows me somehow. And the mud in the market square — my neighbor's cart got stuck for two hours this morning, two hours, we all had to stand around watching like it was entertainment... I'm rambling. What season do you like?",

  "I've lived here forty years and every autumn I tell myself this is the last one, next year I'm going somewhere with a proper summer, somewhere where the ground is hard and the sky means it when it's blue. My cousin lives in the valley, he says it barely rains down there, barely. Do I move? No. Do I know why? Also no. I just stand here getting rained on like an idiot and... I'm rambling. What season do you like?",

  "My fire went out twice last night. Twice. Because the wood's damp, it's all damp, everything is damp, I try to dry it out by the hearth but then the rain comes in under the door and — you'd think after this many years someone would have fixed that gap, someone being me, and yet. Here we are. Gap still there. Floor still wet. Fire going out at three in the morning. And I've got deliveries first thing and... I'm rambling. What season do you like?",
]

export function getOpeningTirade(): string {
  return NPC_TIRADES[Math.floor(Math.random() * NPC_TIRADES.length)]
}

// Build the full opening sequence steps for the UI to walk through
export function getOpeningSteps(chosenSeason: Season | null): OpeningStep[] {
  const steps: OpeningStep[] = [
    { type: 'npc_tirade', text: getOpeningTirade() },
    { type: 'season_prompt' },
  ]

  if (chosenSeason) {
    // Will be populated after spawnBondedCharacter is called
    steps.push({ type: 'bonded_reveal', characterName: '...', season: chosenSeason })
    steps.push({ type: 'run_start' })
  }

  return steps
}

// Called once the player has picked their season — creates the full run + bonded character
export function beginRun(chosenSeason: Season): RunState {
  const run = createRun(chosenSeason)
  const bonded = spawnBondedCharacter(CHARACTER_ROSTER, chosenSeason)

  return {
    ...run,
    team: [bonded],
  }
}
