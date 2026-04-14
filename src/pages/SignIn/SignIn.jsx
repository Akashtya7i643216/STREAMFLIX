import React, { useState, useCallback } from 'react'
import { useApp } from '../../context/AppContext'
import styles from './SignIn.module.css'

export default function SignIn() {
  const { login } = useApp()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email'
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    return e
  }

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      const errs = validate()
      if (Object.keys(errs).length) { setErrors(errs); return }
      setLoading(true)
      // Simulate async auth (Stage 1 — UI only)
      await new Promise((r) => setTimeout(r, 800))
      login({ name: form.email.split('@')[0], email: form.email, isGuest: false })
    },
    [form, login]
  )

  const handleGuest = useCallback(() => {
    login({ name: 'Guest', email: '', isGuest: true })
  }, [login])

  return (
    <div className={styles.page}>
      <div className={styles.bg} aria-hidden="true" />
      <div className={styles.card}>
        <h1 className={styles.logo}>STREAM<span>FLIX</span></h1>
        <h2 className={styles.heading}>Sign In</h2>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="you@example.com"
              autoComplete="email"
              aria-describedby={errors.email ? 'email-err' : undefined}
            />
            {errors.email && <span id="email-err" className={styles.error} role="alert">{errors.email}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              autoComplete="current-password"
              aria-describedby={errors.password ? 'pw-err' : undefined}
            />
            {errors.password && <span id="pw-err" className={styles.error} role="alert">{errors.password}</span>}
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? <span className={styles.spinner} /> : 'Sign In'}
          </button>
        </form>

        <div className={styles.divider}><span>or</span></div>

        <button className={styles.guestBtn} onClick={handleGuest}>
          Continue as Guest
        </button>

        <p className={styles.note}>
          Stage 2 will integrate Firebase Authentication for real sign-up/sign-in flows.
        </p>
      </div>
    </div>
  )
}
