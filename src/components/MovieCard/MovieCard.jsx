import React, { useState, memo } from 'react'
import { posterPlaceholder, truncate, formatYear } from '../../utils/helpers'
import styles from './MovieCard.module.css'

const MovieCard = memo(function MovieCard({ item, onClick }) {
  const [imgError, setImgError] = useState(false)
  const bg = posterPlaceholder(item.title)

  return (
    <article
      className={styles.card}
      onClick={() => onClick(item)}
      onKeyDown={(e) => e.key === 'Enter' && onClick(item)}
      tabIndex={0}
      role="button"
      aria-label={`${item.title} (${formatYear(item.year)})`}
    >
      <div className={styles.poster} style={{ background: imgError || !item.poster ? bg : undefined }}>
        {item.poster && !imgError ? (
          <img
            src={item.poster}
            alt={item.title}
            loading="lazy"
            onError={() => setImgError(true)}
            className={styles.img}
          />
        ) : (
          <div className={styles.fallback} aria-hidden="true">
            <span>{item.title?.[0] || '?'}</span>
          </div>
        )}
        <div className={styles.overlay}>
          <span className={styles.playBtn} aria-hidden="true">▶</span>
          {item.rating && <span className={styles.rating}>⭐ {item.rating}</span>}
        </div>
      </div>
      <div className={styles.meta}>
        <p className={styles.title}>{truncate(item.title, 30)}</p>
        <p className={styles.year}>{formatYear(item.year)}</p>
      </div>
    </article>
  )
})

export default MovieCard
