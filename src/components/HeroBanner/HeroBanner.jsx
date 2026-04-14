import React, { memo } from 'react'
import { posterPlaceholder, truncate } from '../../utils/helpers'
import styles from './HeroBanner.module.css'

const HeroBanner = memo(function HeroBanner({ item, onPlay, onMoreInfo }) {
  if (!item) return <div className={styles.skeleton} aria-hidden="true" />

  const bg = item.poster
    ? `url(${item.poster}) center/cover no-repeat`
    : posterPlaceholder(item.title)

  return (
    <section
      className={styles.banner}
      style={{ background: bg }}
      aria-label={`Featured: ${item.title}`}
    >
      <div className={styles.overlay} />
      <div className={styles.content}>
        <p className={styles.label}>Today's Top Show</p>
        <h1 className={styles.title}>{item.title}</h1>
        {item.year && <p className={styles.year}>{item.year}</p>}
        {item.description && (
          <p className={styles.desc}>{truncate(item.description, 150)}</p>
        )}
        <div className={styles.actions}>
          <button className={styles.playBtn} onClick={() => onPlay(item)}>
            ▶ Play
          </button>
          <button className={styles.infoBtn} onClick={() => onMoreInfo(item)}>
            ⓘ More Info
          </button>
        </div>
      </div>
    </section>
  )
})

export default HeroBanner
