
export default {
  up: (db) => {
    console.log('up workspaces');
    
    // db.collection('workspaces')
    //   .updateMany(
    //     {},
    //     {
    //       $unset: { isAdmin: 1, isSuperAdmin: 1 },
    //     }, { multi: true }
    //   );
  },
  down: (db) => {
    console.log('down workspaces');
    
    // db.collection('workspaces')
    //   .updateMany(
    //     {},
    //     {
    //       $set: { isAdmin: false, isSuperAdmin: false },
    //     }, { multi: true }
    //   );
  }
};
