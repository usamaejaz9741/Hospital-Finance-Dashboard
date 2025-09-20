/**
 * Browser-compatible cryptography utilities using Web Crypto API
 * 
 * This module provides secure cryptographic functions that work in browser environments
 * using the native Web Crypto API instead of Node.js crypto modules.
 * 
 * @module browserCrypto
 */

/**
 * Configuration for password hashing
 */
const HASH_CONFIG = {
  iterations: 100000,
  hash: 'SHA-256'
} as const;

/**
 * Converts an ArrayBuffer to a hex string
 */
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Hashes a password using Web Crypto API's SubtleCrypto
 * This is a browser-compatible replacement for bcrypt
 * 
 * @param password - The password to hash
 * @returns A Promise that resolves to the hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  // Create a random salt
  const salt = crypto.getRandomValues(new Uint8Array(16));
  
  // Convert password to buffer
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  // Combine salt and password
  const combined = new Uint8Array(salt.length + passwordBuffer.length);
  combined.set(salt);
  combined.set(passwordBuffer, salt.length);

  // Hash the combined buffer
  const hashBuffer = await crypto.subtle.digest(
    HASH_CONFIG.hash,
    combined
  );

  // Convert salt and hash to hex and combine
  const saltHex = bufferToHex(salt.buffer);
  const hashHex = bufferToHex(hashBuffer);
  
  return `${saltHex}:${hashHex}`;
}

/**
 * Verifies a password against its hash
 * 
 * @param password - The password to verify
 * @param storedHash - The stored hash to verify against
 * @returns A Promise that resolves to true if the password matches
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [storedSaltHex, hashHex] = storedHash.split(':');
  if (!storedSaltHex || !hashHex) {
    throw new Error('Invalid hash format');
  }

  const saltMatches = storedSaltHex.match(/.{2}/g);
  if (!saltMatches) {
    throw new Error('Invalid salt format');
  }

  // Convert hex salt back to buffer
  const salt = new Uint8Array(saltMatches.map(byte => parseInt(byte, 16)));
  
  // Convert password to buffer and combine with salt
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  const combined = new Uint8Array(salt.length + passwordBuffer.length);
  combined.set(salt);
  combined.set(passwordBuffer, salt.length);

  // Hash the combined buffer
  const hashBuffer = await crypto.subtle.digest(
    HASH_CONFIG.hash,
    combined
  );

  // Compare the hashes
  return bufferToHex(hashBuffer) === hashHex;
}