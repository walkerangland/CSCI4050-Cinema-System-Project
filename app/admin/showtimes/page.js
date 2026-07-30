'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ManageShowtimesPage() {
  const [movies, setMovies] = useState([])
  const [halls, setHalls] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    movieId: '',
    hallId: '',
    startTime: '',
  })

  useEffect(() => {
    fetch('/api/admin/movies').then(r => r.json()).then(d => setMovies(d.movies || []))
    fetch('/api/admin/halls').then(r => r.json()).then(d => setHalls(d.halls || []))
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/admin/showtimes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        movieId: parseInt(form.movieId),
        hallId: parseInt(form.hallId),
        startTime: new Date(form.startTime).toISOString(),
      }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.message)
      return
    }

    setSuccess(true)
    setForm({ movieId: '', hallId: '', startTime: '' })
    setTimeout(() => setSuccess(false), 3000)
  }

  const inputStyle = { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #5a0000', backgroundColor: '#0d0d0d', color: '#ffffff', fontSize: '1rem', boxSizing: 'border-box' }
  const labelStyle = { display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#aaaaaa' }

  const [userLoading, setUserLoading] = useState(true)
  const [userData, setUserData] = useState(null)
  useEffect(() => {
      try {
      const fetchProfile = async () => {
          const res = await fetch('/api/user/profile')
          if (res.ok) {
            const data = await res.json()
            setUserData(data)
          }
          setUserLoading(false)
      }
      fetchProfile()
      } 
      catch (err) {
        console.error(err)
      }

    }, [])

  if (userLoading) return <p>Loading...</p>
  if ( !userData || userData.role != 'ADMIN') return <p>Not authorized.</p>

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0d0d0d', color: '#ffffff', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: '#1c1c1c', borderBottom: '1px solid #5a0000', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: '#c0392b', fontSize: '1.5rem', fontWeight: 'bold' }}>Schedule Showtime</h1>
        <Link href="/admin" style={{ color: '#f5c518', textDecoration: 'none' }}>← Back to Admin</Link>
      </div>

      <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', backgroundColor: '#1c1c1c', borderRadius: '12px', border: '1px solid #5a0000' }}>

        {success && (
          <div style={{ backgroundColor: '#052e16', border: '1px solid #22c55e', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem', color: '#22c55e' }}>
            ✓ Showtime scheduled successfully!
          </div>
        )}

        {error && (
          <div style={{ backgroundColor: '#3b0000', border: '1px solid #ef4444', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem', color: '#fca5a5' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Movie <span style={{ color: '#ef4444' }}>*</span></label>
            <select name="movieId" required value={form.movieId} onChange={handleChange} style={inputStyle}>
              <option value="">Select a movie</option>
              {movies.map(m => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Showroom <span style={{ color: '#ef4444' }}>*</span></label>
            <select name="hallId" required value={form.hallId} onChange={handleChange} style={inputStyle}>
              <option value="">Select a showroom</option>
              {halls.map(h => (
                <option key={h.id} value={h.id}>{h.name} (Capacity: {h.capacity})</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>Date & Time <span style={{ color: '#ef4444' }}>*</span></label>
            <input type="datetime-local" name="startTime" required value={form.startTime} onChange={handleChange} style={inputStyle} />
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#c0392b', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Scheduling...' : 'Schedule Showtime'}
          </button>
        </form>
      </div>
    </div>
  )
}