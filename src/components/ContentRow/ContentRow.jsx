import React, { useRef, memo } from 'react'
import MovieCard from '../MovieCard/MovieCard'
import SkeletonCard from '../SkeletonCard/SkeletonCard'
import styles from './ContentRow.module.css'

const ContentRow = memo(function ContentRow({ title, items, loading, onCardClick }) {
  const rowRef = useRef(null)

  const scroll = (dir) => {
    if (!rowRef.current) return
    rowRef.current.scrollBy({ left: dir * 600, behavior: 'smooth' })
  }

  return (
    <section className={styles.section} aria-label={title}>
      <h2 className={styles.heading}>{title}</h2>
      <div className={styles.wrapper}>
        <button className={`${styles.arrow} ${styles.left}`} onClick={() => scroll(-1)} aria-label="Scroll left">‹</button>
        <div className={styles.row} ref={rowRef} role="list">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : items.map((item) => (
                <div key={item.id} role="listitem">
                  <MovieCard item={item} onClick={onCardClick} />
                </div>
              ))
          }
        </div>
        <button className={`${styles.arrow} ${styles.right}`} onClick={() => scroll(1)} aria-label="Scroll right">›</button>
      </div>
    </section>
  )
})

export default ContentRow
