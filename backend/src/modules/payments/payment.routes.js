import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import { adminOnly } from '../../middleware/admin.middleware.js';
import {
  payForOrder,
  payForBooking,
  verify,
  getMyPaymentList,
  adminGetAllPayments,
} from './payment.controller.js';

const router = Router();

// Customer routes
router.post('/order/:orderId', protect, payForOrder);
router.post('/booking/:bookingId', protect, payForBooking);
router.get('/verify/:reference', protect, verify);
router.get('/my-payments', protect, getMyPaymentList);

// Admin routes
router.get('/', protect, adminOnly, adminGetAllPayments);

export default router;