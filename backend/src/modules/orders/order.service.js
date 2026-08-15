import prisma from '../../config/db.js';
import { clearCart } from '../cart/cart.service.js';
import { sendEmail } from '../../utils/sendEmail.js';

const STATUS_MESSAGES = {
  PENDING: 'Your order has been received and is pending payment.',
  PAID: 'Your payment has been confirmed.',
  PROCESSING: 'Your order is being processed and prepared for shipment.',
  SHIPPED: 'Your order has been shipped and is on its way to you.',
  DELIVERED: 'Your order has been delivered. We hope you love it!',
  CANCELLED: 'Your order has been cancelled.',
};

export const createOrder = async (userId, { deliveryAddress }) => {
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
            select: { id: true, name: true, images: true },
          },
        },
      },
    },
  });

  await prisma.orderStatusHistory.create({
    data: {
      orderId: order.id,
      status: 'PENDING',
      note: STATUS_MESSAGES.PENDING,
    },
  });

  for (const item of cart.items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } },
    });
  }

  await clearCart(userId);
  return order;
};

export const getMyOrders = async (userId) => {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: { select: { id: true, name: true, images: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return orders;
};

export const getOrderById = async (userId, orderId) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: {
      items: {
        include: {
          product: { select: { id: true, name: true, images: true } },
        },
      },
      statusHistory: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!order) throw { statusCode: 404, message: 'Order not found' };
  return order;
};

export const getAllOrders = async () => {
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: {
        include: {
          product: { select: { id: true, name: true, images: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return orders;
};

export const updateOrderStatus = async (orderId, { status }) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true },
  });
  if (!order) throw { statusCode: 404, message: 'Order not found' };

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  const note = STATUS_MESSAGES[status] || `Your order status has been updated to ${status}.`;

  await prisma.orderStatusHistory.create({
    data: { orderId, status, note },
  });

  try {
    await sendEmail({
      to: order.user.email,
      subject: `Order Update: ${status.charAt(0) + status.slice(1).toLowerCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hi ${order.user.name},</h2>
          <p>${note}</p>
          <p>Order ID: ${order.id}</p>
          <p>Thank you for shopping with Favy Atelier.</p>
        </div>
      `,
    });
  } catch (emailError) {
    console.error('Order status email failed:', emailError.message);
  }

  return updated;
};