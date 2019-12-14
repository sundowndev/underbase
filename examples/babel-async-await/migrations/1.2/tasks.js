export default {
  describe: 'Transform label field to array',
  async up({ MongoClient }) {
    const tasksCollection = MongoClient.collection('Tasks');

    for (const task of await tasksCollection.find().toArray()) {
      const labels = [task.label];

      await tasksCollection.updateOne(
        { _id: task._id },
        { $unset: { label: 1 }, $set: { labels } },
      );
    }
  },
  async down({ MongoClient }) {
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
