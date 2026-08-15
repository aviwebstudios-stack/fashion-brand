import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import { adminOnly } from '../../middleware/admin.middleware.js';
import {
  getConnectLink,
  verifyConnection,
  disconnectTelegram,
  getTelegramStatus,
} from './telegram.controller.js';

const router = Router();

router.get('/connect-link', protect, adminOnly, getConnectLink);
router.get('/check-connection', protect, adminOnly, verifyConnection);
router.post('/disconnect', protect, adminOnly, disconnectTelegram);
router.get('/status', protect, adminOnly, getTelegramStatus);

export default router;