import prisma from '../../config/db.js';

// Admin - create consultation service
export const createService = async (data) => {
  const service = await prisma.consultationService.create({ data });
  return service;
};

// Admin - update service
export const updateService = async (serviceId, data) => {
  const service = await prisma.consultationService.findUnique({ where: { id: serviceId } });
  if (!service) throw { statusCode: 404, message: 'Service not found' };

  return prisma.consultationService.update({ where: { id: serviceId }, data });
};

// Admin - delete service
export const deleteService = async (serviceId) => {
  const service = await prisma.consultationService.findUnique({ where: { id: serviceId } });
  if (!service) throw { statusCode: 404, message: 'Service not found' };

  await prisma.consultationService.delete({ where: { id: serviceId } });
  return { message: 'Service deleted successfully' };
};

// Get all services (public)
export const getAllServices = async () => {
  return prisma.consultationService.findMany({
    where: { isAvailable: true },
    orderBy: { createdAt: 'desc' },
  });
};

// Get single service
export const getServiceById = async (serviceId) => {
  const service = await prisma.consultationService.findUnique({
    where: { id: serviceId },
    include: { availability: true },
  });
  if (!service) throw { statusCode: 404, message: 'Service not found' };
  return service;
};

// Admin - set availability
export const setAvailability = async (serviceId, { availability }) => {
  const service = await prisma.consultationService.findUnique({ where: { id: serviceId } });
  if (!service) throw { statusCode: 404, message: 'Service not found' };

  // Delete existing availability
  await prisma.availability.deleteMany({ where: { serviceId } });

  // Create new availability
  await prisma.availability.createMany({
    data: availability.map((a) => ({ ...a, serviceId })),
  });

  return prisma.consultationService.findUnique({
    where: { id: serviceId },
    include: { availability: true },
  });
};

// Get available time slots for a service on a date
export const getAvailableSlots = async (serviceId, date) => {
  const service = await prisma.consultationService.findUnique({
    where: { id: serviceId },
    include: { availability: true },
  });
  if (!service) throw { statusCode: 404, message: 'Service not found' };

  const selectedDate = new Date(date);
  const dayOfWeek = selectedDate.getDay();

  // Find availability for this day
  const dayAvailability = service.availability.find(
    (a) => a.dayOfWeek === dayOfWeek && a.isAvailable
  );

  if (!dayAvailability) {
    return { slots: [], message: 'No availability on this day' };
  }

  // Generate time slots based on service duration
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

  // Remove already booked slots
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

// Create booking
export const createBooking = async (userId, { serviceId, date, startTime, notes }) => {
  const service = await prisma.consultationService.findUnique({ where: { id: serviceId } });
  if (!service) throw { statusCode: 404, message: 'Service not found' };
  if (!service.isAvailable) throw { statusCode: 400, message: 'Service is not available' };

  // Check if slot is available
  const { slots } = await getAvailableSlots(serviceId, date);
  if (!slots.includes(startTime)) {
    throw { statusCode: 400, message: 'This time slot is not available' };
  }

  // Calculate end time
  const [hours, mins] = startTime.split(':').map(Number);
  const endMinutes = hours * 60 + mins + service.duration;
  const endHours = Math.floor(endMinutes / 60).toString().padStart(2, '0');
  const endMins = (endMinutes % 60).toString().padStart(2, '0');
  const endTime = `${endHours}:${endMins}`;

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
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return booking;
};

// Get my bookings
export const getMyBookings = async (userId) => {
  return prisma.booking.findMany({
    where: { userId },
    include: { service: true },
    orderBy: { createdAt: 'desc' },
  });
};

// Get single booking
export const getBookingById = async (userId, bookingId) => {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, userId },
    include: { service: true },
  });
  if (!booking) throw { statusCode: 404, message: 'Booking not found' };
  return booking;
};

// Cancel booking
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

  return prisma.booking.update({
    where: { id: bookingId },
    data: { status: 'CANCELLED' },
  });
};

// Admin - get all bookings
export const getAllBookings = async () => {
  return prisma.booking.findMany({
    include: {
      service: true,
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

// Admin - update booking status
export const updateBookingStatus = async (bookingId, { status }) => {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw { statusCode: 404, message: 'Booking not found' };

  return prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });
};