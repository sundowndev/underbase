import { IMigrationUtils } from '@underbase/types';

export default {
  describe: 'Transform label field to array',
  version: 1.2,
  async up({ MongoClient }: IMigrationUtils) {
    const tasksCollection = MongoClient.collection('Tasks');

    for (const task of await tasksCollection.find().toArray()) {
      const labels = [task.label];

      await tasksCollection.updateOne(
        { _id: task._id },
        { $unset: { label: 1 }, $set: { labels } },
      );
    }
  },
  async down({ MongoClient }: IMigrationUtils) {
    const tasksCollection = MongoClient.collection('Tasks');

    for (const task of await tasksCollection.find().toArray()) {
      const label = task.labels[0];

      await tasksCollection.updateOne(
        { _id: task._id },
        { $unset: { labels: 1 }, $set: { label } },
      );
    }
  },
};
