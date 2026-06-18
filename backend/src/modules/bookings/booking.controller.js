import { asyncHandler } from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';
import {
  createService,
  updateService,
  deleteService,
  getAllServices,
  getServiceById,
  setAvailability,
  getAvailableSlots,
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
} from './booking.service.js';

// Services
export const adminCreateService = asyncHandler(async (req, res) => {
  const service = await createService(req.body);
  successResponse(res, 'Service created successfully', service, 201);
});

export const adminUpdateService = asyncHandler(async (req, res) => {
  const service = await updateService(req.params.id, req.body);
  successResponse(res, 'Service updated successfully', service);
});

export const adminDeleteService = asyncHandler(async (req, res) => {
  const result = await deleteService(req.params.id);
  successResponse(res, result.message);
});

export const getServices = asyncHandler(async (req, res) => {
  const services = await getAllServices();
  successResponse(res, 'Services fetched successfully', services);
});

export const getService = asyncHandler(async (req, res) => {
  const service = await getServiceById(req.params.id);
  successResponse(res, 'Service fetched successfully', service);
});

export const adminSetAvailability = asyncHandler(async (req, res) => {
  const service = await setAvailability(req.params.id, req.body);
  successResponse(res, 'Availability set successfully', service);
});

export const getSlots = asyncHandler(async (req, res) => {
  const { date } = req.query;
  if (!date) throw { statusCode: 400, message: 'Date is required' };
  const slots = await getAvailableSlots(req.params.id, date);
  successResponse(res, 'Slots fetched successfully', slots);
});

// Bookings
export const bookConsultation = asyncHandler(async (req, res) => {
  const booking = await createBooking(req.user.id, req.body);
  successResponse(res, 'Booking created successfully', booking, 201);
});

export const getMyBookingList = asyncHandler(async (req, res) => {
  const bookings = await getMyBookings(req.user.id);
  successResponse(res, 'Bookings fetched successfully', bookings);
});

export const getMyBooking = asyncHandler(async (req, res) => {
  const booking = await getBookingById(req.user.id, req.params.id);
  successResponse(res, 'Booking fetched successfully', booking);
});

export const cancelMyBooking = asyncHandler(async (req, res) => {
  const booking = await cancelBooking(req.user.id, req.params.id);
  successResponse(res, 'Booking cancelled successfully', booking);
});

export const adminGetAllBookings = asyncHandler(async (req, res) => {
  const bookings = await getAllBookings();
  successResponse(res, 'Bookings fetched successfully', bookings);
});

export const adminUpdateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await updateBookingStatus(req.params.id, req.body);
  successResponse(res, 'Booking status updated successfully', booking);
});