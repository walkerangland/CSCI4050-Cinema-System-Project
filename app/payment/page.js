'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
 
export default function Page({ params }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [cardData, setCardData] = useState('')
  const [loading, setLoading] = useState(true)
  const [isAddCard, setAddCard] = useState(false)
  const [cardForm, setCardForm] = useState({
    cardNumber: '', expirationMonth: '', expirationYear: '', cardholderName: ''
  })
  
  const total = parseFloat(searchParams.get('total'))

  const salesTax = 0.07
  const promoDiscount = 0.0
  const finalCost = (total + (total * salesTax) - (total * promoDiscount))

  useEffect(() => {
    const fetchCardData = async () => { 
      try {
      const res = await fetch('/api/user/credit-cards')
      if (res.ok) {
        const data = await res.json()
        setCardData(data)
      }
      } catch (err) {
        console.error(err)
      } 
    }
    fetchCardData() 
    setLoading(false)
  }, [])

  const handleCardSubmit = async () => {
    const res = await fetch('/api/user/credit-cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(cardForm)
    })
    const data = await res.json()
    if (!res.ok) {
      alert(data.message || 'Failed to submit card')
      return
    }
    alert('Card updated!')
  }

  const submitPayment = async () => {

  }

  if (loading) return <div style={{ color: '#fff', textAlign: 'center', marginTop: '4rem' }}>Loading...</div>
  return (
  <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem', gap:'2rem', backgroundColor: '#0d0d0d', color: '#ffffff' }}>
    <form onSubmit={submitPayment}>
    <h1 style={{ fontSize: '2.0rem', fontWeight: 'bold', marginBottom: '1 rem', textAlign: 'center' }}>Secure Checkout</h1>
      <div style={{ fontFamily: 'sans-serif', fontSize: '1rem',maxWidth: '750px',  margin: '0 auto', marginBottom:'2rem', padding:'1rem', backgroundColor: '#232323', borderRadius: '12px', border: '1px solid #5a0000', color: '#ffffff' }}>
        <h1 style={{fontSize:'1.25rem'}}>Select a credit card to use:</h1>
        <div style ={{display:'flex', flexDirection:'column', gap:'1rem'}}>
        {cardData && cardData.length > 0 ? (
          cardData.map((card, index) => (
        <div key={card.id} style={{display:'flex', gap:'0.5rem'}}>
          <input type='radio' id={card.id} name="drone" style={{gap:'0.5rem'}}></input>
          <div style = {{borderRadius: '12px', marginLeft:'0.5rem',border: '1px solid #b6b6b6', backgroundColor:'#1b1b1b', color: '#ffffff'}}>  
              <div key={card.id} style={{ padding: '0.5rem', display:'flex', gap:'0.5rem' }}>
                <details>
                  <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Card {index + 1} - {card.cardholderName}</summary>
                  <CardElement card={card}/>
                </details>
              </div>
          </div>
        </div>
            ))

          )  : (
          <div>
              {!isAddCard &&(
              <button onClick= {() => setAddCard(true)} style={{type:'button', padding: '0.4rem', backgroundColor: 'transparent', color: '#59ff6f', outline: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold'}}>Add New Card...</button>
              )}
            {isAddCard && (
              <div>
                <button onClick={() => handleCardSubmit()} style={{type:'button', padding: '0.4rem', backgroundColor: 'transparent', color: '#5972ff', outline: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold'}}>Submit</button>
                <button onClick= {() => setAddCard(false)} style={{type:'button', padding: '0.4rem', backgroundColor: 'transparent', color: '#ff5959', outline: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold'}}>Cancel</button>
              </div>
            )}
              {isAddCard && (
              <div style={{ display: 'flex' }}>
                <div style={{ padding: '0.5rem', maxWidth: '25%', wordWrap: 'break-word' }}>
                  <p style={{ fontWeight: 'bold' }}>Card Number:</p>
                  <input type="text" name="cardNumber" value={cardForm.cardNumber} placeholder="Card Number" onChange={(e) => setCardForm({...cardForm, cardNumber: e.target.value})} />
                </div>
                <div style={{ padding: '0.5rem', maxWidth: '25%', wordWrap: 'break-word' }}>
                  <p style={{ fontWeight: 'bold' }}>Expiration Date:</p>
                  <div>
                    <input type="number" max='12' name="expirationMonth" placeholder="MM" value={cardForm.expirationMonth} onChange={(e) => setCardForm({...cardForm, expirationMonth: e.target.value})} />
                    <input type="number" name="expirationYear" placeholder="YYYY" value={cardForm.expirationYear} onChange={(e) => setCardForm({...cardForm, expirationYear: e.target.value})} />
                  </div>
                </div>
                <div style={{ padding: '0.5rem', maxWidth: '25%', wordWrap: 'break-word' }}>
                  <p style={{ fontWeight: 'bold' }}>Name on card:</p>
                  <input type="text" name="cardholderName" value={cardForm.cardholderName} placeholder="Cardholder Name" onChange={(e) => setCardForm({...cardForm, cardholderName: e.target.value})} />
                </div>
              </div>
        )}
          </div>
          )}
        </div>
      </div>
    <div style={{ fontFamily: 'sans-serif', fontSize: '1rem', maxWidth: '750px',  margin: '0 auto', padding:'1rem', backgroundColor: '#232323', borderRadius: '12px', border: '1px solid #5a0000', color: '#ffffff' }}>
      <h1 style={{fontSize:'1.25rem'}}>Order Total:</h1>
      <div style = {{marginLeft:'0.5rem', width:'30%'}}>
        <div style = {{marginBottom: '0.5rem'}}>
          <span style={{ color: '#c4c4c4'  }}>Tickets:</span>
          <span style={{ color: '#c4c4c4', float:'right' }}>${total.toFixed(2)}</span>
        </div>
        <div style = {{marginBottom: '0.5rem'}}>
          <span style={{ color: '#c4c4c4'  }}>Tax:</span>
          <span style={{ color: '#c4c4c4', float:'right' }}>${(total * salesTax).toFixed(2)}</span>
        </div>
        <div style = {{marginBottom: '0.5rem'}}>
          <span style={{ color: '#c4c4c4'  }}>Promo discount:</span>
          <span style={{ color: '#c4c4c4', float:'right' }}>- ${(total * promoDiscount).toFixed(2)}</span>
        </div>
        <div style = {{marginBottom: '0.5rem'}}>
          <span style={{ color: '#ffffff', fontSize:'20px'  }}>Final Price:</span>
          <span style={{ color: '#ffffff', float:'right', fontSize:'20px' }}>${(finalCost)}</span>
        </div>
      </div>
    </div>
    </form>
  </div>
  )
}

function CardElement({ card }) {
  return(
    <div style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem'}}>
      <div style={{ display: 'flex' }}>
        <div style={{ padding: '0.5rem', maxWidth: '25%', wordWrap: 'break-word' }}>
          <p style={{ fontWeight: 'bold' }}>Card Number:</p>
          <p>{card.cardNumber}</p>
        </div>
        <div style={{ padding: '0.5rem', maxWidth: '25%', wordWrap: 'break-word' }}>
          <p style={{ fontWeight: 'bold' }}>Expiration Date:</p>
          <p>{card.expirationMonth}/{card.expirationYear}</p>
        </div>
        <div style={{ padding: '0.5rem', maxWidth: '25%', wordWrap: 'break-word' }}>
          <p style={{ fontWeight: 'bold' }}>Name on card:</p>
          <p>{card.cardholderName}</p>
        </div>
      </div>
    </div>
  )
}