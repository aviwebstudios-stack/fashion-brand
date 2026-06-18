import { asyncHandler } from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';
import { getDashboardStats, getMonthlyRevenue } from './admin.service.js';

export const dashboardStats = asyncHandler(async (req, res) => {
  const stats = await getDashboardStats();
  successResponse(res, 'Dashboard stats fetched successfully', stats);
});

export const monthlyRevenue = asyncHandler(async (req, res) => {
  const revenue = await getMonthlyRevenue();
  successResponse(res, 'Monthly revenue fetched successfully', revenue);
});