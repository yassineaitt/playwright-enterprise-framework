import { BookingIdListSchema, BookingSchema, CreatedBookingSchema } from '@api/schemas';
import { expectJson } from '@api/http';
import { buildBooking } from '@data/bookings';
import { expect, test } from '@fixtures/api.fixtures';

test.describe('Booking CRUD', { tag: ['@api', '@smoke'] }, () => {
  test('creates a booking and echoes it back with an id', async ({ createBooking }) => {
    const payload = buildBooking();

    const created = await createBooking(payload);

    expect(created.booking).toEqual(payload);
    expect(created.bookingid).toBeGreaterThan(0);
  });

  test('reads a booking by id', async ({ api, booking }) => {
    const res = await api.get(booking.bookingid);

    const body = await expectJson(res, 200, BookingSchema);
    expect(body).toEqual(booking.booking);
  });

  test('lists booking ids filtered by name', async ({ api, booking }) => {
    const { firstname, lastname } = booking.booking;

    const res = await api.list({ firstname, lastname });

    const ids = await expectJson(res, 200, BookingIdListSchema);
    expect(ids).toContainEqual({ bookingid: booking.bookingid });
  });

  test('fully updates a booking with PUT', async ({ authedApi, booking }) => {
    const updated = buildBooking({ totalprice: 999, depositpaid: false });

    const res = await authedApi.update(booking.bookingid, updated);

    const body = await expectJson(res, 200, BookingSchema);
    expect(body).toEqual(updated);
  });

  test('partially updates a booking with PATCH', async ({ authedApi, api, booking }) => {
    const res = await authedApi.patch(booking.bookingid, { firstname: 'Patched' });
    const body = await expectJson(res, 200, BookingSchema);
    expect(body).toEqual({ ...booking.booking, firstname: 'Patched' });

    const after = await expectJson(await api.get(booking.bookingid), 200, BookingSchema);
    expect(after.firstname).toBe('Patched');
  });

  test('deletes a booking and subsequent reads return 404', async ({
    authedApi,
    api,
    createBooking,
  }) => {
    const { bookingid } = await createBooking();

    const del = await authedApi.delete(bookingid);
    expect(del.status(), 'restful-booker answers 201 on delete').toBe(201);

    const after = await api.get(bookingid);
    expect(after.status()).toBe(404);
  });

  test('created booking matches the full response contract', async ({ api }) => {
    const res = await api.create(buildBooking());

    await expectJson(res, 200, CreatedBookingSchema);
  });
});
