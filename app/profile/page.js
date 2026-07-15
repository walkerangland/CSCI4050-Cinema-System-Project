'use client'
import styles from '../home.module.css'
import { useState } from 'react'
import { InputField } from '../register/page'

export default function ProfilePage() {
    const [isEditing, setEditing] = useState(false)
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
            <p>blablabla@gmail.com</p>
            {isEditing && (<span style={{color:'#f93939', fontStyle:'italic', fontSize:'0.8rem'}}>*Email cannot be edited</span> )}
            
          </div>
          <div style = {{ padding:'0.5rem', maxWidth:'15%', wordWrap:'break-word'}}>
            <p style={{fontWeight: 'bold'}}>Name:</p>
            {!isEditing && ( 
            <p>John Doe</p>
            )}
            {isEditing && ( 
            <div>
              <input type='text' placeholder= 'First Name' required={false} style={{width:'100%', boxSizing:'border-box'}}></input>
              <input type='text' placeholder= 'Last Name' required={false} style={{width:'100%', boxSizing:'border-box'}}></input>
            </div>
            )}
          </div>
          
          <div style = {{ padding:'0.5rem', maxWidth:'15%', wordWrap:'break-word'}}>
            <p style={{fontWeight: 'bold'}}>Phone:</p>
            {!isEditing && ( 
            <p>123-456-7890</p>
            )}
            {isEditing && ( 
            <div>
              <input type='tel' placeholder= 'Phone Number' required={false} style={{width:'100%', boxSizing:'border-box'}}></input>
            </div>
            )}
          </div>
          <div style = {{ padding:'0.5rem', maxWidth:'15%', wordWrap:'break-word'}}>
            <p style={{fontWeight: 'bold'}}>Password:</p>
            {!isEditing && ( 
            <p>password</p>
            )}
            {isEditing && ( 
            <div>
              <input type='password' placeholder= 'Password' required={false} style={{width:'100%', boxSizing:'border-box'}}></input>
            </div>
            )}
          </div>
          <div style = {{ padding:'0.5rem', maxWidth:'15%', wordWrap:'break-word'}}>
            <p style={{fontWeight: 'bold'}}>Address:</p>
            {!isEditing && ( 
            <p>123 Street Road</p>
            )}
            {isEditing && ( 
            <div>
              <input type='text' placeholder= 'Street Address' required={false} style={{width:'100%', boxSizing:'border-box'}}></input>
              <div style={{display:'flex'}}>
                <input type="text" placeholder='City' required={false} style={{width:'50%', boxSizing:'border-box'}} ></input>
                <input type="text" placeholder='State' required={false} style={{width:'50%', boxSizing:'border-box'}}></input>
              </div>
              <input type='text' placeholder= 'Apt No. (if applicable)  ' required={false} style={{width:'100%', boxSizing:'border-box'}}></input>
            </div>
            )}
          </div>
        </div>
      </div>
      {/*Credit Cards section*/}
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', marginTop:'1.5rem', textAlign: 'center' }}>Credit Cards</h1>
      <div style={{ fontFamily: 'sans-serif', fontSize: '1rem',maxWidth: '750px',  margin: '0 auto', padding:'0.5rem', backgroundColor: '#232323', borderRadius: '12px', border: '1px solid #5a0000', color: '#ffffff' }}>
        <div style={{padding: '0.5rem'}}>
        <details>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold'}}> Card 1</summary>
          <CardElement/>
          </details>
        </div>
        <div style={{padding: '0.5rem'}}>
        <details>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold'}}>Card 2</summary>
          <CardElement/>
          </details>
        </div>
        <div style={{padding: '0.5rem'}}>
        <details>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold'}}>Card 3</summary>
          <CardElement/>
          </details>
        </div>
      </div>  
      {/*Favorite Movies Section */}
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', marginTop:'1.5rem', textAlign: 'center' }}>Favorite Movies</h1>
      <div style={{ fontFamily: 'sans-serif', fontSize: '1rem',maxWidth: '750px',  margin: '0 auto', padding:'0.5rem', backgroundColor: '#232323', borderRadius: '12px', border: '1px solid #5a0000', color: '#ffffff' }}>
        <div>
          
        </div>      
      </div>
    </div>
)
}

function CardElement() {
  const [isEditing, setEditing] = useState(false)
  return(
    <div style={{paddingTop:'0.5rem'}}>
      {!isEditing && (
        <button onClick= {() => setEditing(true)} style={{type:'button', padding: '0.4rem', backgroundColor: 'transparent', color: '#5972ff', outline: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold'}}>Edit...</button>
        )}
        {isEditing && (
        <button onClick= {() => setEditing(false)} style={{type:'button', padding: '0.4rem', backgroundColor: 'transparent', color: '#5972ff', outline: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold'}}>Submit Changes</button>
        )}
        {isEditing && (
        <button onClick= {() => setEditing(false)} style={{type:'button', padding: '0.4rem', backgroundColor: 'transparent', color: '#ff5959', outline: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold'}}>Cancel</button>
        )}
      <div style={{display:'flex'}}>
        <div style = {{ padding:'0.5rem', maxWidth:'20%', wordWrap:'break-word'}}>
          <p style={{fontWeight: 'bold'}}>Card Number:</p>
          {!isEditing && ( 
          <p>1234567</p>
          )}
          {isEditing && ( 
          <div>
            <input type='text' placeholder= 'Card No.' required={false} style={{width:'100%', boxSizing:'border-box'}}></input>
          </div>
          )}
        </div>
        <div style = {{ padding:'0.5rem', maxWidth:'20%', wordWrap:'break-word'}}>
          <p style={{fontWeight: 'bold'}}>Expiration Date:</p>
          {!isEditing && ( 
          <p>1234567</p>
          )}
          {isEditing && ( 
          <div>
            <input type='date' placeholder= 'Expiration Date' required={false} style={{width:'100%', boxSizing:'border-box'}}></input>
          </div>
          )}
        </div>
        <div style = {{ padding:'0.5rem', maxWidth:'20%', wordWrap:'break-word'}}>
          <p style={{fontWeight: 'bold'}}>CCV:</p>
          {!isEditing && ( 
          <p>223</p>
          )}
          {isEditing && ( 
          <div>
            <input type='number' placeholder= 'CCV/Security Code' required={false} style={{width:'100%', boxSizing:'border-box'}}></input>
          </div>
          )}
        </div>
        <div style = {{ padding:'0.5rem', maxWidth:'20%', wordWrap:'break-word'}}>
          <p style={{fontWeight: 'bold'}}>Name on card:</p>
          {!isEditing && ( 
          <p>John Doe</p>
          )}
          {isEditing && ( 
          <div>
            <input type='text' placeholder= 'Name on card' required={false} style={{width:'100%', boxSizing:'border-box'}}></input>
          </div>
          )}
        </div>
      </div>
    </div>
    
)}


