import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import {
  getMyCart,
  addItemToCart,
  updateItem,
  removeItem,
} from './cart.controller.js';

const router = Router();

router.get('/', protect, getMyCart);
router.post('/', protect, addItemToCart);
router.patch('/:itemId', protect, updateItem);
router.delete('/:itemId', protect, removeItem);

export default router;