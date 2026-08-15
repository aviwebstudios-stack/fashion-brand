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

  await prisma.payment.create({
    data: {
      userId,
      amount,
      reference,
      metadata: { type: 'wallet_funding' },
    },
  });

  return {
    authorizationUrl: response.data.authorization_url,
    reference,
    amount,
  };
};

export const verifyWalletFunding = async (userId, reference) => {
  const payment = await prisma.payment.findUnique({ where: { reference } });
  if (!payment) throw { statusCode: 404, message: 'Payment record not found' };
  if (payment.userId !== userId) throw { statusCode: 403, message: 'Not authorized for this payment' };
  if (payment.status === 'PAID') return getWallet(userId);

  const response = await verifyPaystackPayment(reference);

  if (!response.status || response.data.status !== 'success') {
    await prisma.payment.update({ where: { reference }, data: { status: 'FAILED' } });
    throw { statusCode: 400, message: 'Payment verification failed' };
  }

  const amount = response.data.amount / 100;

  await prisma.$transaction(async (tx) => {
    let wallet = await tx.wallet.findUnique({ where: { userId } });
    if (!wallet) {
      wallet = await tx.wallet.create({ data: { userId } });
    }

    await tx.wallet.update({
      where: { userId },
      data: { balance: { increment: amount } },
    });

    await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        amount,
        type: 'CREDIT',
        reference,
        description: 'Wallet funding',
      },
    });

    await tx.payment.update({
      where: { reference },
      data: { status: 'PAID', channel: response.data.channel },
    });
  });

  return getWallet(userId);
};

export const payWithWallet = async (userId, { amount, description }) => {
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) throw { statusCode: 404, message: 'Wallet not found' };
  if (wallet.balance < amount) throw { statusCode: 400, message: 'Insufficient wallet balance' };

  const reference = generateReference();

  await prisma.$transaction(async (tx) => {
    await tx.wallet.update({
      where: { userId },
      data: { balance: { decrement: amount } },
    });

    await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        amount,
        type: 'DEBIT',
        reference,
        description,
      },
    });
  });

  return getWallet(userId);
};

// Admin - issue a manual refund to a customer's wallet
export const issueRefund = async ({ userId, amount, description }) => {
  if (!userId || !amount || amount <= 0) {
    throw { statusCode: 400, message: 'A valid userId and amount are required' };
  }

  const reference = `REFUND-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

  await prisma.$transaction(async (tx) => {
    let wallet = await tx.wallet.findUnique({ where: { userId } });
    if (!wallet) {
      wallet = await tx.wallet.create({ data: { userId } });
    }

    await tx.wallet.update({
      where: { userId },
      data: { balance: { increment: amount } },
    });

    await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        amount,
        type: 'CREDIT',
        reference,
        description: description || 'Refund issued by admin',
      },
    });
  });

  return getWallet(userId);
};
