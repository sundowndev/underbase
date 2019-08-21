import labels from './labels';

export default {
  version: 1.1,
  describe: 'Init labels collection',
  async up({ MongoClient, Migrate, Query }) {
    await Migrate([labels]);
  },
  async down({ MongoClient, Migrate, Query }) {
    await Migrate([labels]);
  },
};
