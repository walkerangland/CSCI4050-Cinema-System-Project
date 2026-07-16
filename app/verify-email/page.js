'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'


 
export default function Page() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const [ msg, setMsg] = useState('')

    async function verify() {
      const res = await fetch ('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({token}),
      })
      const data = await res.json()
      setMsg(data.message)

    }
  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', backgroundColor: '#1c1c1c', borderRadius: '12px', border: '1px solid #5a0000', color: '#ffffff', fontFamily: 'sans-serif' }}>
      <button style={{ width: '100%', padding: '0.75rem', backgroundColor: '#c0392b', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold'}}onClick={verify}>Verify Email</button>
      {msg && <p>{msg}</p>}
    </div>
  ) 
}