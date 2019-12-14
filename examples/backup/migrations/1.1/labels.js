export default {
  describe: 'Move tasks labels to a dedicated collection',
  async up({ MongoClient }) {
    const tasksCollection = MongoClient.collection('Tasks');
    const labelsCollection = MongoClient.collection('Labels');

    for (const task of await tasksCollection.find().toArray()) {
      const label = task.label;
      const labelDoc = await labelsCollection.findOneAndUpdate(
        { name: label },
        { $setOnInsert: { name: label } },
        {
          returnOriginal: false,
          upsert: true,
        },
      );

      await tasksCollection.updateOne(
        { _id: task._id },
        {
          $set: {
            label: labelDoc.value._id,
          },
        },
      );
    }
  },
  async down({ MongoClient, Query }) {
    const tasksCollection = MongoClient.collection('Tasks');
    const labelsCollection = MongoClient.collection('Labels');

    for (const task of await tasksCollection.find().toArray()) {
      const labelDoc = await labelsCollection.findOne({ _id: task.label });

      if (!labelDoc) {
        return;
      }

      await MongoClient.collection('Tasks').updateOne(
        { _id: task._id },
        { $set: { label: labelDoc.name } },
      );
    }

    await Query.collection('Labels').drop();
  },
};
