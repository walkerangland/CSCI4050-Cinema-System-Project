'use client'
import { useState } from 'react'
import { FilterAndSearch } from '../../lib/movies'
import Link from 'next/link'

const GENRES = ['All', 'Action', 'Adventure', 'Drama', 'Fantasy', 'Sci-Fi']

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState('')

  const movies = FilterAndSearch(genre, query)

   return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>

        {/* Title */}
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Search Movies</h1>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by title or description..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            marginBottom: '1rem',
            boxSizing: 'border-box',
          }}
        />

        {/* Genre Filter */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setGenre(g === 'All' ? '' : g)}
              style={{
                padding: '0.4rem 1rem',
                borderRadius: '999px',
                border: '1px solid #d1d5db',
                cursor: 'pointer',
                backgroundColor: (genre === g || (g === 'All' && genre === '')) ? '#1a1a2e' : 'white',
                color: (genre === g || (g === 'All' && genre === '')) ? 'white' : '#1a1a2e',
                fontWeight: '500',
                fontSize: '0.875rem',
              }}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p style={{ color: '#6b7280', marginBottom: '1rem', fontSize: '0.875rem' }}>
          {movies.length} {movies.length === 1 ? 'movie' : 'movies'} found
        </p>

        {/* Results */}
        {movies.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
            <p style={{ fontSize: '1.25rem' }}> No movies found</p>
            <p style={{ fontSize: '0.875rem' }}>Try a different search or genre</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {movies.map((movie) => (
              <div
                key={movie.id}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  backgroundColor: 'white',
                }}
              >
                {/* Poster */}
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  style={{ width: '80px', height: '110px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                />

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0 }}>{movie.title}</h2>
                    <span style={{ fontSize: '0.75rem', padding: '0.1rem 0.5rem', backgroundColor: '#f3f4f6', borderRadius: '999px', color: '#6b7280' }}>{movie.rating}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', padding: '0.1rem 0.5rem', backgroundColor: '#ede9fe', color: '#7c3aed', borderRadius: '999px' }}>{movie.genre}</span>
                    <span style={{ fontSize: '0.8rem', padding: '0.1rem 0.5rem', backgroundColor: movie.status === 'now-playing' ? '#dcfce7' : '#fef9c3', color: movie.status === 'now-playing' ? '#16a34a' : '#ca8a04', borderRadius: '999px' }}>
                      {movie.status === 'now-playing' ? ' Now Playing' : ' Coming Soon'}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.75rem 0' }}>{movie.description}</p>

                  {/* Showtimes */}
                  {movie.status === 'now-playing' && (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {['2:00 PM', '5:00 PM', '8:00 PM'].map((time) => (
                        <Link
                          key={time}
                          href={`/book?movie=${encodeURIComponent(movie.title)}&time=${encodeURIComponent(time)}`}
                          style={{
                            padding: '0.3rem 0.75rem',
                            backgroundColor: '#1a1a2e',
                            color: 'white',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            textDecoration: 'none',
                          }}
                        >
                          {time}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }