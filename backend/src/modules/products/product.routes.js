import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import { adminOnly } from '../../middleware/admin.middleware.js';
import { upload } from '../../middleware/upload.middleware.js';
import {
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminRemoveProductImage,
  adminGetAllProducts,
  getAllProducts,
  getSingleProduct,
  getAllCategories,
  getAllCollections,
} from './product.controller.js';

const router = Router();

router.get('/', getAllProducts);
router.get('/categories', getAllCategories);
router.get('/collections', getAllCollections);
router.get('/admin/all', protect, adminOnly, adminGetAllProducts);
router.get('/:id', getSingleProduct);

router.post('/', protect, adminOnly, upload.array('images', 5), adminCreateProduct);
router.patch('/:id', protect, adminOnly, upload.array('images', 5), adminUpdateProduct);
router.delete('/:id', protect, adminOnly, adminDeleteProduct);
router.delete('/:id/images', protect, adminOnly, adminRemoveProductImage);

export default router;
