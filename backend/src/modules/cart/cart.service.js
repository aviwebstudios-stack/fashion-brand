import prisma from '../../config/db.js';

// Get cart
export const getCart = async (userId) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              images: true,
              stock: true,
              isAvailable: true,
            },
          },
        },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: { items: true },
    });
  }

  // Calculate total
  const total = cart.items.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  return { ...cart, total };
};

// Add to cart
export const addToCart = async (userId, { productId, quantity, size }) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw { statusCode: 404, message: 'Product not found' };
  if (!product.isAvailable) throw { statusCode: 400, message: 'Product is not available' };
  if (product.stock < quantity) throw { statusCode: 400, message: 'Insufficient stock' };

  // Get or create cart
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  // Check if item already in cart
  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId, size },
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity, size },
    });
  }

  return getCart(userId);
};

// Update cart item
export const updateCartItem = async (userId, itemId, { quantity }) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw { statusCode: 404, message: 'Cart not found' };

  const item = await prisma.cartItem.findFirst({
    where: { id: itemId, cartId: cart.id },
  });
  if (!item) throw { statusCode: 404, message: 'Cart item not found' };

  if (quantity === 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
  } else {
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  return getCart(userId);
};

// Remove from cart
export const removeFromCart = async (userId, itemId) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw { statusCode: 404, message: 'Cart not found' };

  const item = await prisma.cartItem.findFirst({
    where: { id: itemId, cartId: cart.id },
  });
  if (!item) throw { statusCode: 404, message: 'Cart item not found' };

  await prisma.cartItem.delete({ where: { id: itemId } });
  return getCart(userId);
};

// Clear cart
export const clearCart = async (userId) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) return;

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
};