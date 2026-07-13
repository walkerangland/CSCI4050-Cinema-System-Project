'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
const [email, setEmail] = useState('')
const[submitted, setSubmitted] = useState(false)
const[error, setError] = useState('')
const[loading, setLoading] = useState(false)

const handleSubmit = async (e) => {
e.preventDefault()
setError('')
setLoading(true)

const res = await fetch ('/api/auth/forgot-password', {
method: 'POST'
headers: { 'Content-Type': 'application/json' },
body: JSON.straightfy({ email }),

})

setLoading(false)

if (!res.ok) {
const data = await res.json()
setError(data.message)
return
}

setSubmitted(true)

}

if (submitted) {

return (
      <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', backgroundColor: '#1c1c1c', borderRadius: '12px', border: '1px solid #5a0000', color: '#ffffff', fontFamily: 'sans-serif', textAlign: 'center' }}>
        <h2 style={{ color: '#22c55e', marginBottom: '1rem' }}> Email Sent</h2>
        <p style={{ color: '#aaaaaa' }}>If an account exists for <strong style={{ color: '#fff' }}>{email}</strong>, a password reset link has been sent.</p>
        <Link href="/login" style={{ display: 'inline-block', marginTop: '1.5rem', color: '#f5c518' }}>Back to Login</Link>
      </div>
    )

}

return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', backgroundColor: '#1c1c1c', borderRadius: '12px', border: '1px solid #5a0000', color: '#ffffff', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Forgot Password</h1>
      <p style={{ color: '#aaaaaa', marginBottom: '1.5rem', fontSize: '0.875rem' }}>Enter your email and we'll send you a reset link.</p>

      {error && (
        <div style={{ backgroundColor: '#3b0000', border: '1px solid #ef4444', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem', color: '#fca5a5', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
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

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '0.75rem', backgroundColor: '#c0392b', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <Link href="/login" style={{ color: '#f5c518', fontSize: '0.875rem' }}>Back to Login</Link>
      </div>
    </div>
  )
}
