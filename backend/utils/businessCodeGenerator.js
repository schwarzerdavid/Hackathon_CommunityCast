import crypto from 'crypto';
import Business from '../models/Business.js';

/**
 * Generate a unique business code
 * Format: 8 alphanumeric characters (uppercase)
 */
export async function generateBusinessCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code;
  let isUnique = false;

  while (!isUnique) {
    code = '';
    for (let i = 0; i < 8; i++) {
      const randomIndex = crypto.randomInt(0, characters.length);
      code += characters[randomIndex];
    }

    // Check if code already exists
    const existing = await Business.findOne({ business_code: code });
    if (!existing) {
      isUnique = true;
    }
  }

  return code;
}
