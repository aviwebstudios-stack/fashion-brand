import prisma from '../../config/db.js';
import { sendEmail } from '../../utils/sendEmail.js';

const STATUS_MESSAGES = {
  PENDING: 'Your consultation booking has been received and is pending payment.',
  CONFIRMED: 'Your consultation booking has been confirmed.',
  CANCELLED: 'Your consultation booking has been cancelled.',
  COMPLETED: 'Your consultation has been completed. Thank you for visiting Favy Atelier.',
  NO_SHOW: 'You were marked as a no-show for your scheduled consultation.',
};

export const createService = async (data) => {
  const service = await prisma.consultationService.create({ data });
  return service;
};

export const updateService = async (serviceId, data) => {
  const service = await prisma.consultationService.findUnique({ where: { id: serviceId } });
  if (!service) throw { statusCode: 404, message: 'Service not found' };
  return prisma.consultationService.update({ where: { id: serviceId }, data });
};

export const deleteService = async (serviceId) => {
  const service = await prisma.consultationService.findUnique({ where: { id: serviceId } });
  if (!service) throw { statusCode: 404, message: 'Service not found' };
  await prisma.consultationService.delete({ where: { id: serviceId } });
  return { message: 'Service deleted successfully' };
};

export const getAllServices = async () => {
  return prisma.consultationService.findMany({
    where: { isAvailable: true },
    orderBy: { createdAt: 'desc' },
  });
};

export const getServiceById = async (serviceId) => {
  const service = await prisma.consultationService.findUnique({
    where: { id: serviceId },
    include: { availability: true },
  });
  if (!service) throw { statusCode: 404, message: 'Service not found' };
  return service;
};

export const setAvailability = async (serviceId, { availability }) => {
  const service = await prisma.consultationService.findUnique({ where: { id: serviceId } });
  if (!service) throw { statusCode: 404, message: 'Service not found' };

  await prisma.availability.deleteMany({ where: { serviceId } });
  await prisma.availability.createMany({
    data: availability.map((a) => ({ ...a, serviceId })),
  });

  return prisma.consultationService.findUnique({
    where: { id: serviceId },
    include: { availability: true },
  });
};

export const getAvailableSlots = async (serviceId, date) => {
  const service = await prisma.consultationService.findUnique({
    where: { id: serviceId },
    include: { availability: true },
  });
  if (!service) throw { statusCode: 404, message: 'Service not found' };

  const selectedDate = new Date(date);
  const dayOfWeek = selectedDate.getDay();

  const dayAvailability = service.availability.find(
    (a) => a.dayOfWeek === dayOfWeek && a.isAvailable
  );

  if (!dayAvailability) {
    return { slots: [], message: 'No availability on this day' };
  }

  const slots = [];
  const [startHour, startMin] = dayAvailability.startTime.split(':').map(Number);
  const [endHour, endMin] = dayAvailability.endTime.split(':').map(Number);

  let current = startHour * 60 + startMin;
  const end = endHour * 60 + endMin;

  while (current + service.duration <= end) {
    const hours = Math.floor(current / 60).toString().padStart(2, '0');
    const mins = (current % 60).toString().padStart(2, '0');
    slots.push(`${hours}:${mins}`);
    current += service.duration;
  }

  const existingBookings = await prisma.booking.findMany({
    where: {
      serviceId,
      date: {
        gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
        lte: new Date(new Date(date).setHours(23, 59, 59, 999)),
      },
      status: { notIn: ['CANCELLED'] },
    },
  });

  const bookedSlots = existingBookings.map((b) => b.startTime);
  const availableSlots = slots.filter((slot) => !bookedSlots.includes(slot));

  return { slots: availableSlots, date, serviceId };
};

export const createBooking = async (userId, { serviceId, date, startTime, notes }) => {
  const service = await prisma.consultationService.findUnique({ where: { id: serviceId } });
  if (!service) throw { statusCode: 404, message: 'Service not found' };
  if (!service.isAvailable) throw { statusCode: 400, message: 'Service is not available' };

  const { slots } = await getAvailableSlots(serviceId, date);
  if (!slots.includes(startTime)) {
    throw { statusCode: 400, message: 'This time slot is not available' };
  }

  const [hours, mins] = startTime.split(':').map(Number);
  const endMinutes = hours * 60 + mins + service.duration;
  const endHours = Math.floor(endMinutes / 60).toString().padStart(2, '0');
  const endMins = (endMinutes % 60).toString().padStart(2, '0');
  const endTime = `${endHours}:${endMins}`;

  try {
    const booking = await prisma.booking.create({
      data: {
        userId,
        serviceId,
        date: new Date(date),
        startTime,
        endTime,
        notes,
        total: service.price,
      },
      include: {
        service: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    await prisma.bookingStatusHistory.create({
      data: {
        bookingId: booking.id,
        status: 'PENDING',
        note: STATUS_MESSAGES.PENDING,
      },
    });

    return booking;
  } catch (err) {
    if (err.code === 'P2002') {
      throw { statusCode: 409, message: 'This time slot was just booked by someone else. Please pick another.' };
    }
    throw err;
  }
};

export const getMyBookings = async (userId) => {
  return prisma.booking.findMany({
    where: { userId },
    include: { service: true },
    orderBy: { createdAt: 'desc' },
  });
};

export const getBookingById = async (userId, bookingId) => {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, userId },
    include: {
      service: true,
      statusHistory: { orderBy: { createdAt: 'asc' } },
    },
  });
  if (!booking) throw { statusCode: 404, message: 'Booking not found' };
  return booking;
};

export const cancelBooking = async (userId, bookingId) => {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, userId },
  });
  if (!booking) throw { statusCode: 404, message: 'Booking not found' };
  if (booking.status === 'CANCELLED') {
    throw { statusCode: 400, message: 'Booking already cancelled' };
  }
  if (booking.status === 'COMPLETED') {
    throw { statusCode: 400, message: 'Cannot cancel a completed booking' };
  }

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: 'CANCELLED' },
  });

  await prisma.bookingStatusHistory.create({
    data: {
      bookingId,
      status: 'CANCELLED',
      note: STATUS_MESSAGES.CANCELLED,
    },
  });

  return updated;
};

export const getAllBookings = async () => {
  return prisma.booking.findMany({
    include: {
      service: true,
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const updateBookingStatus = async (bookingId, { status }) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { user: true, service: true },
  });
  if (!booking) throw { statusCode: 404, message: 'Booking not found' };

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });

  const note = STATUS_MESSAGES[status] || `Your booking status has been updated to ${status}.`;

  await prisma.bookingStatusHistory.create({
    data: { bookingId, status, note },
  });

  try {
    await sendEmail({
      to: booking.user.email,
      subject: `Booking Update: ${status.charAt(0) + status.slice(1).toLowerCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hi ${booking.user.name},</h2>
          <p>${note}</p>
          <p>Service: ${booking.service.name}</p>
          <p>Date: ${new Date(booking.date).toLocaleDateString()} at ${booking.startTime}</p>
          <p>Thank you for choosing Favy Atelier.</p>
        </div>
      `,
    });
  } catch (emailError) {
    console.error('Booking status email failed:', emailError.message);
  }

  return updated;
};