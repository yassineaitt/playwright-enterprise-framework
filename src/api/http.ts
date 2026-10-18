import type { APIResponse } from '@playwright/test';
import { expect } from '@playwright/test';
import type { ZodType } from 'zod';

/**
 * Parse a response body against a schema. On mismatch, throws an error listing
 * every offending field path so contract drift is diagnosable from the report.
 */
export async function parseAs<T>(response: APIResponse, schema: ZodType<T>): Promise<T> {
  const body: unknown = await response.json();
  const result = schema.safeParse(body);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.join('.') || '<root>'}: ${i.message}`)
      .join('\n');
    throw new Error(
      `Response from ${response.url()} did not match schema:\n${issues}\nBody: ${JSON.stringify(body)}`,
    );
  }
  return result.data;
}

/** Assert the status code, then parse. The common happy path in one call. */
export async function expectJson<T>(
  response: APIResponse,
  status: number,
  schema: ZodType<T>,
): Promise<T> {
  expect(response.status(), `unexpected status from ${response.url()}`).toBe(status);
  return parseAs(response, schema);
}
