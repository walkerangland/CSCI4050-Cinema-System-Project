'use client'
import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

function ResetForm() {
const router = useRouter()
const params = useSearchParams()
const token = params.get('token')

const [password, setPassword] = useState('')
const [confirm, setConfirm] = useState('')
const [error, setError] = useState('')
const [success, setSuccess] = useState(false)
const [loading, setLoading] = useState(false)

const handleSubmit = async (e) => {
e.preventDefault()
setError('')

if (password != confirm) {
setError('Passwords do not match.')
return

}

if (password.length < 8) {
setError('Password must be at least 8 characters.')
return

}

setLoading(true)
const res = await fetch('/api/auth/reset-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ token, password }),

 })

 const data = await res.json()
 setLoading(false)

 if (!res.ok) {
 setError(data.message)
 return
 }

 setSuccess(true)
 setTimeout(() => router.push('/login'), 3000)

}

if (success) {
return (
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ color: '#22c55e' }}>✓ Password Reset!</h2>
        <p style={{ color: '#aaaaaa' }}>Your password has been updated. Redirecting to login...</p>
      </div>
    )
}

 return (
    <>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Reset Password</h1>

      {error && (
        <div style={{ backgroundColor: '#3b0000', border: '1px solid #ef4444', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem', color: '#fca5a5', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#aaaaaa' }}>
            New Password <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #5a0000', backgroundColor: '#0d0d0d', color: '#ffffff', fontSize: '1rem', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#aaaaaa' }}>
            Confirm Password <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #5a0000', backgroundColor: '#0d0d0d', color: '#ffffff', fontSize: '1rem', boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '0.75rem', backgroundColor: '#c0392b', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <Link href="/login" style={{ color: '#f5c518', fontSize: '0.875rem' }}>Back to Login</Link>
      </div>
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', backgroundColor: '#1c1c1c', borderRadius: '12px', border: '1px solid #5a0000', color: '#ffffff', fontFamily: 'sans-serif' }}>
      <Suspense fallback={<p style={{ color: '#aaaaaa' }}>Loading...</p>}>
        <ResetForm />
      </Suspense>
    </div>
  )

}