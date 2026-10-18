import { test as base, expect } from '@playwright/test';
import { BookingClient } from '@api/booking.client';
import { CreatedBookingSchema } from '@api/schemas';
import type { Booking, CreatedBooking } from '@api/schemas';
import { buildBooking } from '@data/bookings';
import { parseAs } from '@api/http';
import { env } from '@utils/env';

interface ApiFixtures {
  /** Unauthenticated client (reads + create). */
  api: BookingClient;
  /** Client holding a valid token (update/delete). */
  authedApi: BookingClient;
  /** A booking created before the test and deleted after it, whatever the outcome. */
  booking: CreatedBooking;
  /** Factory that tracks every booking it creates and cleans up at teardown. */
  createBooking: (overrides?: Partial<Booking>) => Promise<CreatedBooking>;
}

export const test = base.extend<ApiFixtures>({
  api: async ({ request }, use) => {
    await use(new BookingClient(request));
  },

  authedApi: async ({ request }, use) => {
    const client = new BookingClient(request);
    const res = await client.authenticate(env.API_USERNAME, env.API_PASSWORD);
    expect(res.status(), 'authentication against the sandbox should succeed').toBe(200);
    await use(client);
  },

  createBooking: async ({ api, authedApi }, use) => {
    const created: number[] = [];
    await use(async (overrides = {}) => {
      const res = await api.create(buildBooking(overrides));
      expect(res.status()).toBe(200);
      const body = await parseAs(res, CreatedBookingSchema);
      created.push(body.bookingid);
      return body;
    });
    // Teardown: best-effort cleanup so the public sandbox is left as found.
    await Promise.allSettled(created.map((id) => authedApi.delete(id)));
  },

  booking: async ({ createBooking }, use) => {
    await use(await createBooking());
  },
});

export { expect };
