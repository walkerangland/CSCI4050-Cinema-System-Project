'use client'
import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'

const TICKET_TYPES = [
  { type: 'Adult', price: 12.0 },
  { type: 'Child', price: 8.0 },
  { type: 'Senior', price: 10.0 },
]

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
const COLS = 8
const TAKEN_SEATS = ['A1', 'A2', 'B4', 'C7', 'D3', 'E5', 'F1', 'G8', 'H2', 'H3']

function BookingPageContent() {
  const params = useSearchParams()
  const movie = params.get('movie') || 'Unknown Movie'
  const time = params.get('time') || 'Unknown Time'

  const [quantities, setQuantities] = useState({ Adult: 0, Child: 0, Senior: 0 })
  const [selectedSeats, setSelectedSeats] = useState([])

  const updateQty = (type, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta),
    }))
  }

  const toggleSeat = (seat) => {
    if (TAKEN_SEATS.includes(seat)) return
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    )
  }

  const total = TICKET_TYPES.reduce(
    (sum, t) => sum + t.price * quantities[t.type],
    0
  )

  const getSeatColor = (seat) => {
    if (TAKEN_SEATS.includes(seat)) return '#ef4444'
    if (selectedSeats.includes(seat)) return '#22c55e'
    return '#d1d5db'
  }

  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem',
        fontFamily: 'sans-serif',
        backgroundColor: '#0d0d0d',
        color: '#ffffff',
      }}
    >

      {/* Header */}
       <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{movie}</h1>
       <p style={{ color: '#aaaaaa', marginBottom: '2rem' }}>Showtime: {time}</p>

      {/* Ticket Selector */}
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Select Tickets</h2>
      <div style={{ marginBottom: '2rem' }}>
        {TICKET_TYPES.map(({ type, price }) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', border: '1px solid #5a0000', borderRadius: '8px', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: '500' }}>{type}</span>
            <span style={{ color: '#aaaaaa' }}>${price.toFixed(2)}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button onClick={() => updateQty(type, -1)} style={{ width: '2rem', height: '2rem', borderRadius: '50%', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: '1rem' }}>−</button>
              <span style={{ minWidth: '1rem', textAlign: 'center' }}>{quantities[type]}</span>
              <button onClick={() => updateQty(type, +1)} style={{ width: '2rem', height: '2rem', borderRadius: '50%', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: '1rem' }}>+</button>
            </div>
          </div>
        ))}
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
                  style={{ width: '2.5rem', height: '2.5rem', borderRadius: '6px', border: 'none', backgroundColor: getSeatColor(seat), cursor: TAKEN_SEATS.includes(seat) ? 'not-allowed' : 'pointer', fontSize: '0.7rem' }}
                >
                  {i + 1}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* Selected Seats Summary */}
      {selectedSeats.length > 0 && (
        <p style={{ color: '#aaaaaa' }}>Selected seats: <strong>{selectedSeats.join(', ')}</strong></p>
      )}

    </div>
  )
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: '2rem', color: '#ffffff' }}>
          Loading booking details...
        </div>
      }
    >
      <BookingPageContent />
    </Suspense>
  )
}
