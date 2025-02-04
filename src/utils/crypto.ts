/**
 * Simple encryption/decryption utilities for demo purposes.
 * In production, use proper encryption methods.
 */

export function encryptMessage(message: string): string {
  try {
    return btoa(message);
  } catch (error) {
    console.error('Encryption error:', error);
    return message;
  }
}

export function decryptMessage(message: string): string {
  try {
    return atob(message);
  } catch (error) {
    console.error('Decryption error:', error);
    return message;
  }
}