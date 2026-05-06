import { useState, useCallback } from 'react'
import { PhaserGame, startOverworldScene, startBattleScene, unblockOverworld } from './rendering/PhaserGame'
import { OpeningDialog } from './ui/OpeningDialog'
import { RamDassOverlay } from './ui/RamDassOverlay'
import { useRunStore } from './store/runStore'
import { useBattleStore } from './store/battleStore'
import { beginRun } from './game/run/openingSequence'
import { shouldRamDassAppear, selectQuote } from './game/ramdass/triggerLogic'
import { initBattle, startBattle } from './game/combat/battleEngine'
import { generateEnemyTeam } from './game/run/enemyFactory'
import type { Season } from './game/characters/types'
import type { RamDassQuote } from './game/ramdass/quotes'

type AppScreen = 'menu' | 'overworld' | 'npc_dialog' | 'battle' | 'ramdass'

export default function App() {
  const [screen, setScreen]         = useState<AppScreen>('menu')
  const [ramDassQuote, setQuote]    = useState<RamDassQuote | null>(null)
  const [bondedSeason, setSeason]   = useState<Season>('spring')

  const runStore    = useRunStore()
  const battleStore = useBattleStore()

  const handleMenuStart = useCallback(() => {
    setScreen('overworld')
    startOverworldScene()
  }, [])

  const handleStrangerTalk = useCallback(() => {
    setScreen('npc_dialog')
  }, [])

  const handleExitAttempt = useCallback(() => {
    setScreen('npc_dialog')
  }, [])

  const handleSeasonChosen = (season: Season) => {
    const run = beginRun(season)
    setSeason(season)
    runStore.setRun(run)
    unblockOverworld()

    if (shouldRamDassAppear(run)) {
      const quote = selectQuote(run)
      if (quote) {
        setQuote(quote)
        runStore.markQuoteShown(quote.id)
        setScreen('ramdass')
        return
      }
    }

    const enemyTeam = generateEnemyTeam(1)
    battleStore.setBattle(startBattle(initBattle(run.team, enemyTeam)))
    setScreen('battle')
    startBattleScene()
  }

  const handleRamDassDismiss = () => {
    const run = runStore.run
    if (!run) return
    const enemyTeam = generateEnemyTeam(1)
    battleStore.setBattle(startBattle(initBattle(run.team, enemyTeam)))
    setScreen('battle')
    startBattleScene()
  }

  return (
    <div style={styles.root}>
      <div style={styles.gameWrapper}>
        <PhaserGame
          onMainMenuStart={handleMenuStart}
          onStrangerTalk={handleStrangerTalk}
          onExitAttempt={handleExitAttempt}
        />

        {screen === 'npc_dialog' && (
          <OpeningDialog onSeasonChosen={handleSeasonChosen} />
        )}

        {screen === 'ramdass' && ramDassQuote && (
          <RamDassOverlay
            quote={ramDassQuote}
            bondedSeason={bondedSeason}
            onDismiss={handleRamDassDismiss}
          />
        )}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    width:           '100%',
    height:          '100%',
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'center',
    background:      '#0d1117',
    overflow:        'hidden',
  },
  gameWrapper: {
    position:  'relative',
    width:     '800px',
    height:    '560px',
    flexShrink: 0,
  },
}
