import Link from 'next/link'
import styles from './home.module.css'
import { Newsreader } from 'next/font/google'

const newsreader = Newsreader({
  subsets: ['latin'],
})

export default function RootLayout({ children }) {
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
          </nav>
          <div className={styles.profile}>​</div>
        </header>

        <main className={styles.container}>{children}</main>

      </body>
    </html>
  )
}