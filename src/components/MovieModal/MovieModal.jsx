import React, { useEffect, useCallback } from 'react'
import { useApp } from '../../context/AppContext'
import { posterPlaceholder, formatYear } from '../../utils/helpers'
import styles from './MovieModal.module.css'

export default function MovieModal({ item, onClose }) {
  const { addToWatchlist, addToHistory, watchlist } = useApp()
  const inWatchlist = watchlist.some((m) => m.id === item.id)

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const handleWatchlist = useCallback(() => {
    addToWatchlist(item)
  }, [addToWatchlist, item])

  const handleHistory = useCallback(() => {
    addToHistory(item)
    onClose()
  }, [addToHistory, item, onClose])

  const bg = item.poster
    ? `url(${item.poster}) center/cover no-repeat`
    : posterPlaceholder(item.title)

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={`Preview: ${item.title}`}
    >
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose} aria-label="Close preview">✕</button>

        {/* Hero image / trailer placeholder */}
        <div className={styles.hero} style={{ background: bg }}>
          <div className={styles.heroOverlay} />
          <div className={styles.heroContent}>
            <h2 className={styles.title}>{item.title}</h2>
            <div className={styles.heroActions}>
              <button className={styles.playBtn} onClick={handleHistory}>▶ Play</button>
              <button
                className={`${styles.actionBtn} ${inWatchlist ? styles.added : ''}`}
                onClick={handleWatchlist}
                aria-label={inWatchlist ? 'In watchlist' : 'Add to watchlist'}
              >
                {inWatchlist ? '✓ In Watchlist' : '+ Watchlist'}
              </button>
            </div>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.meta}>
            {item.year && <span className={styles.badge}>{formatYear(item.year)}</span>}
            {item.type && <span className={styles.badge}>{item.type}</span>}
            {item.rating && <span className={styles.badge}>⭐ {item.rating}</span>}
            {item.rank && <span className={styles.badge}>Rank #{item.rank}</span>}
          </div>

          {item.description && (
            <p className={styles.desc}>{item.description}</p>
          )}

          {item.actors && (
            <p className={styles.actors}>
              <span className={styles.label}>Cast: </span>{item.actors}
            </p>
          )}

          {item.imdbUrl && (
            <a
              href={item.imdbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.imdbLink}
            >
              View on IMDb ↗
            </a>
          )}

          {/* Trailer placeholder */}
          <div className={styles.trailerPlaceholder}>
            <span>🎬 Trailer preview not available in demo mode</span>
          </div>
        </div>
      </div>
    </div>
  )
}
