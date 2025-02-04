/**
 * Encrypts a plain text message using a simple base64 encoding (for demo purposes).
 * In a production environment, use proper encryption.
 */
export function encryptMessage(message: string): string {
  try {
    return btoa(message);
  } catch (error) {
    console.error('Encryption error:', error);
    return message;
  }
}

/**
 * Decrypts an encrypted message using base64 decoding (for demo purposes).
 * In a production environment, use proper decryption.
 */
export function decryptMessage(encryptedMessage: string): string {
  try {
    return atob(encryptedMessage);
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedMessage;
  }
}