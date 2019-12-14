import { IMigrationUtils } from '@underbase/underbase-queryInterface';

export default {
  describe: 'Move tasks labels to a dedicated collection',
  async up({ MongoClient }: IMigrationUtils) {
    const tasksCollection = MongoClient.collection('Tasks');
    const labelsCollection = MongoClient.collection('Labels');

    const tasks = await tasksCollection.find().toArray();

    for (const task of tasks) {
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
  async down({ MongoClient, Query }: IMigrationUtils) {
    const tasksCollection = MongoClient.collection('Tasks');
    const labelsCollection = MongoClient.collection('Labels');

    const tasks = await tasksCollection.find().toArray();

    for (const task of tasks) {
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
