import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET || 'change-this-secret';
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1h';

function isTokenPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  const data = payload;
  return (
    typeof data.id === 'string' &&
    typeof data.email === 'string' &&
    (data.role === 'user' || data.role === 'admin')
  );
}

export function signJwt(payload) {
  const options = { expiresIn: jwtExpiresIn };
  return jwt.sign(payload, jwtSecret, options);
}

export function verifyJwt(token) {
  const decoded = jwt.verify(token, jwtSecret);

  if (!isTokenPayload(decoded)) {
    throw new Error('Invalid JWT payload');
  }

  return decoded;
}
