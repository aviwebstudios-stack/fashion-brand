import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import { adminOnly } from '../../middleware/admin.middleware.js';
import {
  getContentSettings,
  updateContentSettings,
  uploadContentMedia,
  contentUpload,
} from './content.controller.js';

const router = Router();

router.get('/', getContentSettings);
router.patch('/', protect, adminOnly, updateContentSettings);
router.post('/upload-media', protect, adminOnly, contentUpload.single('media'), uploadContentMedia);

export default router;