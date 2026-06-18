import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import { adminOnly } from '../../middleware/admin.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { upload } from '../../middleware/upload.middleware.js';
import {
  updateProfileSchema,
  updateMeasurementsSchema,
  changePasswordSchema,
} from './user.validation.js';
import {
  getMyProfile,
  updateMyProfile,
  uploadMyProfilePicture,
  updateMyMeasurements,
  changeMyPassword,
  adminGetAllUsers,
  adminSuspendUser,
  adminDeleteUser,
} from './user.controller.js';

const router = Router();

// Customer routes (protected)
router.get('/me', protect, getMyProfile);
router.patch('/me', protect, validate(updateProfileSchema), updateMyProfile);
router.patch('/me/picture', protect, upload.single('image'), uploadMyProfilePicture);
router.patch('/me/measurements', protect, validate(updateMeasurementsSchema), updateMyMeasurements);
router.patch('/me/password', protect, validate(changePasswordSchema), changeMyPassword);

// Admin routes
router.get('/', protect, adminOnly, adminGetAllUsers);
router.patch('/:id/suspend', protect, adminOnly, adminSuspendUser);
router.delete('/:id', protect, adminOnly, adminDeleteUser);

export default router;