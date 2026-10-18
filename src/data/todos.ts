/**
 * Deterministic test data. Titles are prefixed so parallel workers sharing a browser
 * profile (they don't, but belt-and-braces) can never collide on identical text.
 */
let seq = 0;

export function uniqueTitle(prefix = 'todo'): string {
  seq += 1;
  return `${prefix}-${Date.now().toString(36)}-${seq}`;
}

export const DEFAULT_TODOS = [
  'buy some cheese',
  'feed the cat',
  'book a doctors appointment',
] as const;
