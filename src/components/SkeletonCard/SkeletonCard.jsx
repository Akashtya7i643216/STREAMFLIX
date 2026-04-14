import React from 'react'
import styles from './SkeletonCard.module.css'

export default function SkeletonCard() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.poster} />
      <div className={styles.line} />
      <div className={styles.lineShort} />
    </div>
  )
}
