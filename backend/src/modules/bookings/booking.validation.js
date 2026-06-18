import { z } from 'zod';

export const createServiceSchema = z.object({
  name: z.string().min(2, 'Service name is required'),
  description: z.string().min(10, 'Description is required'),
  price: z.number().positive('Price must be greater than 0'),
  duration: z.number().int().positive('Duration must be in minutes'),
});

export const updateServiceSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  price: z.number().positive().optional(),
  duration: z.number().int().positive().optional(),
  isAvailable: z.boolean().optional(),
});

export const setAvailabilitySchema = z.object({
  availability: z.array(z.object({
    dayOfWeek: z.number().int().min(0).max(6),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
    isAvailable: z.boolean().default(true),
  })),
});

export const createBookingSchema = z.object({
  serviceId: z.string().uuid('Invalid service ID'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
  notes: z.string().optional(),
});

export const updateBookingSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW']),
});