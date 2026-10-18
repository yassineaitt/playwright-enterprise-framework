import type { Booking } from '@api/schemas';

let seq = 0;

function isoDate(daysFromNow: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}

/**
 * Builder for a valid booking with unique names so list filters can find exactly
 * this record even on a shared public sandbox.
 */
export function buildBooking(overrides: Partial<Booking> = {}): Booking {
  seq += 1;
  const stamp = `${Date.now().toString(36)}${seq}`;
  return {
    firstname: `Pw${stamp}`,
    lastname: `Enterprise${stamp}`,
    totalprice: 100 + seq,
    depositpaid: true,
    bookingdates: { checkin: isoDate(7), checkout: isoDate(10) },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}
