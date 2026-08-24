import path from 'path';


import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/error.middleware.js';
import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/users/user.routes.js';
import productRoutes from './modules/products/product.routes.js';
import cartRoutes from './modules/cart/cart.routes.js';
import orderRoutes from './modules/orders/order.routes.js';
import bookingRoutes from './modules/bookings/booking.routes.js';
import paymentRoutes from './modules/payments/payment.routes.js';
import walletRoutes from './modules/wallet/wallet.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import telegramRoutes from './modules/settings/telegram.routes.js';
import inquiriesRoutes from './modules/inquiries/inquiries.routes.js';
import themeRoutes from './modules/settings/theme.routes.js';
import contentRoutes from './modules/settings/content.routes.js';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL.split(",").map(url => url.trim()),
  credentials: true
}));

app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/settings/telegram', telegramRoutes);
app.use('/api/inquiries', inquiriesRoutes);
app.use('/api/settings/theme', themeRoutes);
app.use('/api/settings/content', contentRoutes);

app.get('/', (req, res) => {
  res.json({
    message: '👗 Fashion Brand API is running',
    status: 'OK'
  });
});

app.use(errorHandler);

export default app;
