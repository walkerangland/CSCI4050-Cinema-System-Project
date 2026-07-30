'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const TABLE_LABELS = {
  users: 'Users',
  addresses: 'Addresses',
  paymentCards: 'Payment Cards',
  movies: 'Movies',
  favoriteMovies: 'Favorite Movies',
  halls: 'Halls',
  seats: 'Seats',
  showtimes: 'Showtimes',
  ticketPrices: 'Ticket Prices',
  bookings: 'Bookings',
  tickets: 'Tickets',
  promotions: 'Promotions',
  fees: 'Fees'
}

function formatCellValue(value) {
  if (value === null || value === undefined) return <span style={{ color: '#555' }}>null</span>
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (value instanceof Date || (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value))) {
    return new Date(value).toLocaleString()
  }
  const str = String(value)
  if (str.length > 80) return str.slice(0, 80) + '…'
  return str
}

function TableView({ rows }) {
  if (!rows || rows.length === 0) {
    return <p style={{ color: '#aaaaaa', padding: '1rem' }}>No records found.</p>
  }

  const columns = Object.keys(rows[0])

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                style={{
                  backgroundColor: '#1a1a1a',
                  color: '#c0392b',
                  padding: '0.6rem 0.8rem',
                  textAlign: 'left',
                  borderBottom: '1px solid #5a0000',
                  whiteSpace: 'nowrap'
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              style={{ backgroundColor: rowIdx % 2 === 0 ? '#111111' : '#141414' }}
            >
              {columns.map((col) => (
                <td
                  key={col}
                  style={{
                    padding: '0.5rem 0.8rem',
                    color: '#cccccc',
                    borderBottom: '1px solid #222',
                    maxWidth: '300px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {formatCellValue(row[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function AdminDatabasePage() {
  const [dbData, setDbData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTable, setActiveTable] = useState('users')

  const [userLoading, setUserLoading] = useState(true)
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/user/profile')
        if (res.ok) {
          const data = await res.json()
          setUserData(data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setUserLoading(false)
      }
    }
    fetchProfile()
  }, [])

  useEffect(() => {
    const loadDatabase = async () => {
      try {
        const res = await fetch('/api/admin/database')
        const data = await res.json()
        if (!res.ok) {
          setError(data.message || 'Failed to load database.')
          return
        }
        setDbData(data)
      } catch (err) {
        setError('Failed to load database.')
      } finally {
        setLoading(false)
      }
    }
    loadDatabase()
  }, [])

  if (userLoading) return <p>Loading...</p>
  if (!userData || userData.role !== 'ADMIN') return <p>Not authorized.</p>

  const tableKeys = Object.keys(TABLE_LABELS)
  const activeRows = dbData ? (dbData[activeTable] || []) : []

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0d0d0d', color: '#ffffff', fontFamily: 'sans-serif', padding: '2rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: '#c0392b', marginBottom: '0.25rem' }}>Database Viewer</h1>
          <p style={{ color: '#aaaaaa' }}>Read-only view of all database tables.</p>
        </div>
        <Link href="/admin" style={{ color: '#c0392b', textDecoration: 'none', fontWeight: 'bold' }}>← Back to dashboard</Link>
      </div>

      {error && <p style={{ color: '#f5c542' }}>{error}</p>}
      {loading && <p style={{ color: '#aaaaaa' }}>Loading database…</p>}

      {!loading && dbData && (
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>

          {/* Sidebar: table list */}
          <div style={{ minWidth: '180px', backgroundColor: '#1c1c1c', border: '1px solid #5a0000', borderRadius: '12px', padding: '0.75rem', flexShrink: 0 }}>
            <p style={{ color: '#888', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>Tables</p>
            {tableKeys.map((key) => (
              <button
                key={key}
                onClick={() => setActiveTable(key)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.5rem 0.75rem',
                  marginBottom: '0.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: activeTable === key ? '#5a0000' : 'transparent',
                  color: activeTable === key ? '#ffffff' : '#cccccc',
                  fontSize: '0.875rem'
                }}
              >
                <span>{TABLE_LABELS[key]}</span>
                <span style={{ color: '#888', fontSize: '0.75rem', marginLeft: '0.5rem' }}>
                  {dbData[key] ? dbData[key].length : 0}
                </span>
              </button>
            ))}
          </div>

          {/* Main: table content */}
          <div style={{ flex: 1, backgroundColor: '#1c1c1c', border: '1px solid #5a0000', borderRadius: '12px', padding: '1.5rem', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ color: '#ffffff', margin: 0 }}>{TABLE_LABELS[activeTable]}</h2>
              <span style={{ color: '#888', fontSize: '0.85rem' }}>
                {activeRows.length} record{activeRows.length !== 1 ? 's' : ''}
              </span>
            </div>
            <TableView rows={activeRows} />
          </div>

        </div>
      )}
    </div>
  )
}
