'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const cards = [
  { key: 'totalBookings', label: 'Total Bookings', accent: '#c0392b' },
  { key: 'totalSales', label: 'Total Sales', accent: '#7ed957' },
  { key: 'currentlyRunningMovies', label: 'Running Movies', accent: '#f5c542' },
  { key: 'registeredUsers', label: 'Registered Users', accent: '#4aa3ff' }
]

export default function AdminStatsPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch('/api/admin/stats')
        const data = await response.json()
        if (!response.ok) {
          setError(data.message || 'Failed to load statistics.')
          setLoading(false)
          return
        }
        setStats(data)
      } catch (err) {
        setError('Failed to load statistics.')
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0d0d0d', color: '#ffffff', fontFamily: 'sans-serif', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: '#c0392b', marginBottom: '0.25rem' }}>Admin Statistics</h1>
          <p style={{ color: '#aaaaaa' }}>Live booking, sales, and movie statistics for administrators.</p>
        </div>
        <Link href="/admin" style={{ color: '#c0392b', textDecoration: 'none', fontWeight: 'bold' }}>← Back to dashboard</Link>
      </div>

      {loading && <p style={{ color: '#aaaaaa' }}>Loading statistics...</p>}
      {error && <p style={{ color: '#f5c542' }}>{error}</p>}

      {!loading && stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
          {cards.map((card) => (
            <div key={card.key} style={{ backgroundColor: '#1c1c1c', border: '1px solid #5a0000', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ color: card.accent, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.75rem' }}>{card.label}</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {card.key === 'totalSales' ? `$${stats.totalSales.toFixed(2)}` : stats[card.key]}
              </div>
            </div>
          ))}

          <div style={{ gridColumn: '1 / -1', backgroundColor: '#1c1c1c', border: '1px solid #5a0000', borderRadius: '12px', padding: '1.25rem' }}>
            <h2 style={{ marginBottom: '0.75rem', color: '#ffffff' }}>Booking summary</h2>
            <div style={{ color: '#aaaaaa', lineHeight: 1.7 }}>
              <div>Pending bookings: {stats.pendingBookings}</div>
              <div>Cancelled bookings: {stats.cancelledBookings}</div>
              <div>Active users: {stats.activeUsers}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
