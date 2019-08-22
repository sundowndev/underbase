export default {
  describe: 'Fix typo in Users collection',
  async up({ Query }) {
    const Users = Query.collection('Users');

    await Users.rename('datecreated', 'dateCreated').where({
      datecreated: {
        $exists: true,
      },
    });
  },
  async down({ Query }) {
    const Users = Query.collection('Users');

    await Users.rename('dateCreated', 'datecreated').where({
      dateCreated: {
        $exists: true,
      },
    });
  },
};
