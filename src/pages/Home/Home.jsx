import React, { useState, useEffect, useCallback, useMemo } from 'react'
import HeroBanner from '../../components/HeroBanner/HeroBanner'
import ContentRow from '../../components/ContentRow/ContentRow'
import MovieModal from '../../components/MovieModal/MovieModal'
import { searchTitles, getTrending, normalizeItem } from '../../services/api'
import styles from './Home.module.css'

const ROWS = [
  { id: 'trending', label: 'Trending Now', query: 'popular 2024' },
  { id: 'action', label: 'Action & Adventure', query: 'action adventure' },
  { id: 'drama', label: 'Top Dramas', query: 'drama series' },
  { id: 'comedy', label: 'Comedy', query: 'comedy film' },
  { id: 'scifi', label: 'Sci-Fi & Fantasy', query: 'science fiction fantasy' },
  { id: 'thriller', label: 'Thrillers', query: 'thriller suspense' },
]

function useRow(query) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    searchTitles(query, page)
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
  }, [query, page])

  const loadMore = useCallback(() => {
    if (!loading && hasMore) setPage((p) => p + 1)
  }, [loading, hasMore])

  return { items, loading, loadMore, hasMore }
}

export default function Home() {
  const [featured, setFeatured] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)

  // Fetch featured item
  useEffect(() => {
    let cancelled = false
    getTrending(1).then((data) => {
      if (cancelled) return
      const raw = Array.isArray(data?.description) ? data.description : []
      if (raw.length) setFeatured(normalizeItem(raw[0]))
    }).catch(() => {})
    return () => { cancelled = true }
  }, [])

  const handleCardClick = useCallback((item) => setSelectedItem(item), [])
  const handleClose = useCallback(() => setSelectedItem(null), [])

  return (
    <main className={styles.main}>
      <HeroBanner
        item={featured}
        onPlay={handleCardClick}
        onMoreInfo={handleCardClick}
      />

      <div className={styles.rows}>
        {ROWS.map((row) => (
          <RowSection key={row.id} row={row} onCardClick={handleCardClick} />
        ))}
      </div>

      {selectedItem && <MovieModal item={selectedItem} onClose={handleClose} />}
    </main>
  )
}

// Separate component so each row manages its own state independently
function RowSection({ row, onCardClick }) {
  const { items, loading } = useRow(row.query)
  return (
    <ContentRow
      title={row.label}
      items={items}
      loading={loading}
      onCardClick={onCardClick}
    />
  )
}
