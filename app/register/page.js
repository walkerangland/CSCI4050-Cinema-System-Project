import styles from '../home.module.css'
import Form from 'next/form'


export default function RegisterPage() {
return (
    <div style={{textAlign:'center'}}>
      <Form id='registrationForm'>
      <h1 className={styles.heroTitle}>Register</h1>
      <InputField type = 'text' placeholder='First Name' required ={true}/>
      <InputField type = 'text' placeholder='Last Name' required ={true}/>
      <InputField type = 'email' placeholder='Email Address' required ={true}/>
      <InputField type = 'tel' placeholder='Phone Number' required ={true}/>
      <InputField type = 'password' placeholder='Password' required ={true}/>
      <InputField type = 'password' placeholder='Confirm Password' required ={true}/>
      <div className={styles.registerDiv}>
        <details>
          <summary>Home address (optional)</summary>
          <InputField type = 'text' placeholder='Street Address' required ={false}/>
          <div className={styles.registerDiv}>
            <input type="text" placeholder='City' size={7} required={false}></input>
            <input type="text" placeholder='State' size={7} required={false}></input>
          </div>
          <InputField type = 'text' placeholder='Apt No. (if applicable)  ' required ={false}/>
        </details>
      </div>
      <div className={styles.registerDiv}>
        <details >
          <summary>Credit Card #1 (optional)</summary>
          <InputField type = 'text' placeholder='Card No.' required ={false}/>
          <InputField type = 'text' placeholder='Expiration Date' required ={false}/>
          <InputField type = 'text' placeholder='CCV' required ={false}/>
          <div className={styles.registerDiv}>
            <input type="text" placeholder='Name on card' required={false}></input>
          </div>
        </details>
      </div>
      <div className={styles.registerDiv}>
        <details >
          <summary>Credit Card #2 (optional)</summary>
          <InputField type = 'text' placeholder='Card No.' required ={false}/>
          <InputField type = 'text' placeholder='Expiration Date' required ={false}/>
          <InputField type = 'text' placeholder='CCV' required ={false}/>
          <div className={styles.registerDiv}>
            <input type="text" placeholder='Name on card' required={false}></input>
          </div>
        </details>
      </div>
      <div className={styles.registerDiv}>
        <details >
          <summary>Credit Card #3 (optional)</summary>
          <InputField type = 'text' placeholder='Card No.' required ={false}/>
          <InputField type = 'text' placeholder='Expiration Date' required ={false}/>
          <InputField type = 'text' placeholder='CCV' required ={false}/>
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

function InputField({required, placeholder, type}) {
  if (required) {
  return(
    <div className={styles.registerDiv}>
      <input type={type} placeholder={placeholder} required={true} title ='* Required'></input>
      <RequiredAsterisk/>
    </div>
  )}
  else {
    return(
    <div className={styles.registerDiv}>
      <input type={type} placeholder={placeholder} required={false}></input>
    </div>
    )}
  }

function RequiredAsterisk() {
  return (
  <label>
    <span style={{color:'red', position:'absolute'}}>*</span>
  </label>
  )
}
