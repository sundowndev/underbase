import { QueryInterface } from '@underbase/underbase-queryInterface';

export default {
  describe: 'Fix typo in Tasks collection',
  async up({ Query }: {
    Query: QueryInterface;
  }) {
    const tasks = Query.collection('Tasks');

    await tasks.rename('datecreated', 'dateCreated').where({
      datecreated: {
        $exists: true,
      },
    });
  },
  async down({ Query }: {
    Query: QueryInterface;
  }) {
    const tasks = Query.collection('Tasks');

    await tasks.rename('dateCreated', 'datecreated').where({
      dateCreated: {
        $exists: true,
      },
    });
  },
};
