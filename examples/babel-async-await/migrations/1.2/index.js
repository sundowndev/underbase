import tasks from './tasks';

export default {
  version: 1.2,
  describe: 'Migrate Tasks',
  up: async ({ Migrate }) => await Migrate([tasks]),
  down: async ({ Migrate }) => await Migrate([tasks]),
};
