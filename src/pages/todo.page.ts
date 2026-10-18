import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export type TodoFilter = 'All' | 'Active' | 'Completed';

/**
 * Page object for the TodoMVC demo (https://demo.playwright.dev/todomvc).
 *
 * Locator strategy, in priority order: test ids, ARIA roles/labels, then CSS.
 * Every locator is a lazy getter so it resolves fresh on each use.
 */
export class TodoPage extends BasePage {
  protected readonly path = '/';

  readonly newTodoInput: Locator;
  readonly items: Locator;
  readonly count: Locator;
  readonly toggleAll: Locator;
  readonly clearCompletedButton: Locator;
  readonly footer: Locator;
  readonly main: Locator;

  constructor(page: Page) {
    super(page);
    this.newTodoInput = page.getByPlaceholder('What needs to be done?');
    this.items = page.getByTestId('todo-item');
    this.count = page.getByTestId('todo-count');
    this.toggleAll = page.getByLabel('Mark all as complete');
    this.clearCompletedButton = page.getByRole('button', { name: 'Clear completed' });
    this.footer = page.locator('.footer');
    this.main = page.locator('.main');
  }

  // ---- actions -----------------------------------------------------------

  async addTodo(title: string): Promise<void> {
    await this.newTodoInput.fill(title);
    await this.newTodoInput.press('Enter');
  }

  async addTodos(titles: readonly string[]): Promise<void> {
    for (const title of titles) {
      await this.addTodo(title);
    }
  }

  item(title: string): Locator {
    return this.items.filter({ hasText: title });
  }

  itemTitle(item: Locator): Locator {
    return item.getByTestId('todo-title');
  }

  async toggle(title: string): Promise<void> {
    await this.item(title).getByRole('checkbox').check();
  }

  async untoggle(title: string): Promise<void> {
    await this.item(title).getByRole('checkbox').uncheck();
  }

  async edit(title: string, newTitle: string): Promise<void> {
    const item = this.item(title);
    await item.dblclick();
    const editBox = item.getByRole('textbox', { name: 'Edit' });
    await editBox.fill(newTitle);
    await editBox.press('Enter');
  }

  async remove(title: string): Promise<void> {
    const item = this.item(title);
    await item.hover();
    await item.getByRole('button', { name: 'Delete' }).click();
  }

  async filterBy(filter: TodoFilter): Promise<void> {
    await this.page.getByRole('link', { name: filter }).click();
  }

  async clearCompleted(): Promise<void> {
    await this.clearCompletedButton.click();
  }

  async reload(): Promise<void> {
    await this.page.reload();
  }

  // ---- state helpers (for assertions, no hidden waits) --------------------

  activeFilterLink(): Locator {
    return this.page.locator('.filters a.selected');
  }

  /** Reads todos persisted by the app in localStorage. */
  async storedTodos(): Promise<{ title: string; completed: boolean }[]> {
    return this.page.evaluate(() => {
      const raw = window.localStorage.getItem('react-todos') ?? '[]';
      return JSON.parse(raw) as { title: string; completed: boolean }[];
    });
  }
}
