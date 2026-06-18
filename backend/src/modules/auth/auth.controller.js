import { asyncHandler } from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';
import {
  registerUser,
  verifyEmail,
  resendVerificationCode,
  loginUser,
  forgotPassword,
  resetPassword,
} from './auth.service.js';

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);
  successResponse(res, result.message, null, 201);
});

export const verify = asyncHandler(async (req, res) => {
  const result = await verifyEmail(req.body);
  successResponse(res, result.message);
});

export const resendCode = asyncHandler(async (req, res) => {
  const result = await resendVerificationCode(req.body);
  successResponse(res, result.message);
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  successResponse(res, result.message, { token: result.token, user: result.user });
});

export const forgot = asyncHandler(async (req, res) => {
  const result = await forgotPassword(req.body);
  successResponse(res, result.message);
});

export const reset = asyncHandler(async (req, res) => {
  const result = await resetPassword(req.body);
  successResponse(res, result.message);
});