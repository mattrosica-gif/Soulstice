import { useState } from 'react'
import type { Season } from '../game/characters/types'
import { getOpeningTirade } from '../game/run/openingSequence'

interface OpeningDialogProps {
  onSeasonChosen: (season: Season) => void
}

const SEASONS: { id: Season; label: string; color: string }[] = [
  { id: 'spring', label: 'Spring', color: '#7ec87e' },
  { id: 'summer', label: 'Summer', color: '#e87e3e' },
  { id: 'autumn', label: 'Autumn', color: '#c47a3a' },
  { id: 'winter', label: 'Winter', color: '#7ab4d4' },
]

type Step = 'tirade' | 'pick'

export function OpeningDialog({ onSeasonChosen }: OpeningDialogProps) {
  const [tirade] = useState(() => getOpeningTirade())
  const [step, setStep] = useState<Step>('tirade')
  const [hovered, setHovered] = useState<Season | null>(null)

  return (
    <div style={styles.overlay}>
      <div style={styles.box}>
        {/* NPC label */}
        <div style={styles.npcLabel}>
          {step === 'tirade' ? '— A stranger in the rain —' : '— He looks at you —'}
        </div>

        {step === 'tirade' && (
          <>
            <p style={styles.tirade}>{tirade}</p>
            <button style={styles.continueBtn} onClick={() => setStep('pick')}>
              continue
            </button>
          </>
        )}

        {step === 'pick' && (
          <>
            <p style={styles.question}>What season do you like?</p>
            <div style={styles.seasonRow}>
              {SEASONS.map((s) => (
                <button
                  key={s.id}
                  style={{
                    ...styles.seasonBtn,
                    borderColor: hovered === s.id ? s.color : '#2a2d3e',
                    color: hovered === s.id ? s.color : '#8a7a65',
                    boxShadow: hovered === s.id ? `0 0 12px ${s.color}44` : 'none',
                  }}
                  onMouseEnter={() => setHovered(s.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => onSeasonChosen(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingBottom: '32px',
    pointerEvents: 'none',
  },
  box: {
    pointerEvents: 'all',
    background: 'rgba(12, 14, 22, 0.92)',
    border: '1px solid #2a2d3e',
    borderRadius: '4px',
    padding: '20px 28px',
    maxWidth: '580px',
    width: '100%',
    fontFamily: '"Courier New", monospace',
  },
  npcLabel: {
    fontSize: '11px',
    color: '#4a5568',
    marginBottom: '10px',
    letterSpacing: '0.05em',
  },
  tirade: {
    fontSize: '14px',
    color: '#e8d5b0',
    lineHeight: '1.7',
    margin: '0 0 16px 0',
  },
  question: {
    fontSize: '16px',
    color: '#e8d5b0',
    margin: '0 0 16px 0',
  },
  continueBtn: {
    background: 'transparent',
    border: '1px solid #2a2d3e',
    color: '#8a7a65',
    fontFamily: '"Courier New", monospace',
    fontSize: '12px',
    padding: '6px 16px',
    cursor: 'pointer',
    borderRadius: '2px',
  },
  seasonRow: {
    display: 'flex',
    gap: '12px',
  },
  seasonBtn: {
    flex: 1,
    background: 'transparent',
    border: '1px solid',
    fontFamily: '"Courier New", monospace',
    fontSize: '14px',
    padding: '10px 0',
    cursor: 'pointer',
    borderRadius: '2px',
    transition: 'all 0.15s ease',
  },
}
