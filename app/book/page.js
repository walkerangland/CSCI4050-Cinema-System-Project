'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
const COLS = 8

export default function BookingPage() {
  const params = useSearchParams()
  const router = useRouter()
  
  const movie = params.get('movie') || 'Unknown Movie'
  const time = params.get('time') || 'Unknown Time'
  const date = params.get('date') || 'Unknown Date'
  const hallId = params.get('hallId') || 'Unknown Showroom'
  const showtimeId = params.get('showtimeId')
  
  const [quantities, setQuantities] = useState({ Adult: 0, Child: 0, Senior: 0 })
  const [selectedSeats, setSelectedSeats] = useState([])
  const [takenSeats, setTakenSeats] = useState([])
  
  const [ticketTypes, setTicketTypes] = useState([])
  const [loadingPrices, setLoadingPrices] = useState(true)
  const [loadingSeats, setLoadingSeats] = useState(true)
  
  const totalTickets = quantities.Adult + quantities.Child + quantities.Senior
  const total = ticketTypes.reduce((sum, t) => sum + t.price * (quantities[t.type] || 0), 0)

  // Fetch ticket prices from the database
  useEffect(() => {
    fetch('/api/admin/pricing')
      .then(res => res.json())
      .then(data => {
        if (data.ticketPrices) {
          const formattedPrices = data.ticketPrices.map(t => ({
            type: t.category.charAt(0) + t.category.slice(1).toLowerCase(),
            price: parseFloat(t.price)
          }))
          
          const order = ['Adult', 'Child', 'Senior']
          formattedPrices.sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type))
          
          setTicketTypes(formattedPrices)
        }
        setLoadingPrices(false)
      })
      .catch(err => {
        console.error("Failed to fetch prices:", err)
        setLoadingPrices(false)
      })
  }, [])

  useEffect(() => {
    if (showtimeId) {
      fetch(`/api/showtimes/${showtimeId}/seats`)
        .then(res => res.json())
        .then(data => {
          if (data.takenSeats) setTakenSeats(data.takenSeats)
          console.log('taken seats:' + data.takenSeats)
          setLoadingSeats(false)
        })
        .catch(err => {
          console.error("Failed to fetch seats:", err)
          setLoadingSeats(false)
        })
    } else {
      setLoadingSeats(false)
    }
  }, [showtimeId])

  const updateQty = (type, delta) => {
    setQuantities(prev => {
      const newQty = Math.max(0, prev[type] + delta)
      const newTotal = Object.values({ ...prev, [type]: newQty }).reduce((a, b) => a + b, 0)
      
      // Trim selected seats if the user reduces ticket count below current selections
      if (newTotal < selectedSeats.length) {
        setSelectedSeats(selectedSeats.slice(0, newTotal))
      }
      
      return { ...prev, [type]: newQty }
    })
  }

  const toggleSeat = (seat) => {
    if (takenSeats.includes(seat)) return
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(prev => prev.filter(s => s !== seat))
    } else {
      if (selectedSeats.length >= totalTickets) {
        alert(`You only selected ${totalTickets} tickets. Please increase your ticket quantity to select more seats.`)
        return
      }
      setSelectedSeats(prev => [...prev, seat])
    }
  }

  const getSeatColor = (seat) => {
    if (takenSeats.includes(seat)) return '#ef4444' // red = taken
    if (selectedSeats.includes(seat)) return '#22c55e' // green = selected
    return '#d1d5db' // gray = available
  }

  const handleCheckout = async () => {
    if (totalTickets === 0) {
      alert('Please select at least one ticket.')
      return
    }
    if (selectedSeats.length !== totalTickets) {
      alert(`Please select exactly ${totalTickets} seats to match your ticket quantity.`)
      return
    }
    
    // Verify authentication before allowing checkout
    const authRes = await fetch('/api/user/profile')
    if (!authRes.ok) {
      alert('You must be logged in to complete your booking.')
      router.push('/login')
      return
    }
    console.log('showtimeID: ' + showtimeId)
    console.log('totalprice: ' + total)
    const bookRes = await fetch('api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({
        showtimeId,
        totalPrice: total,
        seatIds: selectedSeats,
        quantities: quantities,
        ticketTypes: ticketTypes,
        hallId: hallId
      }),
    })
    const data = await bookRes.json()
    if (!bookRes.ok) {
      alert('There was an error booking: ' + data.message)
      return
    }

    // Route to the Order Summary page passing data as query parameters
    const query = new URLSearchParams({
      movie,
      time,
      date,
      showtimeId,
      seats: selectedSeats.join(','),
      adult: quantities.Adult,
      child: quantities.Child,
      senior: quantities.Senior,
      total: total.toFixed(2),
      bookId: data.bookingId
    }).toString()
    
    router.push(`/checkout/summary?${query}`)

  }
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif', backgroundColor: '#0d0d0d', color: '#ffffff'}}>
      {/* Header */}
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{movie}</h1>
      <p style={{ color: '#aaaaaa', marginBottom: '2rem' }}>Showtime: {date} {time} @ Showroom {hallId}</p>
      
      {/* Ticket Selector */}
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Select Tickets</h2>
      <div style={{ marginBottom: '2rem' }}>
        {loadingPrices ? (
           <p style={{ color: '#aaaaaa' }}>Loading ticket prices...</p>
        ) : (
          ticketTypes.map(({ type, price }) => (
            <div key={type} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', border: '1px solid #5a0000', borderRadius: '8px', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: '500' }}>{type}</span>
              <span style={{ color: '#aaaaaa' }}>${price.toFixed(2)}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button onClick={() => updateQty(type, -1)} style={{ width: '2rem', height: '2rem', borderRadius: '50%', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: '1rem' }}>-</button>
                <span style={{ minWidth: '1rem', textAlign: 'center' }}>{quantities[type]}</span>
                <button onClick={() => updateQty(type, +1)} style={{ width: '2rem', height: '2rem', borderRadius: '50%', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: '1rem' }}>+</button>
              </div>
            </div>
          ))
        )}
        <p style={{ textAlign: 'right', fontWeight: 'bold', marginTop: '0.5rem' }}>Total: ${total.toFixed(2)}</p>
      </div>

      {/* Seat Map */}
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Select Seats</h2>
      
      {/* Legend */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
        {[['#d1d5db','Available'],['#22c55e','Selected'],['#ef4444','Taken']].map(([color, label]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: color }}/>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Screen */}
      <div style={{ textAlign: 'center', background: '#f5c518', padding: '0.4rem', borderRadius: '4px', marginBottom: '1.5rem', color: '#6b7280', fontSize: '0.875rem' }}>SCREEN</div>
      
      {/* Seat Grid */}
      {loadingSeats ? (
        <p style={{ color: '#aaaaaa', textAlign: 'center', padding: '2rem' }}>Loading seat map...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
          {ROWS.map(row => (
            <div key={row} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ width: '1rem', fontWeight: 'bold', fontSize: '0.875rem' }}>{row}</span>
              {Array.from({ length: COLS }, (_, i) => {
                const seat = `${row}${i + 1}`
                return (
                  <button
                    key={seat}
                    onClick={() => toggleSeat(seat)}
                    style={{ width: '2.5rem', height: '2.5rem', borderRadius: '6px', border: 'none', backgroundColor: getSeatColor(seat), cursor: takenSeats.includes(seat) ? 'not-allowed' : 'pointer', fontSize: '0.7rem' }}
                  >
                    {i + 1}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      )}

      {/* Selected Seats Summary */}
      {selectedSeats.length > 0 && (
        <p style={{ color: '#aaaaaa', marginBottom: '1.5rem' }}>Selected seats: <strong>{selectedSeats.join(', ')}</strong></p>
      )}

      {/* Checkout Button */}
      <button 
        onClick={handleCheckout}
        style={{ width: '100%', padding: '1rem', backgroundColor: '#c0392b', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}
      >
        Proceed to Checkout
      </button>
    </div>
  )
}