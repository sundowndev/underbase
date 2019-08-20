import { QueryInterface } from '@underbase/underbase-queryInterface';
import { Db } from 'mongodb';

export default {
  describe: 'Move tasks labels to a dedicated collection',
  async up({ MongoClient }: { MongoClient: Db }) {
    const tasks = MongoClient.collection('Tasks');
    const labels = MongoClient.collection('Labels');

    await tasks.find({}).forEach(async doc => {
      const label = doc.label;

      const labelDoc = await labels.findOneAndUpdate(
        { name: label },
        { $setOnInsert: { name: label } },
        {
          returnOriginal: false,
          upsert: true,
        },
      );

      await tasks.updateOne(
        { _id: doc._id },
        {
          $set: {
            label: labelDoc.value._id,
          },
        },
      );
    });
  },
  async down({
    MongoClient,
    Query,
  }: {
    MongoClient: Db;
    Query: QueryInterface;
  }) {
    const tasks = MongoClient.collection('Tasks');
    const labels = MongoClient.collection('Labels');

    await tasks.find({}).forEach(async doc => {
      const labelDoc = await labels.findOne({ _id: doc.label });

      await MongoClient.collection('Tasks').updateOne(
        { _id: doc._id },
        { $set: { label: labelDoc.name } },
      );
    });

    await Query.collection('Labels').drop();
  },
};
