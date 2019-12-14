export default {
  describe: 'Transform label field to array',
  async up({ MongoClient }) {
    const Tasks = MongoClient.collection('Tasks');

    for (const task of await Tasks.find().toArray()) {
      const labels = [task.label];

      await Tasks.updateOne(
        { _id: task._id },
        { $unset: { label: 1 }, $set: { labels } },
      );
    }
  },
  async down({ MongoClient }) {
    const Tasks = MongoClient.collection('Tasks');

    for (const task of await Tasks.find().toArray()) {
      const label = task.labels[0];

      await Tasks.updateOne(
        { _id: task._id },
        { $unset: { labels: 1 }, $set: { label } },
      );
    }
  },
};
