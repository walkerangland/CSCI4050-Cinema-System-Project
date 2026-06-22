import Link from 'next/link'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <Link href="/">Home</Link>
    <Link href="/search">Search</Link>
    <body>{children}</body>
    </html>
  )
}

