
import crypto from 'crypto';

// Generate a 32-byte key and convert it to a hexadecimal string
const secretKey = crypto.randomBytes(32).toString('hex');

console.log(secretKey);
