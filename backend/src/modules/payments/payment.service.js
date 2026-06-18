import prisma from '../../config/db.js';
import https from 'https';
import { sendPaymentConfirmation, sendOrderConfirmation, sendBookingConfirmation } from '../../utils/sendEmail.js';

// Initialize payment with Paystack
const initializePaystackPayment = async ({ email, amount, reference, metadata }) => {
  return new Promise((resolve, reject) => {
    const params = JSON.stringify({
      email,
      amount: amount * 100,
      reference,
      metadata,
      callback_url: `${process.env.CLIENT_URL}/payment/verify`,
    });

    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: '/transaction/initialize',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(JSON.parse(data)));
    });

    req.on('error', reject);
    req.write(params);
    req.end();
  });
};

// Verify payment with Paystack
const verifyPaystackPayment = async (reference) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: `/transaction/verify/${reference}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(JSON.parse(data)));
    });

    req.on('error', reject);
    req.end();
  });
};

// Generate unique reference
const generateReference = () => {
  return `FB-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

// Pay for order
export const initializeOrderPayment = async (userId, orderId) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { user: true },
  });

  if (!order) throw { statusCode: 404, message: 'Order not found' };
  if (order.paymentStatus === 'PAID') {
    throw { statusCode: 400, message: 'Order already paid' };
  }

  const reference = generateReference();

  const response = await initializePaystackPayment({
    email: order.user.email,
    amount: order.total,
    reference,
    metadata: { orderId, userId, type: 'order' },
  });

  if (!response.status) {
    throw { statusCode: 400, message: 'Payment initialization failed' };
  }

  await prisma.payment.create({
    data: {
      userId,
      amount: order.total,
      reference,
      metadata: { orderId, type: 'order' },
    },
  });

  await prisma.order.update({
    where: { id: orderId },
    data: { paymentRef: reference },
  });

  return {
    authorizationUrl: response.data.authorization_url,
    reference,
    amount: order.total,
  };
};

// Pay for booking
export const initializeBookingPayment = async (userId, bookingId) => {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, userId },
    include: { user: true },
  });

  if (!booking) throw { statusCode: 404, message: 'Booking not found' };
  if (booking.paymentStatus === 'PAID') {
    throw { statusCode: 400, message: 'Booking already paid' };
  }

  const reference = generateReference();

  const response = await initializePaystackPayment({
    email: booking.user.email,
    amount: booking.total,
    reference,
    metadata: { bookingId, userId, type: 'booking' },
  });

  if (!response.status) {
    throw { statusCode: 400, message: 'Payment initialization failed' };
  }

  await prisma.payment.create({
    data: {
      userId,
      amount: booking.total,
      reference,
      metadata: { bookingId, type: 'booking' },
    },
  });

  await prisma.booking.update({
    where: { id: bookingId },
    data: { paymentRef: reference },
  });

  return {
    authorizationUrl: response.data.authorization_url,
    reference,
    amount: booking.total,
  };
};

// Verify payment
export const verifyPayment = async (reference) => {
  const response = await verifyPaystackPayment(reference);

  if (!response.status || response.data.status !== 'success') {
    throw { statusCode: 400, message: 'Payment verification failed' };
  }

  const { metadata } = response.data;
  const amount = response.data.amount / 100;

  await prisma.payment.update({
    where: { reference },
    data: { status: 'PAID', channel: response.data.channel },
  });

  if (metadata.type === 'order') {
    const order = await prisma.order.update({
      where: { id: metadata.orderId },
      data: { paymentStatus: 'PAID', status: 'PROCESSING' },
      include: {
        user: true,
        items: {
          include: {
            product: { select: { name: true } },
          },
        },
      },
    });

    try {
      await sendPaymentConfirmation({
        name: order.user.name,
        email: order.user.email,
        amount,
        reference,
        type: 'Order Payment',
      });
      await sendOrderConfirmation({
        name: order.user.name,
        email: order.user.email,
        orderId: order.id,
        items: order.items,
        total: order.total,
        deliveryAddress: order.deliveryAddress,
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError.message);
    }

  } else if (metadata.type === 'booking') {
    const booking = await prisma.booking.update({
      where: { id: metadata.bookingId },
      data: { paymentStatus: 'PAID', status: 'CONFIRMED' },
      include: {
        user: true,
        service: true,
      },
    });

    try {
      await sendPaymentConfirmation({
        name: booking.user.name,
        email: booking.user.email,
        amount,
        reference,
        type: 'Booking Payment',
      });
      await sendBookingConfirmation({
        name: booking.user.name,
        email: booking.user.email,
        service: booking.service.name,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        total: booking.total,
        bookingId: booking.id,
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError.message);
    }
  }

  return { message: 'Payment verified successfully', data: response.data };
};

// Get my payments
export const getMyPayments = async (userId) => {
  return prisma.payment.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

// Admin - get all payments
export const getAllPayments = async () => {
  return prisma.payment.findMany({
    orderBy: { createdAt: 'desc' },
  });
};