import prisma from '../../config/db.js';
import { clearCart } from '../cart/cart.service.js';

// Create order from cart
export const createOrder = async (userId, { deliveryAddress }) => {
  // Get cart
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw { statusCode: 400, message: 'Cart is empty' };
  }

  // Validate stock and calculate total
  let total = 0;
  for (const item of cart.items) {
    if (!item.product.isAvailable) {
      throw { statusCode: 400, message: `${item.product.name} is no longer available` };
    }
    if (item.product.stock < item.quantity) {
      throw { statusCode: 400, message: `Insufficient stock for ${item.product.name}` };
    }
    total += item.product.price * item.quantity;
  }

  // Create order with items
  const order = await prisma.order.create({
    data: {
      userId,
      total,
      deliveryAddress,
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
          price: item.product.price,
        })),
      },
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: true,
            },
          },
        },
      },
    },
  });

  // Reduce stock
  for (const item of cart.items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } },
    });
  }

  // Clear cart
  await clearCart(userId);

  return order;
};

// Get my orders
export const getMyOrders = async (userId) => {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return orders;
};

// Get single order
export const getOrderById = async (userId, orderId) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: true,
            },
          },
        },
      },
    },
  });

  if (!order) throw { statusCode: 404, message: 'Order not found' };
  return order;
};

// Admin - get all orders
export const getAllOrders = async () => {
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return orders;
};

// Admin - update order status
export const updateOrderStatus = async (orderId, { status }) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw { statusCode: 404, message: 'Order not found' };

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  return updated;
};