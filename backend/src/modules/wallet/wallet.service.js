import prisma from '../../config/db.js';
import https from 'https';

const generateReference = () => {
  return `WL-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

const initializePaystackPayment = async ({ email, amount, reference, metadata }) => {
  return new Promise((resolve, reject) => {
    const params = JSON.stringify({
      email,
      amount: amount * 100,
      reference,
      metadata,
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

// Get or create wallet
export const getWallet = async (userId) => {
  let wallet = await prisma.wallet.findUnique({
    where: { userId },
    include: {
      transactions: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });

  if (!wallet) {
    wallet = await prisma.wallet.create({
      data: { userId },
      include: { transactions: true },
    });
  }

  return wallet;
};

// Fund wallet
export const fundWallet = async (userId, { amount }) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const reference = generateReference();

  const response = await initializePaystackPayment({
    email: user.email,
    amount,
    reference,
    metadata: { userId, type: 'wallet_funding' },
  });

  if (!response.status) {
    throw { statusCode: 400, message: 'Payment initialization failed' };
  }

  return {
    authorizationUrl: response.data.authorization_url,
    reference,
    amount,
  };
};

// Verify wallet funding
export const verifyWalletFunding = async (userId, reference) => {
  const response = await verifyPaystackPayment(reference);

  if (!response.status || response.data.status !== 'success') {
    throw { statusCode: 400, message: 'Payment verification failed' };
  }

  const amount = response.data.amount / 100;

  // Get or create wallet
  let wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) {
    wallet = await prisma.wallet.create({ data: { userId } });
  }

  // Credit wallet
  await prisma.wallet.update({
    where: { userId },
    data: { balance: { increment: amount } },
  });

  await prisma.walletTransaction.create({
    data: {
      walletId: wallet.id,
      amount,
      type: 'CREDIT',
      reference,
      description: 'Wallet funding',
    },
  });

  return getWallet(userId);
};

// Pay with wallet
export const payWithWallet = async (userId, { amount, description }) => {
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) throw { statusCode: 404, message: 'Wallet not found' };
  if (wallet.balance < amount) throw { statusCode: 400, message: 'Insufficient wallet balance' };

  const reference = generateReference();

  await prisma.wallet.update({
    where: { userId },
    data: { balance: { decrement: amount } },
  });

  await prisma.walletTransaction.create({
    data: {
      walletId: wallet.id,
      amount,
      type: 'DEBIT',
      reference,
      description,
    },
  });

  return getWallet(userId);
};