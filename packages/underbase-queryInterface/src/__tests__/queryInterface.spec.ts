// tslint:disable:no-empty
import { Collection, Db, MongoClient } from 'mongodb';
import { QueryInterface } from '../index';
import { MongoCollection } from '../MongoCollection';

let connection: MongoClient;
let db: Db;
const dbURL = process.env.DBURL || 'mongodb://localhost:27017/underbase_test';
let query: MongoCollection;
let mongoCollection: Collection;

describe('INTEGRATION - Query interface', () => {
  beforeAll(async () => {
    connection = await MongoClient.connect(dbURL, {
      useNewUrlParser: true,
    });

    db = connection.db();

    mongoCollection = db.collection('test');

    query = new QueryInterface(db).collection('test');
  });

  beforeEach(async () => {});

  afterEach(async () => {
    await mongoCollection.deleteMany({});
  });

  afterAll(async () => {
    await connection.close();
  });

  describe('#rename', () => {
    test('rename a field', async () => {
      await mongoCollection.insertOne({ field1: 'test' });

      await query.rename('field1', 'field2').where();

      const doc = await mongoCollection.findOne({});

      expect(doc).toHaveProperty('field2');
      expect(doc.field2).toBe('test');
    });

    test('rename a field with where clause', async () => {
      mongoCollection.insertMany([{ field1: 'test1' }, { field1: 'test2' }]);

      await query.rename('field1', 'field2').where({ field1: 'test1' });

      const docs = await mongoCollection.find({}).toArray();

      expect(docs[0]).toHaveProperty('field2');
      expect(docs[0].field2).toBe('test1');
      expect(docs[1]).toHaveProperty('field1');
      expect(docs[1].field1).toBe('test2');
    });
  });

  describe('#unset', () => {
    test('unset a field', async () => {
      await mongoCollection.insertMany([{ field1: 'test1', field2: 'test2' }]);

      await query.unset('field1').where();

      const document = await mongoCollection.findOne({ field2: 'test2' });

      expect(document.field1).toBe(undefined);
      expect(document.field2).toBe('test2');
    });

    test('unset a field with where clause', async () => {
      await mongoCollection.insertMany([
        { field1: 'test1', field2: 'test2' },
        { field1: 'test3', field2: 'test4' },
      ]);

      await query.unset('field1').where({ field1: 'test1' });

      const docs = await mongoCollection.find().toArray();

      expect(docs[0].field1).toBe(undefined);
      expect(docs[0].field2).toBe('test2');
      expect(docs[1].field1).toBe('test3');
      expect(docs[1].field2).toBe('test4');
    });

    test('unset a multiple fields', async () => {
      await mongoCollection.insertMany([
        { field1: 'test1', field2: 'test2', field3: 'test3' },
      ]);

      await query.unset(['field1', 'field3']).where();

      const docs = await mongoCollection.find().toArray();

      expect(docs[0].field1).toBe(undefined);
      expect(docs[0].field3).toBe(undefined);
      expect(docs[0].field2).toBe('test2');
    });

    test('throw error on input type', async () => {
      await mongoCollection.insertOne({ field1: 'test1' });

      try {
        await query.unset({ field1: true } as any);
        expect(1).toBe(0);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });
  });

  describe('#set', () => {
    test('set a field', async () => {
      await mongoCollection.insertMany([
        { field1: 'test1' },
        { field1: 'test2' },
      ]);

      await query.set('field3', 'test3').where();

      const docs = await mongoCollection.find().toArray();

      expect(docs[0].field3).toBe('test3');
      expect(docs[1].field3).toBe('test3');
    });

    test('set a field with where clause', async () => {
      await mongoCollection.insertMany([
        { field1: 'test1' },
        { field1: 'test2' },
      ]);

      await query.set('field3', 'test3').where({ field1: 'test1' });

      const docs = await mongoCollection.find().toArray();

      expect(docs[0].field3).toBe('test3');
      expect(docs[1].field3).toBe(undefined);
    });
  });

  describe('#drop', () => {
    test('drop colletion', async () => {
      await db
        .collection('test2')
        .insertMany([{ field1: 'test1' }, { field1: 'test2' }]);

      const collection = new QueryInterface(db).collection('test2');

      await collection.drop();

      const docs = await db
        .collection('test2')
        .find()
        .toArray();

      expect(docs).toStrictEqual([]);
    });
  });

  describe('#count', () => {
    test('count documents', async () => {
      const fixtures = [
        { field1: 'test1' },
        { field2: 'test2' },
        { field1: 'test2' },
        { field2: 'test2' },
        { field1: 'test2' },
      ];

      expect(await query.count()).toBe(0);

      await mongoCollection.insertMany(fixtures);

      expect(await query.count()).toBe(fixtures.length);
      expect(await query.count({ field2: { $exists: true } })).toBe(2);
    });
  });
});
