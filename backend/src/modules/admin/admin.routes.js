import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import { adminOnly } from '../../middleware/admin.middleware.js';
import { dashboardStats, monthlyRevenue } from './admin.controller.js';

const router = Router();

router.get('/dashboard', protect, adminOnly, dashboardStats);
router.get('/revenue', protect, adminOnly, monthlyRevenue);

export default router;