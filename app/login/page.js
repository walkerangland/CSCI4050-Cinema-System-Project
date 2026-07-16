'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const text = await res.text()
      const data = text ? JSON.parse(text) : {}
      
      setLoading(false)

      if (!res.ok) {
        setError(data.message || 'An unexpected error occurred.')
        return
      }

      if (data.role === 'ADMIN' || data.user?.role === 'ADMIN') {
        window.location.href = '/admin'
      } else {
        window.location.href = '/profile'
      }
    } catch (err) {
      setLoading(false)
      setError('A network error occurred. Please try again.')
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', backgroundColor: '#1c1c1c', borderRadius: '12px', border: '1px solid #5a0000', color: '#ffffff', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>Sign In</h1>

      {error && (
        <div style={{ backgroundColor: '#3b0000', border: '1px solid #ef4444', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem', color: '#fca5a5', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#aaaaaa' }}>
            Email <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #5a0000', backgroundColor: '#0d0d0d', color: '#ffffff', fontSize: '1rem', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#aaaaaa' }}>
            Password <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #5a0000', backgroundColor: '#0d0d0d', color: '#ffffff', fontSize: '1rem', boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '0.75rem', backgroundColor: '#c0392b', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <Link href="/forgot-password" style={{ color: '#f5c518', fontSize: '0.875rem' }}>
          Forgot your password?
        </Link>
      </div>

      <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.875rem', color: '#aaaaaa' }}>
        Don't have an account?{' '}
        <Link href="/register" style={{ color: '#f5c518' }}>Register</Link>
      </div>
    </div>
  )
}