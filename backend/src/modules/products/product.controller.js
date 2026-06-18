import { asyncHandler } from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getCategories,
  getCollections,
} from './product.service.js';

export const adminCreateProduct = asyncHandler(async (req, res) => {
  // Parse numbers from form data
  req.body.price = parseFloat(req.body.price);
  req.body.stock = parseInt(req.body.stock);
  if (req.body.sizes && typeof req.body.sizes === 'string') {
    req.body.sizes = req.body.sizes.split(',').map((s) => s.trim());
  }

  const product = await createProduct(req.body, req.files);
  successResponse(res, 'Product created successfully', product, 201);
});

export const adminUpdateProduct = asyncHandler(async (req, res) => {
  if (req.body.price) req.body.price = parseFloat(req.body.price);
  if (req.body.stock) req.body.stock = parseInt(req.body.stock);
  if (req.body.sizes && typeof req.body.sizes === 'string') {
    req.body.sizes = req.body.sizes.split(',').map((s) => s.trim());
  }

  const product = await updateProduct(req.params.id, req.body, req.files);
  successResponse(res, 'Product updated successfully', product);
});

export const adminDeleteProduct = asyncHandler(async (req, res) => {
  const result = await deleteProduct(req.params.id);
  successResponse(res, result.message);
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const result = await getProducts(req.query);
  successResponse(res, 'Products fetched successfully', result);
});

export const getSingleProduct = asyncHandler(async (req, res) => {
  const product = await getProductById(req.params.id);
  successResponse(res, 'Product fetched successfully', product);
});

export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await getCategories();
  successResponse(res, 'Categories fetched successfully', categories);
});

export const getAllCollections = asyncHandler(async (req, res) => {
  const collections = await getCollections();
  successResponse(res, 'Collections fetched successfully', collections);
});