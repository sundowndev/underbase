export default {
  up: (db) =>
    new Promise((resolve, reject) => {
      // db.collection('users').drop();
 
      // db.collection('users')
      //   .rename('firstname', 'name')
      //   .where({});

      // db.collection('users')
      //   .unset('isDeleted')
      //   .where({});

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

      return resolve();
    }),
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
