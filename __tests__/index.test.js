import {
  render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import app from '@hexlet/react-todo-app-with-backend';
import userEvent from '@testing-library/user-event';
import preview from 'jest-preview';

import state from '../mock/state';

beforeEach(() => {
  render(app(state));
  preview.debug();
});

describe('todo app', () => {
  test('home page displays all the necessary elements', async () => {
    expect(screen.getByText(/Hexlet Todos/i)).toBeVisible();

    expect(screen.getByRole('heading', { name: /lists/i })).toBeVisible();
    expect(screen.getByRole('textbox', { name: /new list/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /add list/i })).toBeVisible();

    expect(screen.getByRole('heading', { name: /tasks/i })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Add' })).toBeVisible();
    expect(screen.getByText(/tasks list is empty/i)).toBeVisible();

    expect(screen.getByRole('textbox', { name: /new task/i })).toBeVisible();
  });

  test('task list', async () => {
    const addTaskButton = screen.getByRole('button', { name: 'Add' });
    const taskName = 'github';
    await userEvent.click(addTaskButton);

    expect(screen.getByText(/required!/i)).toBeVisible();

    await userEvent.type(screen.getByRole('textbox', { name: /new task/i }), taskName);
    await userEvent.click(addTaskButton);

    await waitFor(() => {
      expect(screen.getByRole('checkbox', { name: taskName })).toBeInTheDocument();
    });

    const checkbox = screen.getByRole('checkbox', { name: taskName });
    userEvent.click(checkbox);

    await waitFor(() => {
      expect(checkbox).toBeChecked();
    });

    userEvent.click(screen.getByRole('button', { name: /secondary/i }));

    await waitFor(() => {
      expect(screen.getByText(/tasks list is empty/i)).toBeVisible();
    });

    await userEvent.click(screen.getByRole('button', { name: /primary/i }));

    userEvent.click(screen.getByRole('button', { name: 'Remove' }));

    await waitFor(() => {
      expect(screen.getByText(/tasks list is empty/i)).toBeVisible();
    });
  });
});

describe('list with task lists', () => {
  test('duplicate list', async () => {
    await userEvent.type(screen.getByRole('textbox', { name: /new list/i }), 'primary');
    userEvent.click(screen.getByRole('button', { name: /add list/i }));

    await waitFor(() => {
      expect(screen.getByText(/primary already exists/i)).toBeInTheDocument();
    });
  });

  test('recreate list', async () => {
    userEvent.click(screen.getByRole('button', { name: /secondary/i }));
    await userEvent.type(screen.getByRole('textbox', { name: /new task/i }), 'secondary task');
    userEvent.click(screen.getByRole('button', { name: 'Add' }));

    await waitFor(() => {
      expect(screen.getByRole('checkbox', { name: 'secondary task' })).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole('button', { name: /remove list/i }));

    await waitFor(() => {
      expect(screen.queryByText('secondary')).toBeNull();
    });

    await userEvent.type(screen.getByRole('textbox', { name: /new list/i }), 'secondary');
    userEvent.click(screen.getByRole('button', { name: /add list/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /secondary/i })).toBeInTheDocument();
      expect(screen.getByText(/tasks list is empty/i)).toBeInTheDocument();
    });
  });
});
