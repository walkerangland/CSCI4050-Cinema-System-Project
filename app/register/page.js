'use server'
import styles from '../home.module.css'
import Form from 'next/form'


export default async function RegisterPage() {
return (
    <div style={{textAlign:'center'}}>
      <Form id='registrationForm'>
      <h1 className={styles.heroTitle}>Register</h1>
      <div className={styles.registerDiv}>
        <input type="text" placeholder='First name' required={true}></input>
      </div>
      <div className={styles.registerDiv}>
        <input type="text" placeholder='Last name' required={true}></input>
      </div>
      <div className={styles.registerDiv}>
        <input type="text" placeholder='Email Address' required={true}></input>
      </div>
      <div className={styles.registerDiv}>
        <input type="text" placeholder='Phone Number' required={true}></input>
      </div>
      <div className={styles.registerDiv}>
        <input name= 'password' type="password" placeholder='Password' required={true}></input>
      </div>
      <div className={styles.registerDiv}>
        <input name= 'confirmPassword' type="password" placeholder='Confirm Password' required={true}></input>
      </div>
      <div className={styles.registerDiv}>
        <details >
          <summary>Home address (optional)</summary>
          <div className={styles.registerDiv}>
            <input type="text" placeholder='Street Address' required={false}></input>
          </div>
          <div className={styles.registerDiv}>
            <input type="text" placeholder='State' size={8} required={false}></input>
            <input type="text" placeholder='City' size={8} required={false}></input>
          </div>
          <div className={styles.registerDiv}>
            <input type="text" placeholder='Apartment # (if applicable)' required={false}></input>
          </div>
        </details>
      </div>
      <div className={styles.registerDiv}>
        <details >
          <summary>Credit Card Info (optional)</summary>
          <div className={styles.registerDiv}>
            <input type="text" placeholder='Card Number' required={false}></input>
          </div>
          <div className={styles.registerDiv}>
            <input type="text" placeholder='Expiration Date' required={false}></input>
          </div>
          <div className={styles.registerDiv}>
            <input type="text" placeholder='CCV' required={false}></input>
          </div>
          <div className={styles.registerDiv}>
            <input type="text" placeholder='Name on card' required={false}></input>
          </div>
        </details>
      </div>
      <div className={styles.registerDiv}>
        <input type="submit" placeholder='Submit Registration'></input>
        
      </div>
      </Form>

    </div>
)
}
