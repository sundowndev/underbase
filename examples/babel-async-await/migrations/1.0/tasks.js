export default {
  describe: 'Fix typo in Tasks collection',
  async up({ Query }) {
    const Tasks = Query.collection('Tasks');

    await Tasks.rename('datecreated', 'dateCreated').where({
      datecreated: {
        $exists: true,
      },
    });
  },
  async down({ Query }) {
    const Tasks = Query.collection('Tasks');

    await Tasks.rename('dateCreated', 'datecreated').where({
      dateCreated: {
        $exists: true,
      },
    });
  },
};
