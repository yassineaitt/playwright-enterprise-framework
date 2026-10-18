import { DEFAULT_TODOS, uniqueTitle } from '@data/todos';
import { expect, test } from '@fixtures/ui.fixtures';

test.describe('TodoMVC – regression', { tag: ['@regression', '@ui'] }, () => {
  test.describe('creating', () => {
    test('trims whitespace from the title', async ({ todoPage }) => {
      await todoPage.addTodo('    trimmed title    ');

      await expect(todoPage.items).toHaveText(['trimmed title']);
    });

    test('hides main and footer sections when there are no todos', async ({ todoPage }) => {
      await expect(todoPage.main).toBeHidden();
      await expect(todoPage.footer).toBeHidden();

      await todoPage.addTodo(uniqueTitle());

      await expect(todoPage.main).toBeVisible();
      await expect(todoPage.footer).toBeVisible();
    });
  });

  test.describe('editing', () => {
    test('renames a todo', async ({ todoPage }) => {
      await todoPage.addTodos(DEFAULT_TODOS);

      await todoPage.edit(DEFAULT_TODOS[1], 'buy some sausages');

      await expect(todoPage.items).toHaveText([
        DEFAULT_TODOS[0],
        'buy some sausages',
        DEFAULT_TODOS[2],
      ]);
    });

    test('removes a todo when the edited title is empty', async ({ todoPage }) => {
      await todoPage.addTodos(DEFAULT_TODOS);

      await todoPage.edit(DEFAULT_TODOS[1], '');

      await expect(todoPage.items).toHaveText([DEFAULT_TODOS[0], DEFAULT_TODOS[2]]);
    });

    test('cancels the edit on Escape', async ({ todoPage, page }) => {
      await todoPage.addTodos(DEFAULT_TODOS);
      const item = todoPage.item(DEFAULT_TODOS[1]);

      await item.dblclick();
      await item.getByRole('textbox', { name: 'Edit' }).fill('discarded change');
      await page.keyboard.press('Escape');

      await expect(todoPage.items).toHaveText([...DEFAULT_TODOS]);
    });
  });

  test.describe('bulk actions', () => {
    test('toggle-all completes and re-activates every todo', async ({ todoPage }) => {
      await todoPage.addTodos(DEFAULT_TODOS);

      await todoPage.toggleAll.check();
      await expect(todoPage.items).toHaveClass(['completed', 'completed', 'completed']);

      await todoPage.toggleAll.uncheck();
      await expect(todoPage.items).toHaveClass(['', '', '']);
    });

    test('clear completed removes only completed todos', async ({ todoPage }) => {
      await todoPage.addTodos(DEFAULT_TODOS);
      await todoPage.toggle(DEFAULT_TODOS[1]);

      await todoPage.clearCompleted();

      await expect(todoPage.items).toHaveText([DEFAULT_TODOS[0], DEFAULT_TODOS[2]]);
      await expect(todoPage.clearCompletedButton).toBeHidden();
    });
  });

  test.describe('filtering', () => {
    test.beforeEach(async ({ todoPage }) => {
      await todoPage.addTodos(DEFAULT_TODOS);
      await todoPage.toggle(DEFAULT_TODOS[1]);
    });

    test('shows only active todos', async ({ todoPage }) => {
      await todoPage.filterBy('Active');

      await expect(todoPage.items).toHaveText([DEFAULT_TODOS[0], DEFAULT_TODOS[2]]);
      await expect(todoPage.activeFilterLink()).toHaveText('Active');
    });

    test('shows only completed todos', async ({ todoPage }) => {
      await todoPage.filterBy('Completed');

      await expect(todoPage.items).toHaveText([DEFAULT_TODOS[1]]);
      await expect(todoPage.activeFilterLink()).toHaveText('Completed');
    });

    test('filter is reflected in the URL and survives back navigation', async ({
      todoPage,
      page,
    }) => {
      await todoPage.filterBy('Completed');
      await expect(page).toHaveURL(/#\/completed$/);

      await page.goBack();
      await expect(page).toHaveURL(/#\/?$/);
      await expect(todoPage.items).toHaveCount(3);
    });
  });

  test.describe('persistence', () => {
    test('keeps todos and completion state across a reload', async ({ todoPage }) => {
      await todoPage.addTodos(DEFAULT_TODOS);
      await todoPage.toggle(DEFAULT_TODOS[0]);

      await expect.poll(() => todoPage.storedTodos()).toHaveLength(3);
      await todoPage.reload();

      await expect(todoPage.items).toHaveText([...DEFAULT_TODOS]);
      await expect(todoPage.item(DEFAULT_TODOS[0])).toHaveClass(/completed/);
      await expect(todoPage.count).toHaveText('2 items left');
    });
  });
});
