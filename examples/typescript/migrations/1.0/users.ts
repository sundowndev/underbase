import { IMigrationUtils } from '@underbase/types';

export default {
  describe: 'Fix typo in Users collection',
  version: 1.0,
  async up({ Query }: IMigrationUtils) {
    const users = Query.collection('Users');

    await users.rename('datecreated', 'dateCreated').where({
      datecreated: {
        $exists: true,
      },
    });
  },
  async down({ Query }: IMigrationUtils) {
    const users = Query.collection('Users');

    await users.rename('dateCreated', 'datecreated').where({
      dateCreated: {
        $exists: true,
      },
    });
  },
};
