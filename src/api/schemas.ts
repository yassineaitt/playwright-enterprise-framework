import { z } from 'zod';

/**
 * Response contracts for restful-booker. Every API response passes through one of
 * these before a test touches it, so a contract drift fails loudly with a path to
 * the offending field instead of a vague `undefined` deep in an assertion.
 */
export const BookingDatesSchema = z.object({
  checkin: z.iso.date(),
  checkout: z.iso.date(),
});

export const BookingSchema = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  totalprice: z.number().int().nonnegative(),
  depositpaid: z.boolean(),
  bookingdates: BookingDatesSchema,
  additionalneeds: z.string().optional(),
});

export const CreatedBookingSchema = z.object({
  bookingid: z.number().int().positive(),
  booking: BookingSchema,
});

export const BookingIdSchema = z.object({ bookingid: z.number().int().positive() });
export const BookingIdListSchema = z.array(BookingIdSchema);

export const AuthTokenSchema = z.object({ token: z.string().regex(/^[a-f0-9]{15}$/) });
export const AuthFailureSchema = z.object({ reason: z.literal('Bad credentials') });

export type Booking = z.infer<typeof BookingSchema>;
export type BookingDates = z.infer<typeof BookingDatesSchema>;
export type CreatedBooking = z.infer<typeof CreatedBookingSchema>;
export type BookingId = z.infer<typeof BookingIdSchema>;
