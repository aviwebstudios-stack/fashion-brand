import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import { adminOnly } from '../../middleware/admin.middleware.js';
import { upload } from '../../middleware/upload.middleware.js';
import {
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  getAllProducts,
  getSingleProduct,
  getAllCategories,
  getAllCollections,
} from './product.controller.js';

const router = Router();

// Public routes
router.get('/', getAllProducts);
router.get('/categories', getAllCategories);
router.get('/collections', getAllCollections);
router.get('/:id', getSingleProduct);

// Admin routes
router.post('/', protect, adminOnly, upload.array('images', 5), adminCreateProduct);
router.patch('/:id', protect, adminOnly, upload.array('images', 5), adminUpdateProduct);
router.delete('/:id', protect, adminOnly, adminDeleteProduct);

export default router;