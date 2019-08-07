export default {
  describe: 'Transform label field to array',
  async up({ MongoClient }) {
    const Tasks = MongoClient.collection('Tasks');

    await Tasks.find({}).forEach(async doc => {
      const labels = [doc.label];

      await Tasks.updateOne(
        { _id: doc._id },
        { $unset: { label: 1 }, $set: { labels } },
      );
    });
  },
  async down({ MongoClient }) {
    const Tasks = MongoClient.collection('Tasks');

    await Tasks.find({}).forEach(async doc => {
      const label = doc.labels[0];

      await Tasks.updateOne(
        { _id: doc._id },
        { $unset: { labels: 1 }, $set: { label: label } },
      );
    });
  },
};
