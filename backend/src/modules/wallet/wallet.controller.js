import { asyncHandler } from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';
import {
  getWallet,
  fundWallet,
  verifyWalletFunding,
  payWithWallet,
  issueRefund,
} from './wallet.service.js';

export const getMyWallet = asyncHandler(async (req, res) => {
  const wallet = await getWallet(req.user.id);
  successResponse(res, 'Wallet fetched successfully', wallet);
});

export const fundMyWallet = asyncHandler(async (req, res) => {
  const result = await fundWallet(req.user.id, req.body);
  successResponse(res, 'Payment initialized', result);
});

export const verifyFunding = asyncHandler(async (req, res) => {
  const wallet = await verifyWalletFunding(req.user.id, req.params.reference);
  successResponse(res, 'Wallet funded successfully', wallet);
});

export const payFromWallet = asyncHandler(async (req, res) => {
  const wallet = await payWithWallet(req.user.id, req.body);
  successResponse(res, 'Payment successful', wallet);
});

export const adminIssueRefund = asyncHandler(async (req, res) => {
  const wallet = await issueRefund(req.body);
  successResponse(res, 'Refund issued successfully', wallet);
});
