import { useEffect, useState } from 'react'
import type { RamDassQuote } from '../game/ramdass/quotes'
import type { Season } from '../game/characters/types'
import { BONDED_REACTIONS } from '../game/ramdass/triggerLogic'

interface RamDassOverlayProps {
  quote: RamDassQuote
  bondedSeason: Season
  onDismiss: () => void
}

export function RamDassOverlay({ quote, bondedSeason, onDismiss }: RamDassOverlayProps) {
  const [visible, setVisible] = useState(false)
  const [showReaction, setShowReaction] = useState(false)

  useEffect(() => {
    // Fade in
    const t1 = setTimeout(() => setVisible(true), 50)
    // Show bonded reaction after quote settles
    const t2 = setTimeout(() => setShowReaction(true), 1800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div style={{ ...styles.overlay, opacity: visible ? 1 : 0 }}>
      {/* Warm amber vignette */}
      <div style={styles.vignette} />

      <div style={styles.content}>
        {/* Ram Dass sprite area */}
        <div style={styles.spriteArea}>
          <div style={styles.aura} />
          <div style={styles.spriteLabel}>Ram Dass</div>
        </div>

        {/* Quote */}
        <blockquote style={styles.quote}>
          "{quote.text}"
        </blockquote>

        {/* Bonded character reaction */}
        {showReaction && (
          <p style={styles.reaction}>
            {BONDED_REACTIONS[bondedSeason] ?? BONDED_REACTIONS.spring}
          </p>
        )}

        {showReaction && (
          <button style={styles.dismissBtn} onClick={onDismiss}>
            continue
          </button>
        )}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(8, 10, 16, 0.88)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.8s ease',
    fontFamily: '"Courier New", monospace',
  },
  vignette: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse at center, rgba(196,137,58,0.07) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  content: {
    maxWidth: '460px',
    width: '100%',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    padding: '0 24px',
  },
  spriteArea: {
    position: 'relative',
    width: '64px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aura: {
    position: 'absolute',
    inset: '-12px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,215,0,0.18) 0%, transparent 70%)',
    animation: 'pulse 2.5s ease-in-out infinite',
  },
  spriteLabel: {
    fontSize: '11px',
    color: '#c4893a',
    letterSpacing: '0.1em',
    marginTop: '4px',
  },
  quote: {
    fontSize: '18px',
    color: '#e8d5b0',
    lineHeight: '1.6',
    margin: 0,
    fontStyle: 'italic',
    borderLeft: '2px solid #c4893a',
    paddingLeft: '16px',
    textAlign: 'left',
  },
  reaction: {
    fontSize: '13px',
    color: '#8a7a65',
    fontStyle: 'italic',
    margin: 0,
    lineHeight: '1.6',
  },
  dismissBtn: {
    background: 'transparent',
    border: '1px solid #2a2d3e',
    color: '#8a7a65',
    fontFamily: '"Courier New", monospace',
    fontSize: '12px',
    padding: '8px 24px',
    cursor: 'pointer',
    borderRadius: '2px',
    marginTop: '8px',
  },
}
