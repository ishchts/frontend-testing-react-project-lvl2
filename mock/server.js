import { setupServer } from 'msw/node';
import handlers from './handlers';
import state from './state';

const server = setupServer(...handlers(state));

export default server;
