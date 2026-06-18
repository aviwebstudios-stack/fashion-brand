import { asyncHandler } from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} from './cart.service.js';

export const getMyCart = asyncHandler(async (req, res) => {
  const cart = await getCart(req.user.id);
  successResponse(res, 'Cart fetched successfully', cart);
});

export const addItemToCart = asyncHandler(async (req, res) => {
  const cart = await addToCart(req.user.id, req.body);
  successResponse(res, 'Item added to cart', cart);
});

export const updateItem = asyncHandler(async (req, res) => {
  const cart = await updateCartItem(req.user.id, req.params.itemId, req.body);
  successResponse(res, 'Cart updated successfully', cart);
});

export const removeItem = asyncHandler(async (req, res) => {
  const cart = await removeFromCart(req.user.id, req.params.itemId);
  successResponse(res, 'Item removed from cart', cart);
});