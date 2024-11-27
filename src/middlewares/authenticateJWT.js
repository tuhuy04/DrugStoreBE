import jwt from 'jsonwebtoken';
import { env } from '../configs/environment.js';
import { usersModel } from '../models/users.model.js';

const authenticateJWT = async (req, res, next) => {
  let token = req.headers.authorization;

  // Check if token exists
  if (!token) {
    console.error('Token is missing from the request.');
    return res.status(401).json({ message: 'No token, access denied.' });
  }

  console.log('Received token:', token);

  // Remove "Bearer " from token if present
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  console.log('Token after removing Bearer:', token);

  // Verify JWT token
  jwt.verify(token, env.APP_SECRET, async (err, decoded) => {
    if (err) {
      console.error('Invalid or expired token:', err.message);
      if (err.name === 'TokenExpiredError') {
        console.error('Token expired at:', err.expiredAt);
        return res.status(403).json({ message: 'Token has expired.' });
      }
      return res.status(403).json({ message: 'Invalid JWT.' });
    }

    console.log('Valid token. Decoded payload:', decoded);

    // Check user status from database
    const user = await usersModel.getById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    if (user.status === 0) {
      return res.status(403).json({ message: 'Account is blocked.' });
    }
      req.user = {
        userId: decoded.userId,
        email: user.email, // Attach the email here
        role: user.role
      };
  // Attach user info to request
    next(); // Proceed to the next middleware or route handler
  });
};

export default authenticateJWT;
