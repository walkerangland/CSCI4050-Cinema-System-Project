'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ManageMoviesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    title: '',
    genre: '',
    rating: '',
    description: '',
    posterUrl: '',
    trailerUrl: '',
    status: 'CURRENTLY_RUNNING',
    director: '',
    producer: '',
    cast: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/admin/movies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.message)
      return
    }

    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
      setForm({ title: '', genre: '', rating: '', description: '', posterUrl: '', trailerUrl: '', status: 'CURRENTLY_RUNNING', director: '', producer: '', cast: '' })
    }, 2000)
  }

  const inputStyle = { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #5a0000', backgroundColor: '#0d0d0d', color: '#ffffff', fontSize: '1rem', boxSizing: 'border-box' }
  const labelStyle = { display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#aaaaaa' }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0d0d0d', color: '#ffffff', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: '#1c1c1c', borderBottom: '1px solid #5a0000', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: '#c0392b', fontSize: '1.5rem', fontWeight: 'bold' }}>Add Movie</h1>
        <Link href="/admin" style={{ color: '#f5c518', textDecoration: 'none' }}>← Back to Admin</Link>
      </div>

      <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', backgroundColor: '#1c1c1c', borderRadius: '12px', border: '1px solid #5a0000' }}>

        {success && (
          <div style={{ backgroundColor: '#052e16', border: '1px solid #22c55e', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem', color: '#22c55e' }}>
            ✓ Movie added successfully!
          </div>
        )}

        {error && (
          <div style={{ backgroundColor: '#3b0000', border: '1px solid #ef4444', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem', color: '#fca5a5' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Title <span style={{ color: '#ef4444' }}>*</span></label>
            <input name="title" required value={form.title} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Genre <span style={{ color: '#ef4444' }}>*</span></label>
            <select name="genre" required value={form.genre} onChange={handleChange} style={inputStyle}>
              <option value="">Select genre</option>
              <option value="Action">Action</option>
              <option value="Comedy">Comedy</option>
              <option value="Drama">Drama</option>
              <option value="Horror">Horror</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Thriller">Thriller</option>
              <option value="Animation">Animation</option>
              <option value="Romance">Romance</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Rating <span style={{ color: '#ef4444' }}>*</span></label>
            <select name="rating" required value={form.rating} onChange={handleChange} style={inputStyle}>
              <option value="">Select rating</option>
              <option value="G">G</option>
              <option value="PG">PG</option>
              <option value="PG-13">PG-13</option>
              <option value="R">R</option>
              <option value="NR">NR</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Status <span style={{ color: '#ef4444' }}>*</span></label>
            <select name="status" required value={form.status} onChange={handleChange} style={inputStyle}>
              <option value="CURRENTLY_RUNNING">Currently Running</option>
              <option value="COMING_SOON">Coming Soon</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Description <span style={{ color: '#ef4444' }}>*</span></label>
            <textarea name="description" required value={form.description} onChange={handleChange} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Poster URL <span style={{ color: '#ef4444' }}>*</span></label>
            <input name="posterUrl" required value={form.posterUrl} onChange={handleChange} style={inputStyle} placeholder="https://..." />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Trailer URL <span style={{ color: '#ef4444' }}>*</span></label>
            <input name="trailerUrl" required value={form.trailerUrl} onChange={handleChange} style={inputStyle} placeholder="https://youtube.com/..." />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Director</label>
            <input name="director" value={form.director} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Producer</label>
            <input name="producer" value={form.producer} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>Cast (comma separated)</label>
            <input name="cast" value={form.cast} onChange={handleChange} style={inputStyle} placeholder="Actor 1, Actor 2, Actor 3" />
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#c0392b', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Adding Movie...' : 'Add Movie'}
          </button>
        </form>
      </div>
    </div>
  )
}