import { IMigrationUtils } from '@underbase-types';

export default {
  describe: 'Transform label field to array',
  async up({ MongoClient }: IMigrationUtils) {
    const tasks = MongoClient.collection('Tasks');

    await tasks.find({}).forEach(async (doc: any) => {
      const labels = [doc.label];

      await tasks.updateOne(
        { _id: doc._id },
        { $unset: { label: 1 }, $set: { labels } },
      );
    });
  },
  async down({ MongoClient }: IMigrationUtils) {
    const tasks = MongoClient.collection('Tasks');

    await tasks.find({}).forEach(async (doc: any) => {
      const label = doc.labels[0];

      await tasks.updateOne(
        { _id: doc._id },
        { $unset: { labels: 1 }, $set: { label } },
      );
    });
  },
};
