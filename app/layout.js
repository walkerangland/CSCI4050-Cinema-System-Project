import Link from 'next/link'
import styles from './home.module.css'
import { Newsreader } from 'next/font/google'

const newsreader = Newsreader({
  subsets: ['latin'],
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className = {newsreader.className} style={{ backgroundColor: '#0d0d0d'}}>
      <body>
        <nav>
        <h1 style={{fontSize: '20px', textDecoration:'underline'}}>CES</h1>
          <Link href="/" className={styles.topbar}>Home</Link>
          <Link href="/search" className={styles.topbar}>Search</Link>
          <Link href="/book" className={styles.topbar}>Book</Link>
        <main>{children}</main>
        </nav>
      </body>
    </html>
  )
}

function TopBar() {
  return(
    <div>
      something
    </div>
  )
}