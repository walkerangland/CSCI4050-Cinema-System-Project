'use client'
import { useSearchParams, useRouter} from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
 
export default function Page({ params }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const movie = searchParams.get('movie')
  const time = searchParams.get('time')
  const date = searchParams.get('date')
  const showtimeId = searchParams.get('showtimeId')
  const seats = searchParams.get('seats') ? searchParams.get('seats').split(',') : []
  const adult = parseInt(searchParams.get('adult')) || 0
  const child = parseInt(searchParams.get('child')) || 0
  const senior = parseInt(searchParams.get('senior')) || 0
  const total = searchParams.get('total') ? parseFloat(searchParams.get('total')) : 0.00
  const [canProceed, setCanProceed] = useState(false)
  const [editingEmail, setEditingEmail] = useState(false)
  const [emailForm, setEmailForm] = useState({
    email: ''
  })
  const [loading, setLoading] = useState(true)
  const [emailLoading, setEmailLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  

  const query = new URLSearchParams({
    showtimeId : showtimeId,
    total : total.toFixed(2),
    seats : seats.join(','),
    adult : adult,
    child : child,
    senior : senior,
    bookId : searchParams.get('bookId')
    }).toString()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/user/update-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailForm.email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'An unexpected error occurred.')
      } else {
        setEditingEmail(false)
        setCanProceed(true)
      }
      alert(JSON.stringify(data.message))
      window.location.reload()
    } catch (error) {
      console.error('Email update error:', error)
      setError('Failed to update email.')
    } finally {
      setLoading(false)
    }
  }

  const goToPayment = async () => {
    const authRes = await fetch('/api/user/profile')
    if (!authRes.ok) {
      alert('You must be logged in to proceed with the payment.')
      router.push('/login')
      return
    }
    router.push(`/payment?${query}`)
  }

  useEffect(() => {
    try {
    const fetchEmail = async () => {
      const res = await fetch('/api/user/profile')
      if (res.ok) {
        const data = await res.json()
        setEmail(data.email)
      }
    }
    fetchEmail()
  } catch (error) {
    console.error('Error fetching email:', error)
  } finally {
    setEmailLoading(false)
  }
}, [])

  if (emailLoading) return <div style={{ color: '#fff', textAlign: 'center', marginTop: '4rem' }}>Loading...</div>
  return (
  <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem', backgroundColor: '#0d0d0d', color: '#ffffff' }}>
    <h1 style={{ fontSize: '2.0rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>Order Summary</h1>
      <div style={{ fontFamily: 'sans-serif', fontSize: '1rem',maxWidth: '750px',  margin: '0 auto', padding:'1rem', backgroundColor: '#232323', borderRadius: '12px', border: '1px solid #5a0000', color: '#ffffff' }}>
        <div style={{ display: 'flex', flexDirection: 'column'}}>
          <h1 style = {{fontSize: '1.5rem', fontWeight:'bold'}}>{movie}</h1>
          <span style = {{color: '#b9b9b9'}}>{date} {time}</span>
          <p style ={{fontSize: '1.25rem'}}><strong>Seats: </strong>{seats.join(', ')}</p>
          <p style ={{fontSize: '1.25rem'}}><strong>Tickets: </strong>{adult + child + senior}</p>
          <p>{adult} Adult</p>
          <p>{child} Child</p>
          <p>{senior} Senior</p>
          <p style = {{fontSize: '1.25rem', color: '#ffffff'}}><strong>Total Price before tax: </strong><br></br>${total.toFixed(2)}</p>
          <div style={{display:'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
            {!editingEmail && (
            <div style={{display:'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <p style={{fontSize: '1.25rem', color: '#ffffff', fontWeight: 'bold'}}>Do you wish to use this email?</p>
              <p>Email: {email}</p>
            </div>
            )}
            {editingEmail && (
            <div>
              <label htmlFor="email">Enter new email: </label>
              
                <input type="email" id="email" placeholder="user@example.com" onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })} />
              
            </div>
            )}
            
            {!canProceed && !editingEmail &&(
            <div style={{display:'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem'}}>
              <button
              onClick={() => setCanProceed(true)}
              style={{ width: '100%', padding: '0.75rem', backgroundColor: '#c0392b', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', marginTop: '1rem' }}
              >Yes
              </button>
              <button
              onClick={() => {
                setEditingEmail(true)
                setCanProceed(false)
              }}
              style={{ width: '100%', padding: '0.75rem', backgroundColor: '#c0392b', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', marginTop: '1rem' }}
              >No 
              </button>
              </div>
              )}
              {!canProceed && editingEmail &&(
                <div>
              <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '0.75rem', backgroundColor: '#c0392b', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', justifyContent: 'center', alignItems: 'center',  cursor: loading ? 'not-allowed' : 'pointer', marginTop: '1rem' }}
              >Submit Email
              </button> 
              </div>
              )}
            
           </form>
          </div>
          
          <div style={{justifyContent: 'center', alignItems: 'center', display: 'flex', marginTop: '1rem'}}>
            {canProceed && (
            <button
            onClick={goToPayment}
            style={{ width: '50%', padding: '0.75rem', backgroundColor: '#c0392b', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', marginTop: '1rem' }}
          > Proceed to Payment </button>
            )}
        </div>
        </div>
      </div>
  </div>
  );
}