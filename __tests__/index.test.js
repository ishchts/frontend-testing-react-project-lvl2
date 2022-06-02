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

  test('actions with the task list', async () => {
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

    await userEvent.click(screen.getByRole('button', { name: 'Remove' }));

    expect(screen.getByText(/tasks list is empty/i)).toBeVisible();
  });
});
