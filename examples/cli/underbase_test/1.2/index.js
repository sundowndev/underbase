// Import Users collection mirgation
import users from './users';

export default {
  version: 1.2,
  name: '1.2',
  up: async (db) => {
    await users.up(db);
  },
  down: async (db) => {
    await users.down(db);
  }
};
