import { Db } from 'mongodb';

export default {
  describe: 'Transform label field to array',
  async up({ MongoClient }: { MongoClient: Db }) {
    const tasks = MongoClient.collection('Tasks');

    await tasks.find({}).forEach(async doc => {
      const labels = [doc.label];

      await tasks.updateOne(
        { _id: doc._id },
        { $unset: { label: 1 }, $set: { labels } },
      );
    });
  },
  async down({ MongoClient }: { MongoClient: Db }) {
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
