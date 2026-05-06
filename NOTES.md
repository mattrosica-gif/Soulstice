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

**Character archetypes by season:**
- **Summer** — aggressive, high damage, burns through opponents
- **Autumn** — balanced, drain/decay abilities, outlasts enemies
- **Winter** — slow, stoic, tanky, massive burst damage
- **Spring** — fast, evasive, healing, hard to pin down

This system was chosen over:
- Animal ecology (food chain) — rejected because it forced characters to BE animals
- Classical elements (fire/water/ice) — too similar to Pokemon, not different enough
- Military unit counters — good but less visually expressive
- Social manipulation triangle — interesting but less intuitive at a glance

### Combat: Auto-Battler Grid
- Player fields 3–5 characters on a small grid before each fight
- Characters fight automatically based on position, affinity, and ability loadout
- Player has **1–2 limited interventions** per battle (not spammy — use them at the right moment)
- Depth comes from team composition, synergies, and positioning — not from clicking through menus

### Progression System: Two Parallel Loops

**Loop 1 — Character Growth (EXP-based):**
- Characters gain EXP from fights
- Level up improves base stats
- Standard RPG feel — you grow attached to your characters over a run

**Loop 2 — Ability/Weapon Upgrades (Hyper Scape fuse system):**
- Every ability/weapon found is always **Tier 1**, no exceptions
- Find a duplicate of the same ability/weapon → fuse them → upgrades to Tier 2
- Find another duplicate → fuse again → Tier 3 (max, possibly T4 as rare cap)
- Higher tiers: better stats + visual change (sprite evolves, new color palette)
- **The tension:** Do I fuse this duplicate to upgrade my T1 ability to T2... or grab a new ability for team synergy I'm missing?

This was inspired by Hyper Scape (Ubisoft battle royale) where weapons/hacks always started at T1 and upgraded through fusing duplicates.

### The Spiritual Layer: Ram Dass

This is the heart of the game's identity.

At certain moments — brutal loss streaks, specific run checkpoints, moments that feel impossible — **Ram Dass appears**. Not a cutscene. Not a tutorial. A quiet encounter.

**Who he is:**
- A pixel art figure clearly modeled on Ram Dass (Richard Alpert, 1931–2019)
- Long white flowing beard, warm eyes, mala beads in hand
- Sitting in lotus position or wandering with a staff
- Slightly different visual treatment from the rest of the world — warmer amber glow, softer pixel palette around him

**What he does:**
- Speaks in Ram Dass's actual cadence — short, unhurried, loving
- Pulls from his real quotes (lightly adapted for game context):
  - *"Be here now."*
  - *"We're all just walking each other home."*
  - *"The quieter you become, the more you can hear."*
  - *"You are loved just for being who you are, just for existing."*
  - *"Treat everyone you meet like God in drag."*
- Does NOT fix your problem mechanically — he reframes it
- May offer a small nudge: a new recruit option, a free ability fuse — but the wisdom IS the moment

**Why Ram Dass specifically:**
- The creator is drawn to Ram Dass, psychedelics, and religious mystics as themes
- These shouldn't dominate the game but should surface at the edges — at the threshold moments
- It gives the game a spiritual father figure, a sense that failure is part of something larger
- Ram Dass passed in 2019 — this is tribute territory, done with deep respect

**Visual moment when he appears:**
- Ambient palette shifts slightly warmer and softer
- Rain slows or softens in the background
- Music shifts to something meditative
- His sprite has a distinct idle animation — unhurried, present

---

## Tech Stack

- **Framework:** React + TypeScript
- **State management:** Zustand
- **Rendering:** Canvas API for sprite/game rendering, React for UI chrome
- **Build tool:** Vite
- **Skill:** `pixel-art-game-builder` (installed via `npx skills add cooksaw/claude-skills@pixel-art-game-builder`)
- **Platform:** Browser-based (no backend, runs locally or can be hosted as static site)

---

## Project Structure (planned)

```
Soulstice/
├── NOTES.md              ← This file. Always keep updated.
├── src/
│   ├── game/
│   │   ├── characters/   ← Character definitions, stats, season affinity
│   │   ├── abilities/    ← Ability definitions, tier system
│   │   ├── combat/       ← Auto-battler logic, grid, AI
│   │   ├── run/          ← Roguelike run state, progression
│   │   └── ramdass/      ← Ram Dass encounter logic, quote pool
│   ├── rendering/        ← Canvas sprite rendering, animations
│   ├── store/            ← Zustand state stores
│   ├── ui/               ← React UI components (HUD, menus, etc.)
│   └── main.tsx
├── public/
│   └── assets/           ← Sprites, audio
├── package.json
└── vite.config.ts
```

---

## What's Been Built

- [ ] Nothing yet — project folder created, design locked, ready to scaffold

---

## What's Next

1. Scaffold Vite + React + TypeScript project
2. Set up Zustand stores for run state, character state, ability inventory
3. Build the Canvas rendering layer — basic grid, character sprites
4. Implement season affinity system
5. Build basic auto-battle loop (no UI yet, just logic)
6. Add ability fuse system
7. Build run/roguelike loop (encounter flow, rewards, progression)
8. Add Ram Dass encounter system
9. Polish: rain animation, ambient palette, sound

---

## Open Questions

- How many characters in the starting roster? (suggest 8–12 across the four seasons)
- Does the player start each run with 1 character or a small preset team?
- Is there a persistent meta-progression between runs (like Hades' darkness upgrades) or is it purely fresh each run?
- Multiplayer ever, or strictly single player?

---

## Conventions (for Codex handoff)

- All game logic lives in `src/game/` — no React dependencies in these files
- React is only for UI chrome — the game canvas is a single `<canvas>` element managed by the game loop
- Zustand stores are the bridge between game logic and React UI
- Sprites are generated procedurally via Canvas API (no external sprite sheets needed to start)
- Season affinity is a string union: `'spring' | 'summer' | 'autumn' | 'winter'`
- Ability tiers are numbers 1–3 (possibly 4 for rare cap)
- Ram Dass quotes live in `src/game/ramdass/quotes.ts` as a typed array — never hardcode them inline
