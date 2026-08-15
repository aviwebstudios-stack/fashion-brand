import multer from 'multer';
import cloudinary from '../../config/cloudinary.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';
import { getAllContent, updateContent } from './content.service.js';

const storage = multer.memoryStorage();
export const contentUpload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

export const getContentSettings = asyncHandler(async (req, res) => {
  const content = await getAllContent();
  successResponse(res, 'Content fetched successfully', content);
});

export const updateContentSettings = asyncHandler(async (req, res) => {
  const content = await updateContent(req.body);
  successResponse(res, 'Content updated successfully', content);
});

export const uploadContentMedia = asyncHandler(async (req, res) => {
  if (!req.file) throw { statusCode: 400, message: 'No file provided' };

  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: 'fashion-brand/content', resource_type: 'auto' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      )
      .end(req.file.buffer);
  });

  successResponse(res, 'Media uploaded successfully', { url: result.secure_url });
});