import { createError } from './error.middleware.js';

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    next(createError('Access denied. Admins only.', 403));
  }
};