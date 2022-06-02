import { rest } from 'msw';
import uniqueId from 'lodash/uniqueId';

const getNextId = () => Number(uniqueId());

export default (context) => [
  rest.post('/api/v1/lists/:id/tasks', (req, res, ctx) => {
    const { text } = req.body;
    const task = {
      text,
      listId: Number(req.params.id),
      id: getNextId(),
      completed: false,
      touched: Date.now(),
    };
    context.tasks.push(task);
    return res(
      ctx.status(201),
      ctx.json(task),
    );
  }),
  rest.patch('/api/v1/tasks/:id', (req, res, ctx) => {
    const taskId = Number(req.params.id);
    const { completed } = req.body;
    const task = context.tasks.find((t) => t.id === taskId);
    task.completed = completed;
    task.touched = Date.now();
    return res(
      ctx.status(201),
      ctx.json(task),
    );
  }),
  rest.delete('/api/v1/tasks/:id', (req, res, ctx) => {
    const taskId = Number(req.params.id);
    context.tasks = context.tasks.filter((t) => t.id !== taskId);
    return res(
      ctx.status(204),
    );
  }),

  rest.post('/api/v1/lists', (req, res, ctx) => {
    const { name } = req.body;
    const list = {
      name,
      removable: true,
      id: getNextId(),
    };
    context.lists.push(list);
    return res(
      ctx.status(201),
      ctx.json(list),
    );
  }),
  rest.delete('/api/v1/lists/:id', (req, res, ctx) => {
    const listId = Number(req.params.id);
    context.lists = context.lists.filter((l) => l.id !== listId);
    context.tasks = context.tasks.filter((t) => t.listId !== listId);
    return res(
      ctx.status(204),
    );
  }),
];
