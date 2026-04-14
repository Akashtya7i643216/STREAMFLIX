import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import SearchBar from '../SearchBar/SearchBar'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'TV Shows', path: '/browse/tvshows' },
  { label: 'Movies', path: '/browse/movies' },
  { label: 'Video Games', path: '/browse/videogames' },
]

export default function Navbar() {
  const { user, toggleTheme, theme, logout } = useApp()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = useCallback(() => {
    logout()
    navigate('/signin')
  }, [logout, navigate])

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`} role="navigation" aria-label="Main navigation">
      <div className={styles.left}>
        <Link to="/" className={styles.logo} aria-label="StreamFlix Home">
          <span>STREAM</span><span className={styles.logoAccent}>FLIX</span>
        </Link>
        <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`} role="list">
          {NAV_LINKS.map((l) => (
            <li key={l.path}>
              <Link
                to={l.path}
                className={`${styles.link} ${location.pathname === l.path ? styles.active : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.right}>
        <SearchBar />
        <button
          className={styles.iconBtn}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title="Toggle theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <Link to="/profile" className={styles.avatar} aria-label="Profile">
          <span>{user?.name?.[0]?.toUpperCase() || 'G'}</span>
        </Link>
        <button className={styles.logoutBtn} onClick={handleLogout} aria-label="Sign out">
          Sign Out
        </button>
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          ☰
        </button>
      </div>
    </nav>
  )
}
