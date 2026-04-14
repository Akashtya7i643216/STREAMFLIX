import React from 'react'
import styles from './PageLoader.module.css'

export default function PageLoader() {
  return (
    <div className={styles.wrap} role="status" aria-label="Loading">
      <div className={styles.logo}>STREAM<span>FLIX</span></div>
      <div className={styles.spinner} />
    </div>
  )
}
