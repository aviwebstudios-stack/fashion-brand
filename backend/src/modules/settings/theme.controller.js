import { asyncHandler } from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';
import { getTheme, updateTheme } from './theme.service.js';

export const getThemeSettings = asyncHandler(async (req, res) => {
  const theme = await getTheme();
  successResponse(res, 'Theme fetched successfully', theme);
});

export const updateThemeSettings = asyncHandler(async (req, res) => {
  const theme = await updateTheme(req.body);
  successResponse(res, 'Theme updated successfully', theme);
});