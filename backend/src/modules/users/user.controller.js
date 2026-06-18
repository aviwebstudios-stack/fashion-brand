import { asyncHandler } from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';
import {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  updateMeasurements,
  changePassword,
  getAllUsers,
  suspendUser,
  deleteUser,
} from './user.service.js';

export const getMyProfile = asyncHandler(async (req, res) => {
  const user = await getProfile(req.user.id);
  successResponse(res, 'Profile fetched successfully', user);
});

export const updateMyProfile = asyncHandler(async (req, res) => {
  const user = await updateProfile(req.user.id, req.body);
  successResponse(res, 'Profile updated successfully', user);
});

export const uploadMyProfilePicture = asyncHandler(async (req, res) => {
  const user = await uploadProfilePicture(req.user.id, req.file);
  successResponse(res, 'Profile picture updated successfully', user);
});

export const updateMyMeasurements = asyncHandler(async (req, res) => {
  const user = await updateMeasurements(req.user.id, req.body);
  successResponse(res, 'Measurements updated successfully', user);
});

export const changeMyPassword = asyncHandler(async (req, res) => {
  const result = await changePassword(req.user.id, req.body);
  successResponse(res, result.message);
});

export const adminGetAllUsers = asyncHandler(async (req, res) => {
  const users = await getAllUsers();
  successResponse(res, 'Users fetched successfully', users);
});

export const adminSuspendUser = asyncHandler(async (req, res) => {
  const result = await suspendUser(req.params.id);
  successResponse(res, result.message);
});

export const adminDeleteUser = asyncHandler(async (req, res) => {
  const result = await deleteUser(req.params.id);
  successResponse(res, result.message);
});