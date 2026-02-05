import crypto from 'crypto';

const API_KEY_BYTES = 32;
const API_KEY_ENCODING = 'hex' as const;

/**
 * Generates a cryptographically secure random API key.
 * Returned only once at issuance; store only the hash.
 */
export function generateApiKey(): string {
  return crypto.randomBytes(API_KEY_BYTES).toString(API_KEY_ENCODING);
}

/**
 * Returns a SHA-256 hash of the API key for storage.
 * Do not store the raw key in the database.
 */
export function hashApiKey(apiKey: string): string {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
}
