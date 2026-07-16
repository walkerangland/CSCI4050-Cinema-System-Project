'use client'
import Link from 'next/link'
import styles from './home.module.css'
import { Newsreader } from 'next/font/google'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

const newsreader = Newsreader({
  subsets: ['latin'],
})

export default function RootLayout({ children }) {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await fetch('/api/user/profile', { method: 'GET' })
        setIsLoggedIn(res.ok)
      } catch (error) {
        setIsLoggedIn(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setIsLoggedIn(false)
    router.push('/login')
  }

  return (
    <html lang="en" className={newsreader.className}>
      <body className={styles.appRoot}>
        <header className={styles.header}>
          <Link href="/" className={styles.brand} style={{ textDecoration: 'none' }}>
            <div className={styles.logo}>Movie Portal</div>
          </Link>
          <nav className={styles.nav}>
            <Link href="/search" className={styles.navLink}>Search</Link>
            <Link href="/book" className={styles.navLink}>Book</Link>
            {!loading && !isLoggedIn && (
              <>
                <Link href="/login" className={styles.navLink} style={{ border: '2px solid #c0392b' }}>Login</Link>
                <Link href="/register" className={styles.navLink}>Register</Link>
              </>
            )}
            {!loading && isLoggedIn && (
              <button
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: '1px solid #c0392b',
                  color: '#f5c518',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '1rem'
                }}
              >
                Logout
              </button>
            )}
          </nav>
          {!loading && isLoggedIn && (
            <Link href="/profile" className={styles.profile}></Link>
          )}
        </header>

        <main className={styles.container}>{children}</main>

      </body>
    </html>
  )
}