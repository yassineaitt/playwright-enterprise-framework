import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { Booking } from './schemas';

export type BookingFilter = Partial<
  Record<'firstname' | 'lastname' | 'checkin' | 'checkout', string>
>;

/**
 * Thin, typed client for restful-booker. It owns URL construction and auth
 * headers; it does NOT assert. Tests decide what "correct" means.
 *
 * Auth model (as implemented by the service): a token from POST /auth is sent as
 * `Cookie: token=<value>` on PUT/PATCH/DELETE.
 */
export class BookingClient {
  private token: string | undefined;

  constructor(private readonly request: APIRequestContext) {}

  // ---- auth --------------------------------------------------------------

  async authenticate(username: string, password: string): Promise<APIResponse> {
    const res = await this.request.post('/auth', { data: { username, password } });
    if (res.ok()) {
      const body = (await res.json()) as { token?: string };
      this.token = body.token;
    }
    return res;
  }

  /** Use a raw token (e.g. an invalid one) without calling /auth. */
  withToken(token: string | undefined): this {
    this.token = token;
    return this;
  }

  private authHeaders(): Record<string, string> {
    return this.token ? { Cookie: `token=${this.token}` } : {};
  }

  // ---- bookings ----------------------------------------------------------

  list(filter: BookingFilter = {}): Promise<APIResponse> {
    return this.request.get('/booking', { params: filter });
  }

  get(id: number): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`);
  }

  create(booking: Booking): Promise<APIResponse> {
    return this.request.post('/booking', { data: booking });
  }

  update(id: number, booking: Booking): Promise<APIResponse> {
    return this.request.put(`/booking/${id}`, { data: booking, headers: this.authHeaders() });
  }

  patch(id: number, partial: Partial<Booking>): Promise<APIResponse> {
    return this.request.patch(`/booking/${id}`, { data: partial, headers: this.authHeaders() });
  }

  delete(id: number): Promise<APIResponse> {
    return this.request.delete(`/booking/${id}`, { headers: this.authHeaders() });
  }

  /** Raw request for malformed-payload tests. */
  createRaw(body: unknown): Promise<APIResponse> {
    return this.request.post('/booking', { data: body });
  }
}
