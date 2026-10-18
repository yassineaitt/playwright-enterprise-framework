import type { Locator, Page } from '@playwright/test';

/**
 * Minimal base for page objects. It deliberately does NOT wrap Playwright's API:
 * page objects expose intention-revealing actions and locators, and tests assert
 * with `expect(locator)` so retries/auto-waiting stay in Playwright's hands.
 */
export abstract class BasePage {
  protected constructor(protected readonly page: Page) {}

  /** Relative path from baseURL this page lives at. */
  protected abstract readonly path: string;

  async goto(): Promise<this> {
    await this.page.goto(this.path);
    return this;
  }

  /** Expose the root locator for assertions on page-level state. */
  get root(): Locator {
    return this.page.locator('body');
  }
}
