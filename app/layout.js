import Link from 'next/link'
import styles from './home.module.css'
import { Newsreader } from 'next/font/google'

const newsreader = Newsreader({
  subsets: ['latin'],
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={newsreader.className}>
      <body>
        <header className={styles.siteHeader}>
          <div className={styles.brandRow}>
            <div className={styles.brandLogo}>
              <span className={styles.logoMark}>☽</span>
              <span className={styles.brandText}>moviePortal</span>
            </div>
            <div className={styles.navActions}>              
              <Link href="/search" className={styles.actionLink}>Search</Link>
              <Link href="/search" className={styles.actionLink}>Login</Link>
              <Link href="/book" className={styles.primaryButton}>Sign up free</Link>
            </div>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
