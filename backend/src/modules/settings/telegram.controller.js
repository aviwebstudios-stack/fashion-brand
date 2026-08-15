import { asyncHandler } from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';
import {
  generateConnectLink,
  checkConnection,
  disconnect,
  getStatus,
} from './telegram.service.js';

export const getConnectLink = asyncHandler(async (req, res) => {
  const result = await generateConnectLink();
  successResponse(res, 'Connect link generated', result);
});

export const verifyConnection = asyncHandler(async (req, res) => {
  const result = await checkConnection();
  successResponse(res, 'Connection status checked', result);
});

export const disconnectTelegram = asyncHandler(async (req, res) => {
  const result = await disconnect();
  successResponse(res, result.message);
});

export const getTelegramStatus = asyncHandler(async (req, res) => {
  const result = await getStatus();
  successResponse(res, 'Status fetched', result);
});