import { asyncHandler } from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';
import {
  initializeOrderPayment,
  initializeBookingPayment,
  verifyPayment,
  getMyPayments,
  getAllPayments,
} from './payment.service.js';

export const payForOrder = asyncHandler(async (req, res) => {
  const result = await initializeOrderPayment(req.user.id, req.params.orderId);
  successResponse(res, 'Payment initialized', result);
});

export const payForBooking = asyncHandler(async (req, res) => {
  const result = await initializeBookingPayment(req.user.id, req.params.bookingId);
  successResponse(res, 'Payment initialized', result);
});

export const verify = asyncHandler(async (req, res) => {
  const result = await verifyPayment(req.params.reference);
  successResponse(res, result.message, result.data);
});

export const getMyPaymentList = asyncHandler(async (req, res) => {
  const payments = await getMyPayments(req.user.id);
  successResponse(res, 'Payments fetched successfully', payments);
});

export const adminGetAllPayments = asyncHandler(async (req, res) => {
  const payments = await getAllPayments();
  successResponse(res, 'Payments fetched successfully', payments);
});