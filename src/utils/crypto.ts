import * as CryptoJS from 'crypto';

// For demo purposes, we use a static secret key. In a real-world scenario,
// this key should be negotiated securely between clients.
const SECRET_KEY = 'super-secret-key';

/**
 * Encrypts a plain text message using AES encryption.
 * @param message - The plain text message.
 * @returns The encrypted message as a string.
 */
export function encryptMessage(message: string): string {
  const cipher = CryptoJS.createCipheriv('aes-256-cbc', SECRET_KEY, Buffer.alloc(16, 0));
  let encrypted = cipher.update(message, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

/**
 * Decrypts an AES-encrypted message.
 * @param cipherText - The encrypted message.
 * @returns The decrypted plain text.
 */
export function decryptMessage(cipherText: string): string {
  const decipher = CryptoJS.createDecipheriv('aes-256-cbc', SECRET_KEY, Buffer.alloc(16, 0));
  let decrypted = decipher.update(cipherText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}