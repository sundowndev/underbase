
export default {
  up: (db) => {
    console.log('up users 1.2');

    db.collection('users')
      .updateMany(
        {},
        {
          $unset: { isAdmin: 1, isSuperAdmin: 1 },
        }, { multi: true }
      );
  },
  down: (db) => {
    console.log('down users 1.2');

    db.collection('users')
      .updateMany(
        {},
        {
          $set: { isAdmin: false, isSuperAdmin: false },
        }, { multi: true }
      );
  }
};
