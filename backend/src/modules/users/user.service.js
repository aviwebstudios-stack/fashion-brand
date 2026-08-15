import bcrypt from 'bcrypt';
import prisma from '../../config/db.js';
import cloudinary from '../../config/cloudinary.js';

export const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      profileImage: true,
      isVerified: true,
      chest: true,
      waist: true,
      hips: true,
      height: true,
      weight: true,
      measurementsDetail: true,
      createdAt: true,
    },
  });

  if (!user) throw { statusCode: 404, message: 'User not found' };
  return user;
};

export const updateProfile = async (userId, { name, phone }) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { name, phone },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      profileImage: true,
    },
  });

  return user;
};

export const uploadProfilePicture = async (userId, file) => {
  if (!file) throw { statusCode: 400, message: 'No image provided' };

  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: 'fashion-brand/profiles',
        transformation: [{ width: 400, height: 400, crop: 'fill' }],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(file.buffer);
  });

  const user = await prisma.user.update({
    where: { id: userId },
    data: { profileImage: result.secure_url },
    select: {
      id: true,
      name: true,
      profileImage: true,
    },
  });

  return user;
};

export const updateMeasurements = async (userId, measurements) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: measurements,
    select: {
      id: true,
      name: true,
      chest: true,
      waist: true,
      hips: true,
      height: true,
      weight: true,
    },
  });

  return user;
};

export const updateMeasurementsDetail = async (userId, data) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { measurementsDetail: data },
    select: {
      id: true,
      measurementsDetail: true,
    },
  });

  return user;
};

export const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw { statusCode: 404, message: 'User not found' };

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw { statusCode: 400, message: 'Current password is incorrect' };

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { message: 'Password changed successfully' };
};

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isVerified: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return users;
};

export const suspendUser = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw { statusCode: 404, message: 'User not found' };

  await prisma.user.update({
    where: { id: userId },
    data: { isActive: false },
  });

  return { message: 'User suspended successfully' };
};

// Admin - reactivate user
export const reactivateUser = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw { statusCode: 404, message: 'User not found' };

  await prisma.user.update({
    where: { id: userId },
    data: { isActive: true },
  });

  return { message: 'User reactivated successfully' };
};

export const deleteUser = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw { statusCode: 404, message: 'User not found' };

  await prisma.user.delete({ where: { id: userId } });

  return { message: 'User deleted successfully' };
};