import prisma from '../../config/db.js';

// Dashboard stats
export const getDashboardStats = async () => {
  const [
    totalUsers,
    totalOrders,
    totalBookings,
    totalProducts,
    pendingOrders,
    pendingBookings,
    lowStockProducts,
    recentOrders,
    recentBookings,
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.order.count(),
    prisma.booking.count(),
    prisma.product.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.booking.count({ where: { status: 'PENDING' } }),
    prisma.product.findMany({
      where: { stock: { lte: 5 }, isAvailable: true },
      select: { id: true, name: true, stock: true },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
      },
    }),
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        service: { select: { name: true } },
      },
    }),
  ]);

  // Calculate total revenue from paid orders and bookings
  const paidOrders = await prisma.order.aggregate({
    where: { paymentStatus: 'PAID' },
    _sum: { total: true },
  });

  const paidBookings = await prisma.booking.aggregate({
    where: { paymentStatus: 'PAID' },
    _sum: { total: true },
  });

  const totalRevenue = (paidOrders._sum.total || 0) + (paidBookings._sum.total || 0);

  return {
    stats: {
      totalUsers,
      totalOrders,
      totalBookings,
      totalProducts,
      pendingOrders,
      pendingBookings,
      totalRevenue,
    },
    lowStockProducts,
    recentOrders,
    recentBookings,
  };
};

// Revenue by month
export const getMonthlyRevenue = async () => {
  const orders = await prisma.order.findMany({
    where: { paymentStatus: 'PAID' },
    select: { total: true, createdAt: true },
  });

  const bookings = await prisma.booking.findMany({
    where: { paymentStatus: 'PAID' },
    select: { total: true, createdAt: true },
  });

  const monthlyData = {};

  [...orders, ...bookings].forEach((item) => {
    const month = new Date(item.createdAt).toLocaleString('default', {
      month: 'short',
      year: 'numeric',
    });
    monthlyData[month] = (monthlyData[month] || 0) + item.total;
  });

  return Object.entries(monthlyData).map(([month, revenue]) => ({
    month,
    revenue,
  }));
};