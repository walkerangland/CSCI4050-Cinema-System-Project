'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
 
export default function Page({ params }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const movie = searchParams.get('movie')
  const time = searchParams.get('time')
  const showtimeId = searchParams.get('showtimeId')
  const seats = searchParams.get('seats') ? searchParams.get('seats').split(',') : []
  const adult = parseInt(searchParams.get('adult')) || 0
  const child = parseInt(searchParams.get('child')) || 0
  const senior = parseInt(searchParams.get('senior')) || 0
  const total = searchParams.get('total') ? parseFloat(searchParams.get('total')) : 0.00

  const query = new URLSearchParams({ total }).toString()

  const goToPayment = async () => {
    const authRes = await fetch('/api/user/profile')
    if (!authRes.ok) {
      alert('You must be logged in to proceed with the payment.')
      router.push('/login')
      return
    }
    router.push(`/payment?${query}`)
  }

  return (
  <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem', backgroundColor: '#0d0d0d', color: '#ffffff' }}>
    <h1 style={{ fontSize: '2.0rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>Order Summary</h1>
      <div style={{ fontFamily: 'sans-serif', fontSize: '1rem',maxWidth: '750px',  margin: '0 auto', padding:'1rem', backgroundColor: '#232323', borderRadius: '12px', border: '1px solid #5a0000', color: '#ffffff' }}>
        <div style={{ display: 'flex', flexDirection: 'column'}}>
          <h1 style = {{fontSize: '1.5rem', fontWeight:'bold'}}>{movie}</h1>
          <span style = {{color: '#b9b9b9'}}>{time}</span>
          <p style ={{fontSize: '1.25rem'}}><strong>Seats: </strong>{seats.join(', ')}</p>
          <p style ={{fontSize: '1.25rem'}}><strong>Tickets: </strong>{adult + child + senior}</p>
          <p>{adult} Adult</p>
          <p>{child} Child</p>
          <p>{senior} Senior</p>
          <p style = {{fontSize: '1.25rem', color: '#ffffff'}}><strong>Total Price before tax: </strong><br></br>${total.toFixed(2)}</p>
          <div style={{justifyContent: 'center', alignItems: 'center', display: 'flex', marginTop: '1rem'}}>
          <button
          onClick={goToPayment}
          type="submit"
          style={{ width: '50%', padding: '0.75rem', backgroundColor: '#c0392b', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', marginTop: '1rem' }}
        > Proceed to Payment </button>
        </div>
        </div>
      </div>
  </div>
  );
}