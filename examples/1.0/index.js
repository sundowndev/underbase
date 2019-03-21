import user from './user';
import workspaces from './workspaces';

export default {
  version: 1.0,
  name: '1.0',
  up: async (db) => {
    await user.up(db);
    await workspaces.up(db);
  },
  down: async (db) => {
    await user.down(db);
    await workspaces.up(db);
  }
};
