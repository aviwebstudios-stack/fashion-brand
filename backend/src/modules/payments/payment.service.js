import prisma from '../../config/db.js';
import https from 'https';
import { sendPaymentConfirmation, sendOrderConfirmation, sendBookingConfirmation } from '../../utils/sendEmail.js';
import { notifyAdmin } from '../settings/telegram.service.js';

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

const generateReference = () => {
  return `FB-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

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

export const verifyPayment = async (reference) => {
  const existingPayment = await prisma.payment.findUnique({ where: { reference } });
  if (!existingPayment) throw { statusCode: 404, message: 'Payment record not found' };
  if (existingPayment.status === 'PAID') {
    return { message: 'Payment already verified', data: { reference, alreadyProcessed: true } };
  }

  const response = await verifyPaystackPayment(reference);

  if (!response.status || response.data.status !== 'success') {
    await prisma.payment.update({ where: { reference }, data: { status: 'FAILED' } });
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

    await prisma.orderStatusHistory.create({
      data: {
        orderId: order.id,
        status: 'PROCESSING',
        note: 'Payment confirmed. Your order is being processed.',
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

    await notifyAdmin(
      `🛍️ <b>New Order</b>\n\nCustomer: ${order.user.name}\nTotal: ₦${order.total.toLocaleString()}\nItems: ${order.items.length}\nOrder ID: ${order.id}`
    );

  } else if (metadata.type === 'booking') {
    const booking = await prisma.booking.update({
      where: { id: metadata.bookingId },
      data: { paymentStatus: 'PAID', status: 'CONFIRMED' },
      include: {
        user: true,
        service: true,
      },
    });

    await prisma.bookingStatusHistory.create({
      data: {
        bookingId: booking.id,
        status: 'CONFIRMED',
        note: 'Payment confirmed. Your consultation booking is confirmed.',
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

    await notifyAdmin(
      `📅 <b>New Booking</b>\n\nCustomer: ${booking.user.name}\nService: ${booking.service.name}\nDate: ${new Date(booking.date).toLocaleDateString()} at ${booking.startTime}\nBooking ID: ${booking.id}`
    );
  }

  return { message: 'Payment verified successfully', data: response.data };
};

export const getMyPayments = async (userId) => {
  return prisma.payment.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

export const getAllPayments = async () => {
  return prisma.payment.findMany({
    orderBy: { createdAt: 'desc' },
  });
};