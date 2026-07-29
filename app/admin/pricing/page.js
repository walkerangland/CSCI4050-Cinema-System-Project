'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminPricingPage() {
  const [tickets, setTickets] = useState([
    { category: 'ADULT', price: '' },
    { category: 'CHILD', price: '' },
    { category: 'SENIOR', price: '' }
  ])
  const [bookingFee, setBookingFee] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const loadPricing = async () => {
    setLoading(true)
    const response = await fetch('/api/admin/pricing')
    const data = await response.json()
    
    if (data.ticketPrices && data.ticketPrices.length > 0) {
      setTickets(prev => prev.map(t => {
        const found = data.ticketPrices.find(dbTicket => dbTicket.category === t.category)
        return found ? { ...t, price: found.price } : t
      }))
    }
    
    if (data.fees && data.fees.length > 0) {
      const fee = data.fees.find(f => f.name === 'Online Booking Fee')
      if (fee) setBookingFee(fee.amount)
    }
    
    setLoading(false)
  }

  useEffect(() => {
    loadPricing()
  }, [])

  const handleTicketChange = (category, newPrice) => {
    setTickets(prev => prev.map(t => 
      t.category === category ? { ...t, price: newPrice } : t
    ))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')

    const payload = {
      tickets: tickets.map(t => ({ ...t, price: parseFloat(t.price) || 0 })),
      bookingFee: parseFloat(bookingFee) || 0
    }

    const response = await fetch('/api/admin/pricing', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const data = await response.json()
    setMessage(data.message)
    await loadPricing()
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0d0d0d', color: '#ffffff', fontFamily: 'sans-serif', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: '#c0392b', marginBottom: '0.25rem' }}>Manage Pricing & Fees</h1>
          <p style={{ color: '#aaaaaa' }}>Update base ticket prices and system-wide fees.</p>
        </div>
        <Link href="/admin" style={{ color: '#c0392b', textDecoration: 'none', fontWeight: 'bold' }}>&larr; Back to dashboard</Link>
      </div>

      {message && <div style={{ marginBottom: '1rem', color: '#7ed957' }}>{message}</div>}

      <form onSubmit={handleSubmit} style={{ backgroundColor: '#1c1c1c', border: '1px solid #5a0000', borderRadius: '12px', padding: '2rem', maxWidth: '600px' }}>
        
        <h2 style={{ color: '#ffffff', marginBottom: '1.5rem', fontSize: '1.25rem' }}>Ticket Prices</h2>
        
        {loading ? <p style={{ color: '#aaaaaa' }}>Loading...</p> : (
          <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
            {tickets.map((ticket) => (
              <div key={ticket.category} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', alignItems: 'center' }}>
                <label style={{ color: '#cccccc' }}>{ticket.category}</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#888' }}>$</span>
                  <input 
                    type="number" 
                    step="0.01"
                    value={ticket.price} 
                    onChange={(e) => handleTicketChange(ticket.category, e.target.value)} 
                    style={{ width: '100%', padding: '0.7rem 0.7rem 0.7rem 1.5rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#111', color: '#fff', boxSizing: 'border-box' }} 
                    required 
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <h2 style={{ color: '#ffffff', marginBottom: '1.5rem', fontSize: '1.25rem', paddingTop: '1.5rem', borderTop: '1px solid #333' }}>System Fees</h2>
        
        {!loading && (
          <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', alignItems: 'center', marginBottom: '2rem' }}>
            <label style={{ color: '#cccccc' }}>Online Booking Fee</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#888' }}>$</span>
              <input 
                type="number" 
                step="0.01"
                value={bookingFee} 
                onChange={(e) => setBookingFee(e.target.value)} 
                style={{ width: '100%', padding: '0.7rem 0.7rem 0.7rem 1.5rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#111', color: '#fff', boxSizing: 'border-box' }} 
                required 
              />
            </div>
          </div>
        )}

        <button type="submit" disabled={loading} style={{ width: '100%', backgroundColor: '#c0392b', color: '#fff', border: 'none', padding: '0.9rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          {loading ? 'Saving...' : 'Save All Pricing'}
        </button>
      </form>
    </div>
  )
}