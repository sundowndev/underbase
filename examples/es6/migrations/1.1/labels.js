export default {
  describe: 'Move tasks labels to a dedicated collection',
  async up({ MongoClient }) {
    const Tasks = MongoClient.collection('Tasks');
    const Labels = MongoClient.collection('Labels');

    await Tasks.find({}).forEach(async (doc) => {
      const label = doc.label;

      const labelDoc = await Labels.findOneAndUpdate(
        { name: label },
        { $setOnInsert: { name: label } },
        {
          returnOriginal: false,
          upsert: true,
        }
      );

      await Tasks.updateOne(
        { _id: doc._id },
        {
          $set: {
            label: labelDoc.value._id,
          },
        }
      );
    });
  },
  async down({ MongoClient, Query }) {
    const Tasks = MongoClient.collection('Tasks');
    const Labels = MongoClient.collection('Labels');

    await Tasks.find({}).forEach(async (doc) => {
      const labelDoc = await Labels.findOne({ _id: doc.label });

      await MongoClient.collection('Tasks').updateOne(
        { _id: doc._id },
        { $set: { label: labelDoc.name } }
      );
    });

    await Query.collection('Labels').drop();
  },
};
