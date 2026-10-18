import { BookingSchema } from '@api/schemas';
import { expectJson } from '@api/http';
import { buildBooking } from '@data/bookings';
import { expect, test } from '@fixtures/api.fixtures';

test.describe('Booking – negative paths', { tag: ['@api', '@regression'] }, () => {
  test('GET unknown id returns 404', async ({ api }) => {
    const res = await api.get(2_147_483_000);

    expect(res.status()).toBe(404);
  });

  test('PUT without a token is forbidden', async ({ api, booking }) => {
    const res = await api.update(booking.bookingid, buildBooking());

    expect(res.status()).toBe(403);
  });

  test('PUT with an invalid token is forbidden', async ({ api, booking }) => {
    const res = await api.withToken('0000000000deadbeef').update(booking.bookingid, buildBooking());

    expect(res.status()).toBe(403);
  });

  test('DELETE without a token is forbidden and leaves the booking intact', async ({
    api,
    booking,
  }) => {
    const res = await api.delete(booking.bookingid);
    expect(res.status()).toBe(403);

    const still = await expectJson(await api.get(booking.bookingid), 200, BookingSchema);
    expect(still).toEqual(booking.booking);
  });

  test('POST with a missing required field is rejected', async ({ api }) => {
    const { firstname, ...incomplete } = buildBooking();
    expect(firstname).toBeTruthy();

    const res = await api.createRaw(incomplete);

    expect(res.status()).toBe(500);
  });

  test('POST with a non-JSON body is rejected', async ({ request }) => {
    const res = await request.post('/booking', {
      headers: { 'Content-Type': 'text/plain' },
      data: 'not json',
    });

    expect([400, 415, 500]).toContain(res.status());
  });
});
