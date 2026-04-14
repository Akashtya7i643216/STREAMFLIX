import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import MovieCard from '../../components/MovieCard/MovieCard'
import MovieModal from '../../components/MovieModal/MovieModal'
import styles from './Profile.module.css'

const TABS = ['Watchlist', 'Watch History']

export default function Profile() {
  const { user, watchlist, watchHistory, removeFromWatchlist, logout } = useApp()
  const [tab, setTab] = useState('Watchlist')
  const [selectedItem, setSelectedItem] = useState(null)
  const navigate = useNavigate()

  const handleLogout = useCallback(() => {
    logout()
    navigate('/signin')
  }, [logout, navigate])

  const items = tab === 'Watchlist' ? watchlist : watchHistory

  return (
    <main className={styles.main}>
      <div className={styles.profileHeader}>
        <div className={styles.avatar}>{user?.name?.[0]?.toUpperCase() || 'G'}</div>
        <div>
          <h1 className={styles.name}>{user?.name || 'Guest'}</h1>
          {user?.email && <p className={styles.email}>{user.email}</p>}
          {user?.isGuest && <span className={styles.guestBadge}>Guest Account</span>}
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>Sign Out</button>
      </div>

      <div className={styles.tabs} role="tablist">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            className={`${styles.tab} ${tab === t ? styles.activeTab : ''}`}
            onClick={() => setTab(t)}
          >
            {t}
            <span className={styles.badge}>{t === 'Watchlist' ? watchlist.length : watchHistory.length}</span>
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className={styles.empty}>
          <p>Nothing here yet.</p>
          <button className={styles.browseBtn} onClick={() => navigate('/')}>Browse titles</button>
        </div>
      ) : (
        <div className={styles.grid} role="list">
          {items.map((item) => (
            <div key={item.id} role="listitem" className={styles.cardWrap}>
              <MovieCard item={item} onClick={setSelectedItem} />
              {tab === 'Watchlist' && (
                <button
                  className={styles.removeBtn}
                  onClick={() => removeFromWatchlist(item.id)}
                  aria-label={`Remove ${item.title} from watchlist`}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedItem && <MovieModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </main>
  )
}
