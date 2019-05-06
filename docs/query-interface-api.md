# Query interface API

## Properties

- [cursorOptions](#cursorOptions)

## Methods

- [getClient()](#getClient)
- [collection()](#collection)
  - [applySchema()](#applySchema)
  - [rename()](#rename)
  - [remove()](#remove)
  - [drop()](#drop)
  - [unset()](#unset)
  - [set()](#set)
  - [iterate()](#iterate)
- [save()](#save)

---

## Reference

### `cursorOptions`

MongoDB aggregator cursor options. See [MongoDB API reference](http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#aggregate).

The default value is :

```js
{
  cursor: {
    batchSize: 500,
  },
  allowDiskUse: true,
}
```

You can set your own value :

```js
db.cursorOptions = {
  cursor: {
    batchSize: 500,
  },
  allowDiskUse: true,
};
```

### `getDb()`

Returns the MongoDB database instance object.

Example :

```javascript
db.getDb().collection('users').findMany({
  isDeleted: false,
});
```

### `collection()`

Use a given collection. Returns an object of methods (see [summary](#methods)).

Example :

```javascript
db.collection('users');
```

#### `applySchema()`

Apply a given schema on a targeted collection. You can specify a query selector for each field. There's no particular way to use these query selectors, use it as you would with the MongoDB native node client.

Example :

```javascript
db.collection('users').applySchema({
  isDeleted: { // Field
    $unset: { // MongoDB operation
      $where: { isDeleted: { $exists: true } }, // Query selector
    },
  },
  datecreated: {
    $rename: {
      $name: 'dateCreated',
    },
  },
});
```

This method support every [MongoDB operators](https://docs.mongodb.com/manual/reference/operator/update-field/) :

- $set
- $unset
- $currentDate
- $inc
- $min
- $max
- $mul
- $rename
- $setOnInsert

#### `rename()`

Rename a field in a collection.

Example :

```javascript
db.collection('users')
  .rename('dateCreated', 'datecreated')
  // .rename(field_name, new_field_name)
  .where({});
```

#### `remove()`

Remove a document in a collection.

Example :

```javascript
db.collection('users')
  .remove()
  .where({
    isDeleted: true,
  });
```

#### `drop()`

Drop an entire collection.

Example :

```javascript
db.collection('users').drop();
```

#### `unset()`

Unset a field in a collection.

Example :

```javascript
db.collection('users')
  .unset('isDeleted')
  .where({
    isDeleted: {
      $exists: false,
    },
  });
```

#### `set()`

Set a field in a collection.

Example :

```javascript
db.collection('users')
  .set('isDeleted', false)
  .where({
    isDeleted: {
      $exists: false,
    },
  });
```

#### `iterate()`

Iterate documents in a collection.

Example :

```javascript
// db.collection('users').iterate(query, callback);
db.collection('users').iterate(
  {
    fullname: { $exists: false },
  },
  (doc) => {
    doc.fullname = `${doc.lastname} ${doc.firstname}`;

    db.collection('users')
      .set('fullname', doc.fullname)
      .where({ _id: doc._id });

    db.collection('users')
      .unset(['firstname', 'lastname'])
      .where({ _id: doc._id });
  },
);
```

### `save()`

Saves changes written to the collection. You always need to call this to persist your changes. Returns a promise.

Example :

```javascript
// db.collection('users')
//   .rename('dateCreated', 'datecreated')
//   .where({});

await db.save();
```
