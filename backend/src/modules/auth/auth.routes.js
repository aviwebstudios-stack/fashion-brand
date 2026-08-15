import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware.js';
import { authLimiter, codeLimiter } from '../../middleware/rateLimiter.middleware.js';
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  resendCodeSchema,
  verifyResetCodeSchema,
} from './auth.validation.js';
import {
  register,
  verify,
  resendCode,
  login,
  forgot,
  reset,
  verifyReset,
} from './auth.controller.js';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/verify-email', codeLimiter, validate(verifyEmailSchema), verify);
router.post('/resend-code', codeLimiter, validate(resendCodeSchema), resendCode);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgot);
router.post('/verify-reset-code', codeLimiter, validate(verifyResetCodeSchema), verifyReset);
router.post('/reset-password', codeLimiter, validate(resetPasswordSchema), reset);

export default router;