import prisma from '../../config/db.js';
import cloudinary from '../../config/cloudinary.js';

const uploadImages = async (files) => {
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'fashion-brand/products',
          transformation: [{ width: 800, height: 800, crop: 'fill' }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        }
      ).end(file.buffer);
    });
  });

  return Promise.all(uploadPromises);
};

export const createProduct = async (data, files) => {
  let images = [];
  if (files && files.length > 0) {
    images = await uploadImages(files);
  }

  const product = await prisma.product.create({
    data: {
      ...data,
      images,
    },
  });

  return product;
};

export const getProducts = async (query) => {
  const {
    search,
    category,
    collection,
    minPrice,
    maxPrice,
    size,
    page = 1,
    limit = 12,
  } = query;

  const where = {
    isAvailable: true,
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    }),
    ...(category && { category: { equals: category, mode: 'insensitive' } }),
    ...(collection && { collection: { equals: collection, mode: 'insensitive' } }),
    ...(minPrice || maxPrice ? {
      price: {
        ...(minPrice && { gte: parseFloat(minPrice) }),
        ...(maxPrice && { lte: parseFloat(maxPrice) }),
      },
    } : {}),
    ...(size && { sizes: { has: size } }),
  };

  const total = await prisma.product.count({ where });

  const products = await prisma.product.findMany({
    where,
    skip: (page - 1) * limit,
    take: parseInt(limit),
    orderBy: { createdAt: 'desc' },
  });

  return {
    products,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
    },
  };
};

export const getAllProductsAdmin = async (query) => {
  const { page = 1, limit = 20 } = query;

  const total = await prisma.product.count();
  const products = await prisma.product.findMany({
    skip: (page - 1) * limit,
    take: parseInt(limit),
    orderBy: { createdAt: 'desc' },
  });

  return {
    products,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
    },
  };
};

export const getProductById = async (productId) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) throw { statusCode: 404, message: 'Product not found' };
  return product;
};

export const updateProduct = async (productId, data, files) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw { statusCode: 404, message: 'Product not found' };

  let images = product.images;
  if (files && files.length > 0) {
    const newImages = await uploadImages(files);
    images = [...images, ...newImages];
  }

  const updated = await prisma.product.update({
    where: { id: productId },
    data: { ...data, images },
  });

  return updated;
};

export const deleteProduct = async (productId) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw { statusCode: 404, message: 'Product not found' };

  await prisma.product.delete({ where: { id: productId } });
  return { message: 'Product deleted successfully' };
};

// Admin - remove a single image from a product's gallery
export const removeProductImage = async (productId, imageUrl) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw { statusCode: 404, message: 'Product not found' };

  const updatedImages = product.images.filter((img) => img !== imageUrl);

  const updated = await prisma.product.update({
    where: { id: productId },
    data: { images: updatedImages },
  });

  return updated;
};

export const getCategories = async () => {
  const products = await prisma.product.findMany({
    select: { category: true },
    distinct: ['category'],
    where: { isAvailable: true },
  });

  return products.map((p) => p.category);
};

export const getCollections = async () => {
  const products = await prisma.product.findMany({
    select: { collection: true },
    distinct: ['collection'],
    where: {
      isAvailable: true,
      collection: { not: null },
    },
  });

  return products.map((p) => p.collection);
};
