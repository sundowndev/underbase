export default {
  up: async (db) => {
    // db.collection('users').drop();

    // db.collection('users')
    //   .unset('isDeleted')
    //   .where({
    //     isDeleted: {
    //       $exists: 1,
    //     },
    //   });

    db.collection('users')
      .remove()
      .where({
        isDeleted: true,
      });

    db.collection('users').applySchema({
      isDeleted: {
        $unset: {
          $where: { isDeleted: { $exists: true } },
        },
      },
      datecreated: {
        $rename: {
          $name: 'dateCreated',
        },
      },
    });

    await db.save();

    // You can still use the native client...
    //
    // db.getClient().collection('users')
    //   .updateMany(
    //     {},
    //     {
    //       $unset: { isAdmin: 1 },
    //     }, { multi: true }
    //   );
  },
  down: async (db) => {
    db.collection('users')
      .set('isDeleted', false)
      .where({
        isDeleted: {
          $exists: false,
        },
      });

    db.collection('users')
      .rename('dateCreated', 'datecreated')
      .where({});

    await db.save();
  },
};
