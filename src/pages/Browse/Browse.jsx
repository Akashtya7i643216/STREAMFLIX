import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { getByCategory, normalizeItem } from '../../services/api'
import MovieCard from '../../components/MovieCard/MovieCard'
import SkeletonCard from '../../components/SkeletonCard/SkeletonCard'
import MovieModal from '../../components/MovieModal/MovieModal'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'
import styles from './Browse.module.css'

const CATEGORY_LABELS = {
  movies: 'Movies',
  tvshows: 'TV Shows',
  videogames: 'Video Games',
}

export default function Browse() {
  const { category } = useParams()
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [selectedItem, setSelectedItem] = useState(null)

  // Reset on category change
  useEffect(() => {
    setItems([])
    setPage(1)
    setHasMore(true)
  }, [category])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getByCategory(category, page)
      .then((data) => {
        if (cancelled) return
        const raw = Array.isArray(data?.description) ? data.description : []
        const normalized = raw.map(normalizeItem)
        setItems((prev) => page === 1 ? normalized : [...prev, ...normalized])
        setHasMore(normalized.length > 0)
      })
      .catch(() => { if (!cancelled) setHasMore(false) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [category, page])

  const loadMore = useCallback(() => {
    if (!loading && hasMore) setPage((p) => p + 1)
  }, [loading, hasMore])

  const sentinelRef = useInfiniteScroll(loadMore, hasMore)

  const handleCardClick = useCallback((item) => setSelectedItem(item), [])

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>{CATEGORY_LABELS[category] || 'Browse'}</h1>
        <p className={styles.count}>{items.length} titles loaded</p>
      </div>

      <div className={styles.grid} role="list" aria-label={`${CATEGORY_LABELS[category]} grid`}>
        {items.map((item) => (
          <div key={item.id} role="listitem">
            <MovieCard item={item} onClick={handleCardClick} />
          </div>
        ))}
        {loading && Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={`sk-${i}`} />)}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />

      {!hasMore && !loading && items.length > 0 && (
        <p className={styles.end}>You've reached the end</p>
      )}

      {selectedItem && <MovieModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </main>
  )
}
