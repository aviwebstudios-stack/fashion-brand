import { Router } from 'express';
import { authLimiter } from '../../middleware/rateLimiter.middleware.js';
import {
  contact,
  academyInterest,
  newsletterSignup,
  newsletterUnsubscribe,
} from './inquiries.controller.js';

const router = Router();

router.post('/contact', authLimiter, contact);
router.post('/academy-interest', authLimiter, academyInterest);
router.post('/newsletter', authLimiter, newsletterSignup);
router.post('/newsletter/unsubscribe', authLimiter, newsletterUnsubscribe);

export default router;
