
export default {
  up: (db) => {
    db.collection('users')
      .updateMany(
        {},
        {
          $rename: { firstName: 'name' },
        }, { multi: true }
      );
  },
  down: (db) => {
    db.collection('users')
      .updateMany(
        {},
        {
          $rename: { name: 'firstName' },
        }, { multi: true }
      );
  }
};
