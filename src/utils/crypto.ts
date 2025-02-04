// Simple synchronous encryption/decryption for demo purposes
// In production, use proper encryption methods
export const encryptMessage = (message: string): string => {
  try {
    return btoa(message);
  } catch (error) {
    console.error('Encryption error:', error);
    return message;
  }
};

export const decryptMessage = (encryptedMessage: string): string => {
  try {
    return atob(encryptedMessage);
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedMessage;
  }
};