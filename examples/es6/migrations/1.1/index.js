import labels from './labels';

export default {
  version: 1.1,
  describe: 'Init labels collection',
  up: async ({ MongoClient, Migrate, Query }) => {
    await Migrate([labels]);
  },
  down: async ({ MongoClient, Migrate, Query }) => {
    await Migrate([labels]);
  },
};
