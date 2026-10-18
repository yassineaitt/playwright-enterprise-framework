import { DEFAULT_TODOS } from '@data/todos';
import { expect, test } from '@fixtures/ui.fixtures';

test.describe('TodoMVC – smoke', { tag: ['@smoke', '@ui'] }, () => {
  test('creates a todo and shows it in the list', async ({ todoPage }) => {
    await todoPage.addTodo(DEFAULT_TODOS[0]);

    await expect(todoPage.items).toHaveText([DEFAULT_TODOS[0]]);
    await expect(todoPage.newTodoInput).toBeEmpty();
    await expect(todoPage.count).toHaveText('1 item left');
  });

  test('marks a todo as completed', async ({ todoPage }) => {
    await todoPage.addTodos(DEFAULT_TODOS);

    await todoPage.toggle(DEFAULT_TODOS[1]);

    await expect(todoPage.item(DEFAULT_TODOS[1])).toHaveClass(/completed/);
    await expect(todoPage.item(DEFAULT_TODOS[0])).not.toHaveClass(/completed/);
    await expect(todoPage.count).toHaveText('2 items left');
  });

  test('deletes a todo', async ({ todoPage }) => {
    await todoPage.addTodos(DEFAULT_TODOS);

    await todoPage.remove(DEFAULT_TODOS[0]);

    await expect(todoPage.items).toHaveText([DEFAULT_TODOS[1], DEFAULT_TODOS[2]]);
  });
});
