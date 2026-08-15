import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import { adminOnly } from '../../middleware/admin.middleware.js';
import {
  getMyWallet,
  fundMyWallet,
  verifyFunding,
  payFromWallet,
  adminIssueRefund,
} from './wallet.controller.js';

const router = Router();

router.get('/', protect, getMyWallet);
router.post('/fund', protect, fundMyWallet);
router.get('/verify/:reference', protect, verifyFunding);
router.post('/pay', protect, payFromWallet);
router.post('/admin/refund', protect, adminOnly, adminIssueRefund);

export default router;
