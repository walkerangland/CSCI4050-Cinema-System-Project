'use client'
import styles from '../home.module.css'
import { useState } from 'react'
import { InputField } from '../register/page'

export default function ProfilePage() {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setEditing] = useState(false)

  const [editForm, setEditForm] = useState({
    firstName: '', lastName: '', phone: '', street: '', city: '', state: '', aptNumber: '',
    currentPassword: '', newPassword: ''
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/user/profile')
        if (res.ok) {
          const data = await res.json()
          setUserData(data)
          setEditForm({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            phone: data.phoneNumber || '',
            street: data.address?.street || '',
            city: data.address?.city || '',
            state: data.address?.state || '',
            aptNumber: '',
            currentPassword: '', 
            newPassword: ''
          })
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    await fetch('/api/user/update-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm)
    })

    if (editForm.newPassword) {
      const passRes = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: editForm.currentPassword,
          newPassword: editForm.newPassword
        })
      })
      const passData = await passRes.json()
      if (!passRes.ok) {
        alert(passData.message) //show error if current password was wrong
        return
      }
    }
    
    alert('Profile updated!')
    window.location.reload()
  }

  if (loading) return <div style={{ color: '#fff', textAlign: 'center', marginTop: '4rem' }}>Loading profile...</div>
  if (!userData) return <div style={{ color: '#fff', textAlign: 'center', marginTop: '4rem' }}>Please log in.</div>
return (
  <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem', backgroundColor: '#0d0d0d', color: '#ffffff' }}>
    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>Personal Information</h1>
      <div style={{ fontFamily: 'sans-serif', fontSize: '1rem',maxWidth: '750px',  margin: '0 auto', padding:'0.5rem', backgroundColor: '#232323', borderRadius: '12px', border: '1px solid #5a0000', color: '#ffffff' }}>
        {!isEditing && (
        <button onClick= {() => setEditing(true)} style={{type:'button', padding: '0.4rem', backgroundColor: 'transparent', color: '#5972ff', outline: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold'}}>Edit...</button>
        )}
        {isEditing && (
        <button onClick= {() => setEditing(false)} style={{type:'button', padding: '0.4rem', backgroundColor: 'transparent', color: '#5972ff', outline: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold'}}>Submit Changes</button>
        )}
        {isEditing && (
        <button onClick= {() => setEditing(false)} style={{type:'button', padding: '0.4rem', backgroundColor: 'transparent', color: '#ff5959', outline: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold'}}>Cancel</button>
        )}
       <div style ={{display:'flex'}}>
          <div style = {{ padding:'0.5rem', maxWidth:'20%', wordWrap:'break-word'}}>
            <p style={{fontWeight: 'bold'}}>Email:</p>
            <p>{userData.email}</p>
            {isEditing && (<span style={{color:'#f93939', fontStyle:'italic', fontSize:'0.8rem'}}>*Email cannot be edited</span> )}
            
          </div>
          <div style = {{ padding:'0.5rem', maxWidth:'15%', wordWrap:'break-word'}}>
            <p style={{fontWeight: 'bold'}}>Name:</p>
            {!isEditing && ( 
            <p>{userData.firstName} {userData.lastName}</p>
            )}
            {isEditing && ( 
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                <input type='text' name="firstName" value={editForm.firstName} onChange={handleChange} placeholder='First Name' style={{ width: '100%', boxSizing: 'border-box' }} />
                <input type='text' name="lastName" value={editForm.lastName} onChange={handleChange} placeholder='Last Name' style={{ width: '100%', boxSizing: 'border-box' }} />
              </div>
            )}
          </div>
          
          <div style = {{ padding:'0.5rem', maxWidth:'15%', wordWrap:'break-word'}}>
            <p style={{fontWeight: 'bold'}}>Phone:</p>
            {!isEditing && ( <p>{userData.phoneNumber || 'None'}</p> )}
            {isEditing && ( 
              <div><input type='tel' name="phone" value={editForm.phone} onChange={handleChange} placeholder='Phone Number' style={{ width: '100%', boxSizing: 'border-box' }} /></div>
            )}
          </div>
          <div style = {{ padding:'0.5rem', maxWidth:'15%', wordWrap:'break-word'}}>
            <p style={{fontWeight: 'bold'}}>Password:</p>
            {!isEditing && ( <p>********</p> )}( 
            {isEditing && ( 
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                <input type='password' name="currentPassword" value={editForm.currentPassword} onChange={handleChange} placeholder='Current Password' style={{ width: '100%', boxSizing: 'border-box' }} />
                <input type='password' name="newPassword" value={editForm.newPassword} onChange={handleChange} placeholder='New Password' style={{ width: '100%', boxSizing: 'border-box' }} />
              </div>
            )}
          </div>
          <div style = {{ padding:'0.5rem', maxWidth:'25%', wordWrap:'break-word'}}>
            <p style={{fontWeight: 'bold'}}>Address:</p>
            {!isEditing && ( 
            <p>{userData.address ? `${userData.address.street}, ${userData.address.city}, ${userData.address.state}` : 'No address saved.'}</p>
            )}
            {isEditing && ( 
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                <input type='text' name="street" value={editForm.street} onChange={handleChange} placeholder='Street Address' style={{ width: '100%', boxSizing: 'border-box' }} />
                <div style={{ display: 'flex' }}>
                  <input type="text" name="city" value={editForm.city} onChange={handleChange} placeholder='City' style={{ width: '50%', boxSizing: 'border-box' }} />
                  <input type="text" name="state" value={editForm.state} onChange={handleChange} placeholder='State' style={{ width: '50%', boxSizing: 'border-box' }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', marginTop:'1.5rem', textAlign: 'center' }}>Credit Cards</h1>
      <div style={{ fontFamily: 'sans-serif', fontSize: '1rem',maxWidth: '750px',  margin: '0 auto', padding:'0.5rem', backgroundColor: '#232323', borderRadius: '12px', border: '1px solid #5a0000', color: '#ffffff' }}>
        {userData.paymentCards && userData.paymentCards.length > 0 ? (
          userData.paymentCards.map((card, index) => (
            <div key={card.id} style={{ padding: '0.5rem' }}>
              <details>
                <summary>Card {index + 1} - {card.cardholderName}</summary>
                <CardElement card={card} />
              </details>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#aaa', padding: '1rem' }}>No payment cards saved.</p>
        )}

      </div>  
    </div>
  )
}

function CardElement({ card }) {
  return (
    <div style={{ paddingTop: '0.5rem' }}>
      <div style={{ display: 'flex' }}>
        <div style={{ padding: '0.5rem', maxWidth: '25%', wordWrap: 'break-word' }}>
          <p style={{ fontWeight: 'bold' }}>Card Number:</p>
          <p>{card.cardNumber}</p>
        </div>
        <div style={{ padding: '0.5rem', maxWidth: '25%', wordWrap: 'break-word' }}>
          <p style={{ fontWeight: 'bold' }}>Expiration Date:</p>
          <p>{card.expirationDate}</p>
        </div>
        <div style={{ padding: '0.5rem', maxWidth: '25%', wordWrap: 'break-word' }}>
          <p style={{ fontWeight: 'bold' }}>Name on card:</p>
          <p>{card.cardholderName}</p>
        </div>
      </div>
    </div>
  )
}