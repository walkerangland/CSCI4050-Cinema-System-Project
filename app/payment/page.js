'use client'
import { useSearchParams, useRouter } from 'next/navigation'
 
export default function Page({ params }) {
  const salesTax = 0.07
  const searchParams = useSearchParams()
  const router = useRouter()

  return (
  <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem', backgroundColor: '#0d0d0d', color: '#ffffff' }}>
    <h1 style={{ fontSize: '2.0rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>Secure Checkout</h1>
      <div style={{ fontFamily: 'sans-serif', fontSize: '1rem',maxWidth: '750px',  margin: '0 auto', padding:'1rem', backgroundColor: '#232323', borderRadius: '12px', border: '1px solid #5a0000', color: '#ffffff' }}>
        <h1 style={{fontSize:'1.25rem'}}>Stored credit cards:</h1>

      </div>
  </div>
  )
}