import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import { adminOnly } from '../../middleware/admin.middleware.js';
import {
  placeOrder,
  getMyOrderList,
  getMyOrderById,
  adminGetAllOrders,
  adminUpdateOrderStatus,
} from './order.controller.js';

const router = Router();

// Customer routes
router.post('/', protect, placeOrder);
router.get('/my-orders', protect, getMyOrderList);
router.get('/my-orders/:id', protect, getMyOrderById);

// Admin routes
router.get('/', protect, adminOnly, adminGetAllOrders);
router.patch('/:id/status', protect, adminOnly, adminUpdateOrderStatus);

export default router;