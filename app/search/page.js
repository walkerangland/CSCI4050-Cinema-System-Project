'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const GENRES = ['All', 'Action', 'Adventure', 'Drama', 'Fantasy', 'Sci-Fi']

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/movies')
      .then(r => r.json())
      .then(data => {
        setMovies(data.movies || [])
        setLoading(false)
      })
  }, [])

  const filtered = movies.filter(movie => {
    const matchesQuery = query === '' ||
      movie.title.toLowerCase().includes(query.toLowerCase()) ||
      movie.description.toLowerCase().includes(query.toLowerCase())
    const matchesGenre = genre === '' || movie.genre === genre
    return matchesQuery && matchesGenre
  })

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif', backgroundColor: '#0d0d0d', color: '#ffffff' }}>

      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Search Movies</h1>

      <input
        type="text"
        placeholder="Search by title or description..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: '100%', padding: '0.75rem 1rem', fontSize: '1rem', borderRadius: '8px', border: '1px solid #5a0000', backgroundColor: '#1c1c1c', color: '#ffffff', marginBottom: '1rem', boxSizing: 'border-box' }}
      />

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {GENRES.map((g) => (
          <button
            key={g}
            onClick={() => setGenre(g === 'All' ? '' : g)}
            style={{ padding: '0.4rem 1rem', borderRadius: '999px', border: '1px solid #f5c518', cursor: 'pointer', backgroundColor: (genre === g || (g === 'All' && genre === '')) ? '#c0392b' : '#1c1c1c', color: '#ffffff', fontWeight: '500', fontSize: '0.875rem' }}
          >
            {g}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: '#aaaaaa' }}>Loading movies...</p>
      ) : (
        <>
          <p style={{ color: '#aaaaaa', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {filtered.length} {filtered.length === 1 ? 'movie' : 'movies'} found
          </p>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#aaaaaa' }}>
              <p style={{ fontSize: '1.25rem' }}>No movies found</p>
              <p style={{ fontSize: '0.875rem' }}>Try a different search or genre</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filtered.map((movie) => (
                <div key={movie.id} style={{ display: 'flex', gap: '1rem', padding: '1rem', border: '1px solid #5a0000', borderRadius: '12px', backgroundColor: '#1c1c1c' }}>

                  <Link href={`/details/${movie.status === 'CURRENTLY_RUNNING' ? 'now-playing' : 'coming-soon'}/${movie.id}`}>
                    <img src={movie.posterUrl} alt={movie.title} style={{ width: '80px', height: '110px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
                  </Link>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0 }}>{movie.title}</h2>
                      <span style={{ fontSize: '0.75rem', padding: '0.1rem 0.5rem', backgroundColor: '#1a0000', borderRadius: '999px', color: '#f5c518' }}>{movie.rating}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.8rem', padding: '0.1rem 0.5rem', backgroundColor: '#1a0000', color: '#f5c518', borderRadius: '999px' }}>{movie.genre}</span>
                      <span style={{ fontSize: '0.8rem', padding: '0.1rem 0.5rem', backgroundColor: movie.status === 'CURRENTLY_RUNNING' ? '#dcfce7' : '#fef9c3', color: movie.status === 'CURRENTLY_RUNNING' ? '#16a34a' : '#ca8a04', borderRadius: '999px' }}>
                        {movie.status === 'CURRENTLY_RUNNING' ? 'Now Playing' : 'Coming Soon'}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.875rem', color: '#aaaaaa', margin: '0 0 0.75rem 0' }}>{movie.description}</p>

                    {/* Real showtimes from DB */}
                    {movie.status === 'CURRENTLY_RUNNING' && movie.showtimes && movie.showtimes.length > 0 && (
                      <div>
                        <p style={{ fontSize: '0.75rem', color: '#aaaaaa', marginBottom: '0.4rem' }}>Showtimes:</p>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {movie.showtimes.map((showtime) => (
                            <Link
                              key={showtime.id}
                              href={`/book?movie=${encodeURIComponent(movie.title)}&showtimeId=${showtime.id}&time=${encodeURIComponent(new Date(showtime.startTime).toLocaleString())}`}
                              style={{ padding: '0.3rem 0.75rem', backgroundColor: '#c0392b', color: 'white', borderRadius: '6px', fontSize: '0.8rem', textDecoration: 'none' }}
                            >
                              {new Date(showtime.startTime).toLocaleDateString()} {new Date(showtime.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {movie.status === 'CURRENTLY_RUNNING' && (!movie.showtimes || movie.showtimes.length === 0) && (
                      <p style={{ fontSize: '0.75rem', color: '#aaaaaa' }}>No showtimes available</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}