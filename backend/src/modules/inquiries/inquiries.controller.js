import { asyncHandler } from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';
import {
  submitContactMessage,
  submitAcademyInterest,
  submitNewsletterSignup,
  unsubscribeNewsletter,
  getAllContactMessages,
  getAllAcademyInquiries,
  getAllNewsletterSubscribers,
} from './inquiries.service.js';

export const contact = asyncHandler(async (req, res) => {
  const result = await submitContactMessage(req.body);
  successResponse(res, result.message);
});

export const academyInterest = asyncHandler(async (req, res) => {
  const result = await submitAcademyInterest(req.body);
  successResponse(res, result.message);
});

export const newsletterSignup = asyncHandler(async (req, res) => {
  const result = await submitNewsletterSignup(req.body);
  successResponse(res, result.message);
});

export const newsletterUnsubscribe = asyncHandler(async (req, res) => {
  const result = await unsubscribeNewsletter(req.body);
  successResponse(res, result.message);
});

export const adminGetContactMessages = asyncHandler(async (req, res) => {
  const messages = await getAllContactMessages();
  successResponse(res, 'Contact messages fetched successfully', messages);
});

export const adminGetAcademyInquiries = asyncHandler(async (req, res) => {
  const inquiries = await getAllAcademyInquiries();
  successResponse(res, 'Academy inquiries fetched successfully', inquiries);
});

export const adminGetNewsletterSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await getAllNewsletterSubscribers();
  successResponse(res, 'Newsletter subscribers fetched successfully', subscribers);
});
