import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import { adminOnly } from '../../middleware/admin.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import {
  createServiceSchema,
  updateServiceSchema,
  setAvailabilitySchema,
  createBookingSchema,
  updateBookingSchema,
} from './booking.validation.js';
import {
  adminCreateService,
  adminUpdateService,
  adminDeleteService,
  getServices,
  getService,
  adminSetAvailability,
  getSlots,
  bookConsultation,
  getMyBookingList,
  getMyBooking,
  cancelMyBooking,
  adminGetAllBookings,
  adminUpdateBookingStatus,
} from './booking.controller.js';

const router = Router();

// Public routes
router.get('/services', getServices);
router.get('/services/:id', getService);
router.get('/services/:id/slots', getSlots);

// Customer routes
router.post('/', protect, validate(createBookingSchema), bookConsultation);
router.get('/my-bookings', protect, getMyBookingList);
router.get('/my-bookings/:id', protect, getMyBooking);
router.patch('/my-bookings/:id/cancel', protect, cancelMyBooking);

// Admin routes
router.post('/services', protect, adminOnly, validate(createServiceSchema), adminCreateService);
router.patch('/services/:id', protect, adminOnly, validate(updateServiceSchema), adminUpdateService);
router.delete('/services/:id', protect, adminOnly, adminDeleteService);
router.post('/services/:id/availability', protect, adminOnly, validate(setAvailabilitySchema), adminSetAvailability);
router.get('/', protect, adminOnly, adminGetAllBookings);
router.patch('/:id/status', protect, adminOnly, validate(updateBookingSchema), adminUpdateBookingStatus);

export default router;