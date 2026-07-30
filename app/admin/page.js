'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminPage() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0d0d0d', color: '#ffffff', fontFamily: 'sans-serif' }}>

      {/* Header */}
      <div style={{ backgroundColor: '#1c1c1c', borderBottom: '1px solid #5a0000', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: '#c0392b', fontSize: '1.5rem', fontWeight: 'bold' }}>Admin Portal</h1>
        <button
          onClick={handleLogout}
          style={{ backgroundColor: '#c0392b', color: '#ffffff', border: 'none', padding: '0.5rem 1.25rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Logout
        </button>
      </div>

      {/* Welcome */}
      <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ color: '#aaaaaa', marginBottom: '2rem', textAlign: 'center' }}>Welcome, Admin</h2>

        {/* Menu Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(220px, 280px))', gap: '1.5rem', width: '100%', maxWidth: '680px', justifyContent: 'center' }}>

         <Link href="/admin/showtimes" style={{ textDecoration: 'none' }}>
           <div style={{ backgroundColor: '#1c1c1c', border: '1px solid #5a0000', borderRadius: '12px', padding: '2rem', textAlign: 'center', cursor: 'pointer' }}>
             <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}></div>
             <h3 style={{ color: '#ffffff', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Manage Movies</h3>
             <p style={{ color: '#aaaaaa', fontSize: '0.875rem' }}>Go to showtimes management</p>
           </div>
         </Link>

         <Link href="/admin/pricing" style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: '#1c1c1c', border: '1px solid #5a0000', borderRadius: '12px', padding: '2rem', textAlign: 'center', cursor: 'pointer' }}>
              <h3 style={{ color: '#ffffff', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Manage Pricing</h3>
              <p style={{ color: '#aaaaaa', fontSize: '0.875rem' }}>Update ticket prices and booking fees</p>
            </div>
          </Link>

          <div style={{ backgroundColor: '#1c1c1c', border: '1px solid #5a0000', borderRadius: '12px', padding: '2rem', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}></div>
            <h3 style={{ color: '#ffffff', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Promotions</h3>
            <p style={{ color: '#aaaaaa', fontSize: '0.875rem' }}>Manage discounts and promo codes</p>
          </div>

          <Link href="/admin/users" style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: '#1c1c1c', border: '1px solid #5a0000', borderRadius: '12px', padding: '2rem', textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}></div>
              <h3 style={{ color: '#ffffff', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Users</h3>
              <p style={{ color: '#aaaaaa', fontSize: '0.875rem' }}>View and manage user accounts</p>
            </div>
          </Link>

          <Link href="/admin/showtimes" style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: '#1c1c1c', border: '1px solid #5a0000', borderRadius: '12px', padding: '2rem', textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}></div>
              <h3 style={{ color: '#ffffff', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Showtimes</h3>
              <p style={{ color: '#aaaaaa', fontSize: '0.875rem' }}>Schedule and view movie showtimes</p>
            </div>
          </Link>

          <Link href="/admin/stats" style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: '#1c1c1c', border: '1px solid #5a0000', borderRadius: '12px', padding: '2rem', textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}></div>
              <h3 style={{ color: '#ffffff', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Statistics</h3>
              <p style={{ color: '#aaaaaa', fontSize: '0.875rem' }}>View real-time booking and sales stats</p>
            </div>
          </Link>

          <Link href="/admin/showtimes" style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: '#1c1c1c', border: '1px solid #5a0000', borderRadius: '12px', padding: '2rem', textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}></div>
              <h3 style={{ color: '#ffffff', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Showtimes</h3>
              <p style={{ color: '#aaaaaa', fontSize: '0.875rem' }}>Schedule and manage showtimes</p>
            </div>
          </Link>

        </div>
      </div>
    </div>
  )
}