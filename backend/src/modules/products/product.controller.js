import { asyncHandler } from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';
import {
  createProduct,
  getProducts,
  getAllProductsAdmin,
  getProductById,
  updateProduct,
  deleteProduct,
  removeProductImage,
  getCategories,
  getCollections,
} from './product.service.js';

export const adminCreateProduct = asyncHandler(async (req, res) => {
  req.body.price = parseFloat(req.body.price);
  req.body.stock = parseInt(req.body.stock);
  if (req.body.sizes && typeof req.body.sizes === 'string') {
    req.body.sizes = req.body.sizes.split(',').map((s) => s.trim());
  }
  if (typeof req.body.isAvailable === 'string') {
    req.body.isAvailable = req.body.isAvailable === 'true';
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
  if (typeof req.body.isAvailable === 'string') {
    req.body.isAvailable = req.body.isAvailable === 'true';
  }

  const product = await updateProduct(req.params.id, req.body, req.files);
  successResponse(res, 'Product updated successfully', product);
});

export const adminDeleteProduct = asyncHandler(async (req, res) => {
  const result = await deleteProduct(req.params.id);
  successResponse(res, result.message);
});

export const adminRemoveProductImage = asyncHandler(async (req, res) => {
  const product = await removeProductImage(req.params.id, req.body.imageUrl);
  successResponse(res, 'Image removed successfully', product);
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

export const adminGetAllProducts = asyncHandler(async (req, res) => {
  const result = await getAllProductsAdmin(req.query);
  successResponse(res, 'Products fetched successfully', result);
});
