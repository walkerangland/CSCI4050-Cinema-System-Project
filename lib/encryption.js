import crypto from 'crypto'

//32 bit key to encrypt using AES-256 algorithm
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-encryption-key-32-bytes-lon'
//initial vector length. AES-CBC requires a 16 byte IV
const IV_LENGTH = 16

export function encrypt(text) {
  if (!text) return ''
  const iv = crypto.randomBytes(IV_LENGTH) // Generate a random initialization vector
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv) // Create the cipher
  let encrypted = cipher.update(text) // Encrypt the text
  encrypted = Buffer.concat([encrypted, cipher.final()])  // Append the final block
  return iv.toString('hex') + ':' + encrypted.toString('hex') // Return the IV and encrypted text
}

export function decrypt(text) {
  if (!text) return ''
  try {
    let textParts = text.split(':') // Split the IV and encrypted text
    let iv = Buffer.from(textParts.shift(), 'hex')  // Get the IV
    let encryptedText = Buffer.from(textParts.join(':'), 'hex') // Get the encrypted text
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv)  // Create the decipher
    let decrypted = decipher.update(encryptedText)  // Decrypt the text
    decrypted = Buffer.concat([decrypted, decipher.final()])  // Append the final block
    return decrypted.toString() // Return the decrypted text
  } catch (e) {
    return text 
  }
}