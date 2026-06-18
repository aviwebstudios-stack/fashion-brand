import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import { createError } from './error.middleware.js';

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(createError('Not authorized, no token', 401));
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        isVerified: true,
      },
    });

    if (!user) return next(createError('User not found', 404));
    if (!user.isActive) return next(createError('Account suspended', 403));

    req.user = user;
    next();
  } catch (error) {
    next(createError('Not authorized, invalid token', 401));
  }
};