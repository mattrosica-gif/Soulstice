import type { CharacterDefinition } from './types'

export const CHARACTER_ROSTER: CharacterDefinition[] = [

  // ── SPRING ──────────────────────────────────────────────────────────────────
  {
    id: 'mira',
    name: 'Mira',
    description: 'Moves like water around an obstacle. Never where you expect her.',
    season: 'spring',
    role: 'support',
    baseStats: { maxHp: 70, attack: 40, defense: 35, speed: 80, evasion: 0.22 },
    abilitySlots: 3,
    spriteKey: 'mira',
  },
  {
    id: 'thorn',
    name: 'Thorn',
    description: 'Cheerful until threatened. Then very much not.',
    season: 'spring',
    role: 'disruptor',
    baseStats: { maxHp: 80, attack: 55, defense: 40, speed: 70, evasion: 0.15 },
    abilitySlots: 2,
    spriteKey: 'thorn',
  },
  {
    id: 'pip',
    name: 'Pip',
    description: 'Small. Extremely fast. Annoyingly hard to hit.',
    season: 'spring',
    role: 'attacker',
    baseStats: { maxHp: 60, attack: 60, defense: 25, speed: 95, evasion: 0.28 },
    abilitySlots: 2,
    spriteKey: 'pip',
  },

  // ── SUMMER ──────────────────────────────────────────────────────────────────
  {
    id: 'cinder',
    name: 'Cinder',
    description: 'Hits hard and knows it. Has the scars to prove both.',
    season: 'summer',
    role: 'attacker',
    baseStats: { maxHp: 90, attack: 80, defense: 45, speed: 55, evasion: 0.08 },
    abilitySlots: 2,
    spriteKey: 'cinder',
  },
  {
    id: 'sol',
    name: 'Sol',
    description: 'Relentless. Every fight ends on his terms or not at all.',
    season: 'summer',
    role: 'attacker',
    baseStats: { maxHp: 85, attack: 75, defense: 50, speed: 60, evasion: 0.06 },
    abilitySlots: 2,
    spriteKey: 'sol',
  },
  {
    id: 'ember',
    name: 'Ember',
    description: 'Burns bright, burns short. The team feeds off her energy.',
    season: 'summer',
    role: 'support',
    baseStats: { maxHp: 75, attack: 65, defense: 40, speed: 65, evasion: 0.10 },
    abilitySlots: 3,
    spriteKey: 'ember',
  },

  // ── AUTUMN ──────────────────────────────────────────────────────────────────
  {
    id: 'dusk',
    name: 'Dusk',
    description: "Quiet. Unhurried. Outlasts everyone in the room.",
    season: 'autumn',
    role: 'defender',
    baseStats: { maxHp: 110, attack: 45, defense: 75, speed: 35, evasion: 0.07 },
    abilitySlots: 2,
    spriteKey: 'dusk',
  },
  {
    id: 'rot',
    name: 'Rot',
    description: 'Unsettling to look at. Even more unsettling in a fight.',
    season: 'autumn',
    role: 'disruptor',
    baseStats: { maxHp: 85, attack: 60, defense: 55, speed: 45, evasion: 0.12 },
    abilitySlots: 3,
    spriteKey: 'rot',
  },
  {
    id: 'vale',
    name: 'Vale',
    description: 'Measured. Strategic. Has never once panicked.',
    season: 'autumn',
    role: 'support',
    baseStats: { maxHp: 90, attack: 50, defense: 60, speed: 50, evasion: 0.10 },
    abilitySlots: 3,
    spriteKey: 'vale',
  },

  // ── WINTER ──────────────────────────────────────────────────────────────────
  {
    id: 'frost',
    name: 'Frost',
    description: "Slow to start. Devastating to finish.",
    season: 'winter',
    role: 'attacker',
    baseStats: { maxHp: 100, attack: 85, defense: 60, speed: 30, evasion: 0.05 },
    abilitySlots: 2,
    spriteKey: 'frost',
  },
  {
    id: 'wraith',
    name: 'Wraith',
    description: 'Barely speaks. Barely needs to.',
    season: 'winter',
    role: 'disruptor',
    baseStats: { maxHp: 80, attack: 70, defense: 50, speed: 45, evasion: 0.18 },
    abilitySlots: 2,
    spriteKey: 'wraith',
  },
  {
    id: 'hollow',
    name: 'Hollow',
    description: 'Ancient and patient. Has seen worse than this.',
    season: 'winter',
    role: 'defender',
    baseStats: { maxHp: 130, attack: 40, defense: 85, speed: 25, evasion: 0.04 },
    abilitySlots: 2,
    spriteKey: 'hollow',
  },
]

export const getRosterBySeason = (season: CharacterDefinition['season']) =>
  CHARACTER_ROSTER.filter((c) => c.season === season)
