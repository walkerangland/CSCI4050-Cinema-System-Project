'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from '../home.module.css'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    street: '',
    city: '',
    state: '',
    aptNumber: '',
    promotions: true, //promo opted in by default
  })
  //credit cards. max 3
  const [cards, setCards] = useState([
    { cardNumber: '', expirationDate: '', cvv: '', cardholderName: '' },
    { cardNumber: '', expirationDate: '', cvv: '', cardholderName: '' },
    { cardNumber: '', expirationDate: '', cvv: '', cardholderName: '' },
  ])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }
  const handleCardChange = (index, field, value) => {
    const newCards = [...cards]
    newCards[index][field] = value
    setCards(newCards)
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)

    //only sends non-empty card details
    const validCards = cards.filter(card => card.cardNumber.trim() !== '')

    const payload = {
      email: formData.email,
      username: formData.email.split('@')[0], //generates username from email
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      aptNumber: formData.aptNumber,
      promotions: formData.promotions,
      creditCards: validCards
    }
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'An error occurred during registration.')
        setLoading(false)
        return
      }
      setSuccess(true)
      setLoading(false)
    } catch (err) {
      setError('Failed to connect to the server.')
      setLoading(false)
    }
  }
  if (success) {
    return (
      <div style={{ maxWidth: '500px', margin: '4rem auto', textAlign: 'center', backgroundColor: '#1c1c1c', padding: '2rem', borderRadius: '12px', border: '1px solid #5a0000', color: '#fff' }}>
        <h2 style={{ color: '#22c55e', marginBottom: '1rem' }}>✓ Registration Successful!</h2>
        <p style={{ color: '#aaaaaa', marginBottom: '1.5rem' }}>
          Please check your email <strong>{formData.email}</strong> to verify your account before logging in.
        </p>
        <Link href="/login" style={{ color: '#f5c518', textDecoration: 'none', fontWeight: 'bold' }}>
          Proceed to Login
        </Link>
      </div>
    )
  }
  //UI
  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center' }}>
      <form onSubmit={handleSubmit} style={{ backgroundColor: '#1c1c1c', padding: '2rem', borderRadius: '12px', border: '1px solid #5a0000' }}>
        <h1 className={styles.heroTitle} style={{ marginBottom: '1.5rem' }}>Create Account</h1>

        {error && (
          <div style={{ backgroundColor: '#3b0000', border: '1px solid #ef4444', borderRadius: '8px', padding: '0.75rem', marginBottom: '1.5rem', color: '#fca5a5', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <InputField type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required />
          <InputField type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required />
        </div>
        
        <InputField type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required />
        <InputField type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <InputField type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
          <InputField type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required />
        </div>

        {/*address section*/}
        <div className={styles.registerDiv} style={{ textAlign: 'left', marginTop: '1rem' }}>
          <details style={{ backgroundColor: '#0d0d0d', padding: '1rem', borderRadius: '8px', border: '1px solid #333' }}>
            <summary style={{ cursor: 'pointer', color: '#f5c518', fontWeight: 'bold', marginBottom: '0.5rem' }}>Home Address (Optional)</summary>
            <InputField type="text" name="street" value={formData.street} onChange={handleChange} placeholder="Street Address" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <InputField type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" />
              <InputField type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" />
            </div>
            <InputField type="text" name="aptNumber" value={formData.aptNumber} onChange={handleChange} placeholder="Apt No. (if applicable)" />
          </details>
        </div>

        {/*credit cards section*/}
        {[0, 1, 2].map((index) => (
          <div key={index} className={styles.registerDiv} style={{ textAlign: 'left' }}>
            <details style={{ backgroundColor: '#0d0d0d', padding: '1rem', borderRadius: '8px', border: '1px solid #333' }}>
              <summary style={{ cursor: 'pointer', color: '#f5c518', fontWeight: 'bold', marginBottom: '0.5rem' }}>Credit Card #{index + 1} (Optional)</summary>
              <InputField type="text" value={cards[index].cardNumber} onChange={(e) => handleCardChange(index, 'cardNumber', e.target.value)} placeholder="Card No." />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <InputField type="text" value={cards[index].expirationDate} onChange={(e) => handleCardChange(index, 'expirationDate', e.target.value)} placeholder="MM/YY" />
                <InputField type="text" value={cards[index].cvv} onChange={(e) => handleCardChange(index, 'cvv', e.target.value)} placeholder="CVV" />
              </div>
              <InputField type="text" value={cards[index].cardholderName} onChange={(e) => handleCardChange(index, 'cardholderName', e.target.value)} placeholder="Name on card" />
            </details>
          </div>
        ))}

        {/*promotions*/}
        <div className={styles.registerDiv} style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', margin: '1.5rem 0' }}>
          <input 
            type="checkbox" 
            id="promotions" 
            name="promotions" 
            checked={formData.promotions}
            onChange={handleChange}
            style={{ cursor: 'pointer', width: '1.2rem', height: '1.2rem' }}
          />
          <label htmlFor="promotions" style={{ color: '#aaaaaa', fontSize: '0.9rem', cursor: 'pointer' }}>
            Opt-in to receive promotions and discount codes
          </label>
        </div>
        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', padding: '0.75rem', backgroundColor: '#c0392b', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Submitting...' : 'Submit Registration'}
        </button>

      </form>
    </div>
  )
}
function InputField({ required, placeholder, type, name, value, onChange }) {
  return (
    <div className={styles.registerDiv} style={{ position: 'relative', width: '100%', boxSizing: 'border-box' }}>
      <input 
        type={type} 
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder} 
        required={required} 
        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #5a0000', backgroundColor: '#0d0d0d', color: '#ffffff', boxSizing: 'border-box' }}
      />
      {required && (
        <span style={{ color: '#ef4444', position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)' }}>*</span>
      )}
    </div>
  )
}