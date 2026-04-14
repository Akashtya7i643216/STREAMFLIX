import React, { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import styles from './OnlineStatus.module.css'

export default function OnlineStatus() {
  const { isOnline } = useApp()
  const [visible, setVisible] = useState(false)
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true)
      setVisible(true)
    } else if (wasOffline) {
      setVisible(true)
      const t = setTimeout(() => setVisible(false), 3000)
      return () => clearTimeout(t)
    }
  }, [isOnline, wasOffline])

  if (!visible) return null

  return (
    <div
      className={`${styles.bar} ${isOnline ? styles.online : styles.offline}`}
      role="status"
      aria-live="polite"
    >
      {isOnline ? '✓ Back online — syncing data…' : '⚠ You are offline — showing cached content'}
    </div>
  )
}
