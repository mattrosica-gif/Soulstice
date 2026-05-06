import type { Character } from '../characters/types'
import { CHARACTER_ROSTER } from '../characters/roster'
import { spawnCharacter } from '../characters/characterFactory'
import { awardExp, getBattleExpReward } from '../characters/leveling'
import { CHARACTER_DEFINITIONS_BY_ID } from '../characters/roster'

// Enemy teams are generated fresh each battle — scaled to floor depth
// Floor 1-3: 2 enemies at level 1-3
// Floor 4-6: 3 enemies at level 4-6
// Floor 7-9: 4 enemies at level 7-9
// Floor 10 (boss): 4 enemies + 1 boss at level 10-12

export interface EnemyConfig {
  count: number
  levelMin: number
  levelMax: number
  isBoss: boolean
}

export function getEnemyConfig(floor: number): EnemyConfig {
  if (floor <= 3)  return { count: 2, levelMin: 1,  levelMax: 3,  isBoss: false }
  if (floor <= 6)  return { count: 3, levelMin: 4,  levelMax: 6,  isBoss: false }
  if (floor <= 9)  return { count: 4, levelMin: 7,  levelMax: 9,  isBoss: false }
  return             { count: 5, levelMin: 10, levelMax: 12, isBoss: true  }
}

function levelUpToTarget(character: Character, targetLevel: number): Character {
  const definition = CHARACTER_DEFINITIONS_BY_ID[character.definitionId]
  if (!definition) return character

  let current = character
  while (current.level < targetLevel) {
    // Award enough EXP to guarantee a level-up
    current = awardExp(current, current.expToNextLevel + 1, definition)
  }
  return current
}

export function generateEnemyTeam(floor: number): Character[] {
  const config = getEnemyConfig(floor)
  const roster = [...CHARACTER_ROSTER]

  // Shuffle and pick
  for (let i = roster.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[roster[i], roster[j]] = [roster[j], roster[i]]
  }

  const selected = roster.slice(0, config.count)

  return selected.map((definition, idx) => {
    const base = spawnCharacter(definition, { isBonded: false })
    const targetLevel = config.levelMin + Math.floor(Math.random() * (config.levelMax - config.levelMin + 1))
    const leveled = levelUpToTarget(base, targetLevel)

    // Boss gets boosted HP
    if (config.isBoss && idx === 0) {
      return {
        ...leveled,
        stats: {
          ...leveled.stats,
          maxHp: Math.round(leveled.stats.maxHp * 1.8),
          hp: Math.round(leveled.stats.maxHp * 1.8),
        },
      }
    }

    return leveled
  })
}
