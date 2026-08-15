import bcrypt from 'bcrypt';
import prisma from '../../config/db.js';
import { generateToken } from '../../utils/generateToken.js';
import { generateVerificationCode, generateCodeExpiry } from '../../utils/generateCode.js';
import { sendEmail } from '../../utils/sendEmail.js';

export const registerUser = async ({ name, email, password, phone }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw { statusCode: 400, message: 'Email already registered' };

  const hashedPassword = await bcrypt.hash(password, 12);
  const code = generateVerificationCode();
  const expiry = generateCodeExpiry();

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
      role: 'CUSTOMER',
      verificationCode: code,
      verificationExpiry: expiry,
    },
  });

  await sendEmail({
    to: email,
    subject: 'Verify Your Email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Fashion Brand, ${name}!</h2>
        <p>Your verification code is:</p>
        <h1 style="color: #000; letter-spacing: 8px;">${code}</h1>
        <p>This code expires in 15 minutes.</p>
        <p>If you didn't create an account, ignore this email.</p>
      </div>
    `,
  });

  return { message: 'Registration successful. Please verify your email.' };
};

export const verifyEmail = async ({ email, code }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw { statusCode: 404, message: 'User not found' };
  if (user.isVerified) throw { statusCode: 400, message: 'Email already verified' };
  if (user.verificationCode !== code) throw { statusCode: 400, message: 'Invalid verification code' };
  if (new Date() > user.verificationExpiry) throw { statusCode: 400, message: 'Verification code expired' };

  await prisma.user.update({
    where: { email },
    data: { isVerified: true, verificationCode: null, verificationExpiry: null },
  });

  return { message: 'Email verified successfully. You can now login.' };
};

export const resendVerificationCode = async ({ email }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw { statusCode: 404, message: 'User not found' };
  if (user.isVerified) throw { statusCode: 400, message: 'Email already verified' };

  const code = generateVerificationCode();
  const expiry = generateCodeExpiry();

  await prisma.user.update({
    where: { email },
    data: { verificationCode: code, verificationExpiry: expiry },
  });

  await sendEmail({
    to: email,
    subject: 'New Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Verification Code</h2>
        <p>Your new verification code is:</p>
        <h1 style="color: #000; letter-spacing: 8px;">${code}</h1>
        <p>This code expires in 15 minutes.</p>
      </div>
    `,
  });

  return { message: 'New verification code sent to your email.' };
};

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw { statusCode: 400, message: 'Invalid email or password' };
  if (!user.isVerified) throw { statusCode: 400, message: 'Please verify your email first' };
  if (!user.isActive) throw { statusCode: 400, message: 'Account suspended. Contact support' };

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw { statusCode: 400, message: 'Invalid email or password' };

  const token = generateToken(user.id, user.role);

  return {
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
    },
  };
};

export const forgotPassword = async ({ email }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw { statusCode: 404, message: 'No account found with this email' };

  const code = generateVerificationCode();
  const expiry = generateCodeExpiry();

  await prisma.user.update({
    where: { email },
    data: { resetCode: code, resetCodeExpiry: expiry },
  });

  await sendEmail({
    to: email,
    subject: 'Password Reset Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Your password reset code is:</p>
        <h1 style="color: #000; letter-spacing: 8px;">${code}</h1>
        <p>This code expires in 15 minutes.</p>
        <p>If you didn't request this, ignore this email.</p>
      </div>
    `,
  });

  return { message: 'Password reset code sent to your email.' };
};

// Verify Reset Code (without resetting password yet)
export const verifyResetCode = async ({ email, code }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw { statusCode: 404, message: 'User not found' };
  if (!user.resetCode) throw { statusCode: 400, message: 'No reset request found. Please request a new code.' };
  if (user.resetCode !== code) throw { statusCode: 400, message: 'Invalid reset code' };
  if (new Date() > user.resetCodeExpiry) throw { statusCode: 400, message: 'Reset code expired' };

  return { message: 'Code verified successfully' };
};


export const resetPassword = async ({ email, code, newPassword }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw { statusCode: 404, message: 'User not found' };
  if (user.resetCode !== code) throw { statusCode: 400, message: 'Invalid reset code' };
  if (new Date() > user.resetCodeExpiry) throw { statusCode: 400, message: 'Reset code expired' };

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword, resetCode: null, resetCodeExpiry: null },
  });

  return { message: 'Password reset successful. You can now login.' };
};