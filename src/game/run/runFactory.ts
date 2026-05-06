import type { RunState, RunNode, Encounter, GameScreen } from './types'
import { ABILITY_POOL } from '../abilities/abilityPool'
import { getRosterBySeason } from '../characters/roster'
import type { Season } from '../characters/types'

// Run map: 10 floors, each floor has 2-3 node choices
// Floor 3, 6, 9 always have a Ram Dass checkpoint node as one option
// Floor 10 is always a boss battle (single node, no choice)

const TOTAL_FLOORS = 10
const RAM_DASS_FLOORS = new Set([3, 6, 9])
const BOSS_FLOOR = 10

function generateId(): string {
  return Math.random().toString(36).slice(2, 9)
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pickRandomN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(n, shuffled.length))
}

function makeEncounter(type: Encounter['type'], floor: number): Encounter {
  switch (type) {
    case 'battle':
      return { id: generateId(), type: 'battle', enemyTeamIds: [], completed: false }

    case 'recruit': {
      // Offer 3 random characters to recruit
      const options = pickRandomN(
        ['mira','thorn','pip','cinder','sol','ember','dusk','rot','vale','frost','wraith','hollow'],
        3
      )
      return { id: generateId(), type: 'recruit', recruitOptions: options, completed: false }
    }

    case 'ability_cache': {
      // Offer 2 random abilities to pick from
      const options = pickRandomN(ABILITY_POOL.map((a) => a.id), 2)
      return { id: generateId(), type: 'ability_cache', abilityOptions: options, completed: false }
    }

    case 'ram_dass':
      return { id: generateId(), type: 'ram_dass', completed: false }

    case 'rest':
      return { id: generateId(), type: 'rest', completed: false }
  }
}

// Per-floor encounter type weights
function getEncounterPool(floor: number): Encounter['type'][] {
  if (floor === 1) return ['battle']              // Floor 1 always a battle
  if (floor <= 3)  return ['battle', 'battle', 'ability_cache', 'rest']
  if (floor <= 6)  return ['battle', 'battle', 'ability_cache', 'recruit']
  if (floor <= 9)  return ['battle', 'battle', 'ability_cache', 'battle']
  return ['battle']                               // Boss floor
}

function buildFloorNodes(
  floor: number,
  nextFloorNodeIds: string[]
): RunNode[] {
  if (floor === BOSS_FLOOR) {
    const node: RunNode = {
      id: generateId(),
      encounter: makeEncounter('battle', floor),
      nextNodeIds: [],
    }
    return [node]
  }

  const nodeCount = floor === 1 ? 1 : Math.random() < 0.4 ? 3 : 2
  const pool = getEncounterPool(floor)

  const nodes: RunNode[] = []

  for (let i = 0; i < nodeCount; i++) {
    const type = pickRandom(pool)
    nodes.push({
      id: generateId(),
      encounter: makeEncounter(type, floor),
      // Each node on this floor connects to 1-2 nodes on the next floor
      nextNodeIds: pickRandomN(nextFloorNodeIds, Math.min(2, nextFloorNodeIds.length)),
    })
  }

  // Guarantee Ram Dass node as one of the options on checkpoint floors
  if (RAM_DASS_FLOORS.has(floor)) {
    nodes[0] = {
      ...nodes[0],
      encounter: makeEncounter('ram_dass', floor),
    }
  }

  return nodes
}

export function createRun(bondedSeason: Season): RunState {
  const nodes: Record<string, RunNode> = {}

  // Build floors bottom-up so we can wire nextNodeIds
  let nextFloorNodeIds: string[] = []

  for (let floor = TOTAL_FLOORS; floor >= 1; floor--) {
    const floorNodes = buildFloorNodes(floor, nextFloorNodeIds)
    for (const node of floorNodes) {
      nodes[node.id] = node
    }
    nextFloorNodeIds = floorNodes.map((n) => n.id)
  }

  // Entry point is the single floor-1 node (or first of floor 1 nodes)
  const firstFloorNodes = Object.values(nodes).filter(
    (n) => !Object.values(nodes).some((other) => other.nextNodeIds.includes(n.id))
  )
  const startNodeId = firstFloorNodes[0]?.id ?? null

  return {
    runId: generateId(),
    screen: 'exploration' as GameScreen,
    nodes,
    currentNodeId: startNodeId,
    team: [],
    abilityInventory: [],
    consecutiveLosses: 0,
    shownQuoteIds: [],
    floor: 1,
    gold: 0,
    startedAt: Date.now(),
    endedAt: null,
    victory: null,
  }
}
