# Soulstice — Living Design Document

> Keep this file updated at every milestone. Any AI agent (Claude, Codex, etc.) should be able to read this cold and immediately understand the full project.

---

## What Is Soulstice?

A cozy auto-battler roguelike. Browser-based, pixel art, rainy ambient aesthetic. The player builds and upgrades a small team of humanoid characters, positions them before each fight, and watches them battle automatically. Each run lasts ~45 minutes. The game has soul — literally. Ram Dass wanders through it.

---

## Core Design Decisions & Why

### Genre: Auto-Battler Roguelike
- **Why not Pokemon-style turn-based?** Too reliant on deep IP and story to be interesting. Without Pokemon's monster roster and 30-year lore, turn-based combat is boring on its own.
- **Why auto-battler?** The interesting decisions happen in the *preparation phase* — positioning, team composition, ability loadout. Then you watch your setup play out. Satisfying without needing a story to carry it.
- **Why roguelike?** The run structure (~45 min) replaces the need for a deep narrative. Each run is its own arc. Failure is part of the loop, not a setback.

### Aesthetic: Cozy Rainy
- 8-bit / 16-bit pixel art sprites
- Warm color palette: amber, moss green, soft orange, slate blue for rain
- Rainy ambient world — always raining, lantern light, fog
- Small expressive humanoid characters with personality animations (blink, idle wiggle, react)
- Inspired by: Stardew Valley meets a creature collector, Claude's own 8-bit character aesthetic

### Characters: Humanoid with Season Affinity
- Characters are NOT animals. They are small expressive humanoid adventurers/wanderers with distinct personalities.
- Each character has a **Season Affinity**: Spring, Summer, Autumn, or Winter
- Affinities determine combat matchups (see below)
- Characters have visual design that reflects their season — a Winter character might be stoic, pale, slow but devastating; a Spring character light and evasive

### Type/Affinity System: The Four Seasons
Real-world intuitive — everyone already carries seasonal associations in their mind.

**Counter logic (circular):**
- Summer scorches Autumn (heat burns dry leaves)
- Autumn decays Winter (rot outlasts the freeze)
- Winter freezes Spring (frost kills new growth)
- Spring drowns Summer (rain cools and overwhelms heat)

**Multipliers (defined in `src/game/characters/types.ts`):**
- Counter advantage: 1.5x damage
- Counter weakness: 0.67x damage

**Character archetypes by season:**
- **Summer** — aggressive, high damage, burns through opponents
- **Autumn** — balanced, drain/decay abilities, outlasts enemies
- **Winter** — slow, stoic, tanky, massive burst damage
- **Spring** — fast, evasive, healing, hard to pin down

### Combat: Auto-Battler Grid
- Player fields 3–5 characters on a 3x2 grid before each fight
- Enemy team mirrors on the opposite side
- Characters fight automatically based on position, affinity, and ability loadout
- Player has **2 limited interventions** per battle — manually fire an ability at the right moment
- Depth comes from team composition, synergies, and positioning

### Progression System: Two Parallel Loops

**Loop 1 — Character Growth (EXP-based):**
- Characters gain EXP from fights
- Level up improves base stats
- Standard RPG feel — you grow attached to your characters over a run

**Loop 2 — Ability/Weapon Upgrades (Hyper Scape fuse system):**
- Every ability found is always **Tier 1**, no exceptions
- Find a duplicate → fuse them → upgrades to Tier 2
- Find another duplicate → Tier 3, then Tier 4 (max)
- Higher tiers: better stats + different fx key (visual variant)
- **The tension:** Fuse for power vs grab new ability for synergy
- Defined in `src/game/abilities/types.ts`

### Run Start: Meeting Your Main (The Bond)

Inspired by Ash meeting Pikachu — your first character is your *main*, not a selection from a list.

**The disguised season pick:**
- Opening scene: rainy night, a village. An NPC (a merchant, farmer, or old local — someone with a reason to be outside in bad weather) launches into a long tirade about the current season. Rain, mud, his back, the cart. Then catches himself: *"...I'm rambling. What season do you like?"*
- Player picks Spring / Summer / Autumn / Winter — feels like small talk, not a game mechanic
- The NPC's tirade varies between runs. His identity (innkeeper, farmer, merchant, gate-keeper) is TBD
- The word "actually" in the question earns itself because he just spent 30 seconds complaining

**The bonded character:**
- A random character of the chosen season is assigned as the player's main
- They are never chosen from a list — the game presents them as found, not picked
- The bond is immediate and wordless — a brief scene, not a tutorial

**Bond mechanics:**
- Main can never be benched or removed from the team
- Passive bonus when adjacent to allies on the grid (TBD exact value)
- Unique reaction line when Ram Dass appears
- If they fall in battle: run doesn't end but music/palette shifts to signal the weight of it
- Inventory shows "Bonded" where season would normally appear — season revealed through play

**Main character stat generation:**
- **Potential** (like Pokemon IVs): each stat has a growth rate `0.0–1.0` rolled at spawn
  - Normal recruits: `0.3–0.8` per stat
  - Main character: `0.7–1.0` per stat — noticeably exceptional as they level
- **Temperament** (like Pokemon Nature): named personality, `+15%` one stat, `-10%` another
  - `Resolute` — Attack+, Evasion-
  - `Nimble` — Speed+, Defense-
  - `Ironclad` — Defense+, Speed-
  - `Ghostlike` — Evasion+, Attack-
  - `Radiant` — balanced, no penalty (rare)
- Temperament name revealed after first battle
- Potential felt organically through leveling — never shown as a number
- All recruits have temperament + potential, but main's potential floor is higher

### The Spiritual Layer: Ram Dass

At certain moments — consecutive losses (threshold: 2), checkpoints, first defeat — **Ram Dass appears**.

**Who he is:**
- Pixel art figure clearly modeled on Ram Dass (Richard Alpert, 1931–2019)
- Long white flowing beard, mala beads, warm amber glow
- Slightly different visual treatment — softer palette, unhurried idle animation

**Trigger logic (defined in `src/game/run/types.ts`):**
- `RAM_DASS_LOSS_THRESHOLD = 2` — appears after 2 consecutive losses
- Also appears at specific checkpoint nodes in the run map
- Quotes have trigger types: `consecutive_loss`, `checkpoint`, `first_defeat`, `any`
- Already-shown quotes tracked in `RunState.shownQuoteIds` to avoid repeats

**Quote pool:** `src/game/ramdass/quotes.ts` — 10 quotes, never hardcode inline

---

## Tech Stack

- **Framework:** React + TypeScript
- **State management:** Zustand
- **Game engine:** Phaser 3 (handles game loop, scene management, sprite animation, input, audio)
- **Build tool:** Vite
- **Skills installed:** `pixel-art-game-builder`, `game-development`
- **Platform:** Browser-based, no backend

**Architecture rule:** All game logic lives in `src/game/` with zero React/Phaser dependencies. Phaser is rendering only. Zustand is the bridge between game logic and React UI.

---

## Project Structure

```
Soulstice/
├── NOTES.md                          ← This file. Always keep updated.
├── src/
│   ├── game/
│   │   ├── characters/
│   │   │   └── types.ts              ← Character, CharacterDefinition, Season, SEASON_COUNTERS
│   │   ├── abilities/
│   │   │   └── types.ts              ← Ability, AbilityDefinition, AbilityTierData, fuse constants
│   │   ├── combat/
│   │   │   └── types.ts              ← BattleState, BattleCharacter, BattleEvent, InterventionAction
│   │   ├── run/
│   │   │   └── types.ts              ← RunState, GameScreen, Encounter, RunNode, RewardOption
│   │   └── ramdass/
│   │       └── quotes.ts             ← RamDassQuote[], full quote pool with trigger types
│   ├── store/
│   │   ├── runStore.ts               ← Zustand: run lifecycle, team, inventory, loss tracking
│   │   └── battleStore.ts            ← Zustand: battle state, tick updates, intervention handling
│   ├── rendering/                    ← (empty) Phaser scenes and sprite logic go here
│   ├── ui/                           ← (empty) React UI components go here
│   └── main.tsx                      ← Vite entry point
├── package.json
└── vite.config.ts
```

---

## What's Been Built

- [x] Project folder created, design locked
- [x] Git repo initialized, pushed to https://github.com/mattrosica-gif/Soulstice
- [x] Vite + React + TypeScript scaffolded
- [x] Zustand + Phaser 3 installed
- [x] Full folder structure created
- [x] All TypeScript schemas defined — zero type errors
- [x] Zustand stores scaffolded (runStore, battleStore)

---

## What's Next (Phase 1)

1. **Character roster data** — define 8–12 characters across the four seasons in `src/game/characters/roster.ts`
2. **Ability data** — define starter ability pool in `src/game/abilities/abilityPool.ts`
3. **Season counter logic** — pure TS function `getSeasonMultiplier(attacker, defender)` in `src/game/characters/`
4. **Auto-battle engine** — pure TS battle tick loop in `src/game/combat/battleEngine.ts`
5. **Run factory** — function to generate a new run with a map of nodes in `src/game/run/runFactory.ts`
6. **EXP + leveling** — `src/game/characters/leveling.ts`
7. **Ability fuse logic** — `src/game/abilities/fusionEngine.ts`

---

## Open Questions

- How many characters in the starting roster? (suggest 8–12 across the four seasons)
- Does the player start each run with 1 character or a small preset team?
- Is there persistent meta-progression between runs (like Hades' darkness system) or purely fresh each run?

---

## Conventions (for Codex handoff)

- All game logic in `src/game/` — zero React or Phaser imports in these files
- Phaser only in `src/rendering/`
- React only in `src/ui/` and `src/main.tsx`
- Zustand stores in `src/store/` bridge the two worlds
- Season affinity: `'spring' | 'summer' | 'autumn' | 'winter'`
- Ability tiers: `1 | 2 | 3 | 4`
- Ram Dass quotes always referenced by id, never hardcoded inline
- `SEASON_COUNTERS` map and multiplier constants live in `src/game/characters/types.ts`
- `RAM_DASS_LOSS_THRESHOLD` lives in `src/game/run/types.ts`
