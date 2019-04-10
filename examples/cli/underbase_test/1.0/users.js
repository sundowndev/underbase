export default {
  up: async (db) => {
    db.collection('allo').drop();

    db.collection('users')
      .rename('name', 'firstname')
      .where({});

    await db
      .collection('users')
      .unset('dateCreated')
      .where({});

    // db.collection('users').applySchema({
    //   lastname: {
    //     $delete: {
    //       $where: { isDeleted: false },
    //       $limit: 10,
    //     },
    //   },
    //   firstname: {
    //     $rename: {
    //       $name: 'name',
    //       $where: { isDeleted: false },
    //       $limit: 10,
    //     },
    //   },
    // });

    // This is the same as...
    //
    // db.getClient().collection('users')
    //   .updateMany(
    //     {},
    //     {
    //       $unset: { isAdmin: 1 },
    //     }, { multi: true }
    //   );
  },
  down: (db) => {
    db.getClient()
      .collection('users')
      .updateMany(
        {},
        {
          $set: { isAdmin: false },
        },
        { multi: true },
      );
  },
};
