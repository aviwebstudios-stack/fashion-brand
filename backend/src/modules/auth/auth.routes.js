import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware.js';
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  resendCodeSchema,
} from './auth.validation.js';
import {
  register,
  verify,
  resendCode,
  login,
  forgot,
  reset,
} from './auth.controller.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/verify-email', validate(verifyEmailSchema), verify);
router.post('/resend-code', validate(resendCodeSchema), resendCode);
router.post('/login', validate(loginSchema), login);
router.post('/forgot-password', validate(forgotPasswordSchema), forgot);
router.post('/reset-password', validate(resetPasswordSchema), reset);

export default router;