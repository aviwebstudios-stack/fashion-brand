import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import {
  getMyWallet,
  fundMyWallet,
  verifyFunding,
  payFromWallet,
} from './wallet.controller.js';

const router = Router();

router.get('/', protect, getMyWallet);
router.post('/fund', protect, fundMyWallet);
router.get('/verify/:reference', protect, verifyFunding);
router.post('/pay', protect, payFromWallet);

export default router;