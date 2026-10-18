import { test as base } from '@playwright/test';
import { TodoPage } from '@pages/todo.page';

interface UiFixtures {
  /** A TodoPage already navigated to the app root. */
  todoPage: TodoPage;
}

/**
 * UI fixture layer. Tests import `test` and `expect` from here, never from
 * @playwright/test directly, so new cross-cutting concerns (auth, feature flags,
 * network stubs) can be injected in one place.
 */
export const test = base.extend<UiFixtures>({
  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    await use(todoPage);
  },
});

export { expect } from '@playwright/test';
