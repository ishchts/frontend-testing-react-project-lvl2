module.exports = {
  testEnvironment: 'jsdom',
  transformIgnorePatterns: ['node_modules/(?!(@hexlet/react-todo-app-with-backend)/)'],
  setupFilesAfterEnv: ['./jest.setup.js'],
};
