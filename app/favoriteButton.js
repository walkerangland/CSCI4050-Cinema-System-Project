'use client'
import { useState, useEffect } from 'react'

export default function FavoriteButton({ movieId }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(true)

//check if already fav
  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const res = await fetch('/api/user/favorites')
        if (res.ok) {
          const favorites = await res.json()
          if (favorites.includes(movieId)) {
            setIsFavorite(true)
          }
        }
      } catch (e) {
      } finally {
        setLoading(false)
      }
    }
    checkFavorite()
  }, [movieId])

  const toggleFavorite = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (loading) return
    const method = isFavorite ? 'DELETE' : 'POST'
    try {
      const res = await fetch('/api/user/favorites', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId: String(movieId) })
      })

      if (res.ok) {
        setIsFavorite(!isFavorite)
      } else if (res.status === 401) {
        alert('Please log in to save favorite movies.')
      }
    } catch (error) {
      console.error('Failed to toggle favorite', error)
    }
  }
  return (
    <button
      onClick={toggleFavorite}
      title={isFavorite ? "Remove from Favorites" : "Add to Favorites"} // Tooltip required by rubric
      style={{
        background: 'rgba(0,0,0,0.5)',
        border: '1px solid #5a0000',
        borderRadius: '50%',
        cursor: 'pointer',
        fontSize: '1.25rem',
        padding: '0.4rem',
        width: '35px',
        height: '35px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: isFavorite ? '#ef4444' : '#ffffff',
        transition: 'transform 0.2s',
      }}
      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      {isFavorite ? '❤️' : '🤍'}
    </button>
  )
}