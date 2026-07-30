'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const emptyForm = {
  title: '',
  genre: '',
  rating: 'PG-13',
  description: '',
  posterUrl: '',
  trailerUrl: '',
  status: 'CURRENTLY_RUNNING',
  director: '',
  producer: '',
  cast: ''
}

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const loadMovies = async () => {
    setLoading(true)
    const response = await fetch('/api/admin/movies')
    const data = await response.json()
    setMovies(data.movies || [])
    setLoading(false)
  }

  useEffect(() => {
    loadMovies()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')

    const payload = {
      ...form,
      ...(editingId ? { id: editingId } : {})
    }

    const response = await fetch('/api/admin/movies', {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const data = await response.json()
    setMessage(data.message || 'Action completed')

    if (response.ok) {
      setForm(emptyForm)
      setEditingId(null)
      await loadMovies()
    }
  }

  const handleEdit = (movie) => {
    setEditingId(movie.id)
    setForm({
      title: movie.title,
      genre: movie.genre,
      rating: movie.rating,
      description: movie.description,
      posterUrl: movie.posterUrl,
      trailerUrl: movie.trailerUrl,
      status: movie.status,
      director: movie.director || '',
      producer: movie.producer || '',
      cast: movie.cast || ''
    })
  }

  const handleDelete = async (movie) => {
    const confirmed = window.confirm(`Delete ${movie.title}?`)
    if (!confirmed) return

    const response = await fetch('/api/admin/movies', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: movie.id })
    })

    const data = await response.json()
    setMessage(data.message || 'Movie deleted')
    await loadMovies()
  }

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
    <div style={{ minHeight: '100vh', backgroundColor: '#0d0d0d', color: '#ffffff', fontFamily: 'sans-serif', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: '#c0392b', marginBottom: '0.25rem' }}>Manage Movies</h1>
          <p style={{ color: '#aaaaaa' }}>Add new releases, update details, or remove movies from the system.</p>
        </div>
        <Link href="/admin" style={{ color: '#c0392b', textDecoration: 'none', fontWeight: 'bold' }}>&larr; Back to dashboard</Link>
      </div>

      {message ? <div style={{ marginBottom: '1rem', color: '#f5c542' }}>{message}</div> : null}

      <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'minmax(280px, 400px) 1fr', alignItems: 'start' }}>
        
        {/* Left Column: Form */}
        <form onSubmit={handleSubmit} style={{ backgroundColor: '#1c1c1c', border: '1px solid #5a0000', borderRadius: '12px', padding: '1.5rem' }}>
          <h2 style={{ marginBottom: '1rem', color: '#ffffff' }}>{editingId ? 'Edit Movie' : 'Add New Movie'}</h2>

          <label style={labelStyle}>Title</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={inputStyle} required />

          <label style={labelStyle}>Genre</label>
          <input value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} style={inputStyle} required />

          <label style={labelStyle}>Rating</label>
          <select value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} style={inputStyle} required>
            <option value="G">G</option>
            <option value="PG">PG</option>
            <option value="PG-13">PG-13</option>
            <option value="R">R</option>
          </select>

          <label style={labelStyle}>Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} required />

          <label style={labelStyle}>Poster URL</label>
          <input value={form.posterUrl} onChange={(e) => setForm({ ...form, posterUrl: e.target.value })} style={inputStyle} required />

          <label style={labelStyle}>Trailer URL</label>
          <input value={form.trailerUrl} onChange={(e) => setForm({ ...form, trailerUrl: e.target.value })} style={inputStyle} required />

          <label style={labelStyle}>Director</label>
          <input value={form.director} onChange={(e) => setForm({ ...form, director: e.target.value })} style={inputStyle} />

          <label style={labelStyle}>Producer</label>
          <input value={form.producer} onChange={(e) => setForm({ ...form, producer: e.target.value })} style={inputStyle} />

          <label style={labelStyle}>Cast (comma separated)</label>
          <input value={form.cast} onChange={(e) => setForm({ ...form, cast: e.target.value })} style={inputStyle} />

          <label style={labelStyle}>Status</label>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={inputStyle}>
            <option value="CURRENTLY_RUNNING">Now Playing</option>
            <option value="COMING_SOON">Coming Soon</option>
          </select>

          <button type="submit" style={{ marginTop: '1rem', width: '100%', backgroundColor: '#c0392b', color: '#fff', border: 'none', padding: '0.7rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            {editingId ? 'Update Movie' : 'Add Movie'}
          </button>
          
          {editingId && (
            <button type="button" onClick={() => { setForm(emptyForm); setEditingId(null); setMessage(''); }} style={{ marginTop: '0.5rem', width: '100%', backgroundColor: 'transparent', color: '#aaaaaa', border: '1px solid #444', padding: '0.7rem', borderRadius: '8px', cursor: 'pointer' }}>
              Cancel Edit
            </button>
          )}
        </form>

        {/* Right Column: Movie List */}
        <div style={{ backgroundColor: '#1c1c1c', border: '1px solid #5a0000', borderRadius: '12px', padding: '1.5rem' }}>
          <h2 style={{ marginBottom: '1rem', color: '#ffffff' }}>Movie Database</h2>
          
          {loading ? <p style={{ color: '#aaaaaa' }}>Loading movies...</p> : null}
          {!loading && movies.length === 0 ? <p style={{ color: '#aaaaaa' }}>No movies found.</p> : null}
          
          {/* Added maxHeight and overflowY for scrolling */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '760px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {movies.map((movie) => (
              <div key={movie.id} style={{ border: '1px solid #333', borderRadius: '10px', padding: '0.9rem', backgroundColor: '#141414', display: 'flex', gap: '1rem' }}>
                <img src={movie.posterUrl} alt={movie.title} style={{ width: '60px', height: '90px', objectFit: 'cover', borderRadius: '6px' }} />
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <strong>{movie.title} ({movie.rating})</strong>
                    <span style={{ color: movie.status === 'COMING_SOON' ? '#f5c542' : '#7ed957', fontSize: '0.75rem', padding: '0.2rem 0.5rem', backgroundColor: '#111', borderRadius: '4px' }}>
                      {movie.status === 'COMING_SOON' ? 'Coming Soon' : 'Now Playing'}
                    </span>
                  </div>
                  <div style={{ color: '#aaaaaa', fontSize: '0.85rem', marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {movie.description}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleEdit(movie)} style={secondaryButtonStyle}>Edit</button>
                    <button onClick={() => handleDelete(movie)} style={{ ...secondaryButtonStyle, borderColor: '#c0392b', color: '#ffb8b8' }}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

const labelStyle = {
  display: 'block',
  marginBottom: '0.3rem',
  color: '#cccccc',
  fontSize: '0.875rem'
}

const inputStyle = {
  width: '100%',
  padding: '0.7rem',
  marginBottom: '0.8rem',
  borderRadius: '8px',
  border: '1px solid #444',
  backgroundColor: '#111',
  color: '#fff',
  boxSizing: 'border-box'
}

const secondaryButtonStyle = {
  backgroundColor: 'transparent',
  border: '1px solid #c0392b',
  color: '#ffffff',
  padding: '0.35rem 0.75rem',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.8rem'
}