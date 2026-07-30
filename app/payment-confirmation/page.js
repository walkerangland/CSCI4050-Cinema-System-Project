'use client'
import { useSearchParams, useRouter } from 'next/navigation'


export default function Page() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const goToHome = () => {
    router.push('/')
  }

  return(
  <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem', gap:'2rem', backgroundColor: '#0d0d0d', color: '#ffffff' }}>
      <div style={{ fontFamily: 'sans-serif', fontSize: '1rem',maxWidth: '750px',  margin: '0 auto', marginBottom:'2rem', padding:'1rem', backgroundColor: '#232323', borderRadius: '12px', border: '1px solid #5a0000', color: '#ffffff', textAlign:'center' }}>
        <h1>Payment confirmed!</h1>
        <span style={{color:'#adadad'}}>Check your email for the confirmation info.</span><br></br>
        <button
          onClick={goToHome}
          style={{ width: '50%', padding: '0.75rem', backgroundColor: '#c0392b', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' }}
          >Return to home page</button>
      </div>

    </div>
  )
}