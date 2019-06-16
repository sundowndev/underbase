export default {
  up: async (db) => {
    db.collection('users').destroy({
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
          $value: 'dateCreated',
        },
      },
    });

    await db.save();

    // You can still use the native client...
    //
    // db.MongoClient().collection('users')
    //   .updateMany(
    //     {},
    //     {
    //       $unset: { isDeleted: 1 },
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
