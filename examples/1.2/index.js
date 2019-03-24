import user from './user';
import workspaces from './workspaces';

export default {
  version: 1.2,
  name: '1.2',
  up: async (db) => {
    await user.up(db);
    await workspaces.up(db);
  },
  down: async (db) => {
    await user.down(db);
    await workspaces.down(db);
  }
};
