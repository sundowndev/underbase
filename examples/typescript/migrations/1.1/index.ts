import { IMigrationUtils } from '@underbase/types';
import labels from './labels';

export default {
  version: 1.1,
  describe: 'Init labels collection',
  up: async ({ Migrate }: IMigrationUtils) => {
    await Migrate([labels]);
  },
  down: async ({ Migrate }: IMigrationUtils) => {
    await Migrate([labels]);
  },
};
