import { useState } from 'react'
import { PhaserGame, startBattleScene } from './rendering/PhaserGame'
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

type AppScreen = 'menu' | 'opening' | 'exploration' | 'battle' | 'ramdass'

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('menu')
  const [ramDassQuote, setRamDassQuote] = useState<RamDassQuote | null>(null)
  const [bondedSeason, setBondedSeason] = useState<Season>('spring')

  const runStore = useRunStore()
  const battleStore = useBattleStore()

  const handleMenuStart = () => setScreen('opening')

  const handleSeasonChosen = (season: Season) => {
    const run = beginRun(season)
    setBondedSeason(season)
    runStore.setRun(run)

    if (shouldRamDassAppear(run)) {
      const quote = selectQuote(run)
      if (quote) {
        setRamDassQuote(quote)
        runStore.markQuoteShown(quote.id)
        setScreen('ramdass')
        return
      }
    }

    kickOffBattle(run.team, 1)
    setScreen('battle')
    startBattleScene()
  }

  const kickOffBattle = (playerTeam: ReturnType<typeof beginRun>['team'], floor: number) => {
    const enemyTeam = generateEnemyTeam(floor)
    const battle = startBattle(initBattle(playerTeam, enemyTeam))
    battleStore.setBattle(battle)
  }

  const handleRamDassDismiss = () => {
    setScreen('battle')
    startBattleScene()
  }

  return (
    <div style={styles.root}>
      <div style={styles.gameWrapper}>
        <PhaserGame onMainMenuStart={handleMenuStart} />

        {screen === 'opening' && (
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
    width: '100vw',
    height: '100vh',
    background: '#0d1117',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    padding: 0,
  },
  gameWrapper: {
    position: 'relative',
    width: '800px',
    height: '560px',
  },
}
