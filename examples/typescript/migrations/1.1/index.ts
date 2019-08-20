import { QueryInterface } from '@underbase/underbase-queryInterface';
import labels from './labels';

export default {
  version: 1.1,
  describe: 'Init labels collection',
  up: async ({
    Migrate,
  }: {
    Migrate: any;
    Query: QueryInterface;
    Logger: any;
  }) => {
    await Migrate([labels]);
  },
  down: async ({
    Migrate,
  }: {
    Migrate: any;
    Query: QueryInterface;
    Logger: any;
  }) => {
    await Migrate([labels]);
  },
};
