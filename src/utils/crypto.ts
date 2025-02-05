
// Simple synchronous encryption/decryption for demo purposes
// In production, use proper encryption methods

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export const encryptMessage = (message: string): string => {
  try {
    const encoded = textEncoder.encode(message);
    return btoa(String.fromCharCode(...new Uint8Array(encoded)));
  } catch (error) {
    console.error('Encryption error:', error);
    return message;
  }
};

export const decryptMessage = (encryptedMessage: string): string => {
  try {
    const decoded = atob(encryptedMessage);
    const bytes = new Uint8Array(decoded.length);
    for (let i = 0; i < decoded.length; i++) {
      bytes[i] = decoded.charCodeAt(i);
    }
    return textDecoder.decode(bytes);
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedMessage;
  }
};
