import { IMigrationUtils } from '@underbase/underbase-queryInterface';

export default {
  describe: 'Fix typo in Users collection',
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
