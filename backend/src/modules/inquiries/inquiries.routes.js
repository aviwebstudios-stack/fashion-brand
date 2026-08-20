import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import { adminOnly } from '../../middleware/admin.middleware.js';
import { authLimiter } from '../../middleware/rateLimiter.middleware.js';
import {
  contact,
  academyInterest,
  newsletterSignup,
  newsletterUnsubscribe,
  adminGetContactMessages,
  adminGetAcademyInquiries,
  adminGetNewsletterSubscribers,
} from './inquiries.controller.js';

const router = Router();

router.post('/contact', authLimiter, contact);
router.post('/academy-interest', authLimiter, academyInterest);
router.post('/newsletter', authLimiter, newsletterSignup);
router.post('/newsletter/unsubscribe', authLimiter, newsletterUnsubscribe);

router.get('/admin/contact', protect, adminOnly, adminGetContactMessages);
router.get('/admin/academy', protect, adminOnly, adminGetAcademyInquiries);
router.get('/admin/newsletter', protect, adminOnly, adminGetNewsletterSubscribers);

export default router;
