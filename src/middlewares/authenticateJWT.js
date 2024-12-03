import jwt from 'jsonwebtoken';
import { env } from '../configs/environment.js';
import { usersModel } from '../models/users.model.js';

const authenticateJWT = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'No token, access denied.' });
  }

  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  try {
    const decoded = jwt.verify(token, env.APP_SECRET);

    // Check user status from the database
    const user = await usersModel.getById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.status === 0) {
      return res.status(403).json({ message: 'Account is blocked.' });
    }

    req.user = {
      userId: decoded.userId,
      email: user.email,
      role: user.role
    };

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      try {
        // Look for refresh token in the request
        const refreshToken = req.headers['x-refresh-token'];

        if (!refreshToken) {
          return res.status(401).json({ message: 'No refresh token provided.' });
        }

        // Verify refresh token
        const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_SECRET || 'refreshSecretKey');

        const user = await usersModel.getById(decodedRefresh.userId);

        if (!user) {
          return res.status(404).json({ message: 'User not found.' });
        }

        if (user.status === 0) {
          return res.status(403).json({ message: 'Account is blocked.' });
        }

        const payload = {
          userId: user.id,
          name: user.name,
          role: user.role,
          email: user.email,
          status: user.status,
        };

        // Generate new access token
        const newAccessToken = jwt.sign(payload, process.env.APP_SECRET || 'defaultSecretKey', {
          expiresIn: '120m',
        });

        // Send new access token in response header
        res.setHeader('X-New-Access-Token', newAccessToken);

        req.user = {
          userId: user.id,
          email: user.email,
          role: user.role
        };

        next();
      } catch (refreshError) {
        return res.status(403).json({ 
          message: 'Invalid refresh token. Please login again.',
          requireLogin: true
        });
      }
    } else {
      return res.status(403).json({ message: 'Invalid token' });
    }
  }
};



export default authenticateJWT;