'use client'
import Link from 'next/link'
import styles from './home.module.css'
import { Newsreader } from 'next/font/google'
import { useRouter } from 'next/navigation'

const newsreader = Newsreader({
  subsets: ['latin'],
})

export default function RootLayout({ children }) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <html lang="en" className={newsreader.className}>
      <body className={styles.appRoot}>
        <header className={styles.header}>
          <div className={styles.brand}>
            <div className={styles.logo}>Movie Portal</div>
          </div>
          <nav className={styles.nav}>
            <Link href="/" className={styles.navLink}>Home</Link>
            <Link href="/search" className={styles.navLink}>Search</Link>
            <Link href="/book" className={styles.navLink}>Book</Link>
            <Link href="/login" className={styles.navLink}>Login</Link>
            <button
              onClick={handleLogout}
              style={{ background: 'none', border: '1px solid #c0392b', color: '#f5c518', padding: '0.25rem 0.75rem', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem' }}
            >
              Logout
            </button>
            <Link href="/register" className={styles.navLink}>Register</Link>
          </nav>
            <Link href = "/profile" className={styles.profile}></Link>
        </header>
        <main className={styles.container}>{children}</main>
      </body>
    </html>
  )
}
