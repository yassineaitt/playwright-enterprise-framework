import { z } from 'zod';

/**
 * Single source of truth for runtime configuration.
 * Values come from process.env (optionally loaded from .env by playwright.config.ts)
 * and are validated once at startup so misconfiguration fails fast, not mid-run.
 */
const EnvSchema = z.object({
  BASE_URL: z.url().default('https://demo.playwright.dev/todomvc'),
  API_BASE_URL: z.url().default('https://restful-booker.herokuapp.com'),
  API_USERNAME: z.string().min(1).default('admin'),
  API_PASSWORD: z.string().min(1).default('password123'),
  CI: z
    .string()
    .optional()
    .transform((v) => v !== undefined && v !== '' && v !== 'false'),
  HEADED: z
    .string()
    .optional()
    .transform((v) => v === '1' || v === 'true'),
});

export type Env = z.infer<typeof EnvSchema>;

export const env: Env = EnvSchema.parse(process.env);
