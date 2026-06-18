import crypto from 'crypto';

export const generateVerificationCode = () => {
  // Generates a 6 digit code
  return crypto.randomInt(100000, 999999).toString();
};

export const generateCodeExpiry = () => {
  // Code expires in 15 minutes
  return new Date(Date.now() + 15 * 60 * 1000);
};