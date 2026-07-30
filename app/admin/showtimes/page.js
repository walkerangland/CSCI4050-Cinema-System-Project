'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const emptyForm = {
  movieId: '',
  hallId: '',
  startTime: ''
}

export default function AdminShowtimesPage() {
  const [showtimes, setShowtimes] = useState([])
  const [movies, setMovies] = useState([])
  const [halls, setHalls] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const loadShowtimes = async () => {
    setLoading(true)
    const response = await fetch('/api/admin/showtimes')
    const data = await response.json()

    setShowtimes(data.showtimes || [])
    setMovies(data.movies || [])
    setHalls(data.halls || [])
    setLoading(false)
  }

  useEffect(() => {
    loadShowtimes()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')

    const response = await fetch('/api/admin/showtimes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })

    const data = await response.json()
    setMessage(data.message || 'Action completed')

    if (response.ok) {
      setForm(emptyForm)
      await loadShowtimes()
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0d0d0d', color: '#ffffff', fontFamily: 'sans-serif', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: '#c0392b', marginBottom: '0.25rem' }}>Manage Showtimes</h1>
          <p style={{ color: '#aaaaaa' }}>Schedule movie showtimes for each hall.</p>
        </div>
        <Link href="/admin" style={{ color: '#c0392b', textDecoration: 'none', fontWeight: 'bold' }}>← Back to dashboard</Link>
      </div>

      {message ? <div style={{ marginBottom: '1rem', color: '#f5c542' }}>{message}</div> : null}

      <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'minmax(280px, 360px) 1fr' }}>
        <form onSubmit={handleSubmit} style={{ backgroundColor: '#1c1c1c', border: '1px solid #5a0000', borderRadius: '12px', padding: '1.5rem' }}>
          <h2 style={{ marginBottom: '1rem', color: '#ffffff' }}>Schedule a Showtime</h2>

          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cccccc' }}>Movie</label>
          <select value={form.movieId} onChange={(e) => setForm({ ...form, movieId: e.target.value })} style={inputStyle} required>
            <option value="">Select a movie</option>
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id}>{movie.title}</option>
            ))}
          </select>

          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cccccc' }}>Hall</label>
          <select value={form.hallId} onChange={(e) => setForm({ ...form, hallId: e.target.value })} style={inputStyle} required>
            <option value="">Select a hall</option>
            {halls.map((hall) => (
              <option key={hall.id} value={hall.id}>{hall.name} ({hall.capacity} seats)</option>
            ))}
          </select>

          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cccccc' }}>Start time</label>
          <input type="datetime-local" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} style={inputStyle} required />

          <button type="submit" style={{ marginTop: '1rem', width: '100%', backgroundColor: '#c0392b', color: '#fff', border: 'none', padding: '0.7rem', borderRadius: '8px', cursor: 'pointer' }}>
            Schedule showtime
          </button>
        </form>

        <div style={{ backgroundColor: '#1c1c1c', border: '1px solid #5a0000', borderRadius: '12px', padding: '1.5rem' }}>
          <h2 style={{ marginBottom: '1rem', color: '#ffffff' }}>Current Showtimes</h2>
          {loading ? <p style={{ color: '#aaaaaa' }}>Loading showtimes...</p> : null}
          {!loading && showtimes.length === 0 ? <p style={{ color: '#aaaaaa' }}>No showtimes scheduled yet.</p> : null}

          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {showtimes.map((showtime) => (
              <div key={showtime.id} style={{ border: '1px solid #333', borderRadius: '10px', padding: '0.9rem', backgroundColor: '#141414' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <strong>{showtime.movie?.title || 'Unknown movie'}</strong>
                  <span style={{ color: '#7ed957', fontSize: '0.85rem' }}>{showtime.hall?.name || 'Unknown hall'}</span>
                </div>
                <div style={{ color: '#aaaaaa', fontSize: '0.95rem' }}>
                  {new Date(showtime.startTime).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '0.7rem',
  marginBottom: '0.8rem',
  borderRadius: '8px',
  border: '1px solid #444',
  backgroundColor: '#111',
  color: '#fff'
}
