import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDebounce } from '../../hooks/useDebounce'
import { searchTitles, normalizeItem } from '../../services/api'
import styles from './SearchBar.module.css'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedModal, setSelectedModal] = useState(null)
  const debouncedQuery = useDebounce(query, 400)
  const containerRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!debouncedQuery.trim()) { setResults([]); setOpen(false); return }
    let cancelled = false
    setLoading(true)
    searchTitles(debouncedQuery)
      .then((data) => {
        if (cancelled) return
        const items = Array.isArray(data?.description) ? data.description.map(normalizeItem) : []
        setResults(items.slice(0, 8))
        setOpen(true)
      })
      .catch(() => { if (!cancelled) setResults([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [debouncedQuery])

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (!containerRef.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = useCallback((item) => {
    setOpen(false)
    setQuery('')
    setSelectedModal(item)
  }, [])

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') { setOpen(false); setQuery('') }
  }

  return (
    <>
      <div className={styles.container} ref={containerRef}>
        <div className={styles.inputWrap}>
          <span className={styles.icon} aria-hidden="true">🔍</span>
          <input
            className={styles.input}
            type="search"
            placeholder="Search titles, years, IDs…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Search"
            aria-autocomplete="list"
            aria-expanded={open}
          />
          {loading && <span className={styles.spinner} aria-hidden="true" />}
        </div>

        {open && results.length > 0 && (
          <ul className={styles.dropdown} role="listbox" aria-label="Search suggestions">
            {results.map((item) => (
              <li
                key={item.id}
                className={styles.item}
                role="option"
                tabIndex={0}
                onClick={() => handleSelect(item)}
                onKeyDown={(e) => e.key === 'Enter' && handleSelect(item)}
              >
                {item.poster
                  ? <img src={item.poster} alt="" className={styles.thumb} loading="lazy" />
                  : <div className={styles.thumbPlaceholder} aria-hidden="true" />
                }
                <div className={styles.info}>
                  <span className={styles.title}>{item.title}</span>
                  <span className={styles.meta}>{item.year} · {item.type}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedModal && (
        <MovieModal item={selectedModal} onClose={() => setSelectedModal(null)} />
      )}
    </>
  )
}

// Inline modal import to avoid circular deps
import MovieModal from '../MovieModal/MovieModal'
