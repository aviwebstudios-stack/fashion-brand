import { asyncHandler } from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from './order.service.js';

export const placeOrder = asyncHandler(async (req, res) => {
  const order = await createOrder(req.user.id, req.body);
  successResponse(res, 'Order placed successfully', order, 201);
});

export const getMyOrderList = asyncHandler(async (req, res) => {
  const orders = await getMyOrders(req.user.id);
  successResponse(res, 'Orders fetched successfully', orders);
});

export const getMyOrderById = asyncHandler(async (req, res) => {
  const order = await getOrderById(req.user.id, req.params.id);
  successResponse(res, 'Order fetched successfully', order);
});

export const adminGetAllOrders = asyncHandler(async (req, res) => {
  const orders = await getAllOrders();
  successResponse(res, 'Orders fetched successfully', orders);
});

export const adminUpdateOrderStatus = asyncHandler(async (req, res) => {
  const order = await updateOrderStatus(req.params.id, req.body);
  successResponse(res, 'Order status updated successfully', order);
});