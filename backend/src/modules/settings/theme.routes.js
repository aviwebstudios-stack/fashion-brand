import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import { adminOnly } from '../../middleware/admin.middleware.js';
import { getThemeSettings, updateThemeSettings } from './theme.controller.js';

const router = Router();

// Public — every visitor needs the current theme to render the site
router.get('/', getThemeSettings);

// Admin only — changing the theme
router.patch('/', protect, adminOnly, updateThemeSettings);

export default router;