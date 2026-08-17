import { verifyJwt } from '../auth/jwt.js';

export function authenticateToken(req, res, next) {
  const token = req.cookies?.accessToken;


  if (!token) {
    return res.status(401).json({ error: 'Missing authorization token ohho' });
  }

  try {
    req.user = verifyJwt(token);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
