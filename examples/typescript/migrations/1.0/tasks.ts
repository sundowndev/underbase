import { IMigrationUtils } from '@underbase/types';

export default {
  describe: 'Fix typo in Tasks collection',
  version: 1.0,
  async up({ Query }: IMigrationUtils) {
    const tasks = Query.collection('Tasks');

    await tasks.rename('datecreated', 'dateCreated').where({
      datecreated: {
        $exists: true,
      },
    });
  },
  async down({ Query }: IMigrationUtils) {
    const tasks = Query.collection('Tasks');

    await tasks.rename('dateCreated', 'datecreated').where({
      dateCreated: {
        $exists: true,
      },
    });
  },
};
