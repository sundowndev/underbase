---
id: api-queryInterface
title: Query Interface
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
Query.cursorOptions = {
  cursor: {
    batchSize: 500,
  },
  allowDiskUse: true,
};
```

### `collection()`

Use a given collection. Returns an instance of MongoCollection which is described below.

Example :

```javascript
Query.collection('users');
```

## MongoCollection

### `rename()`

Rename a field in a collection. Returns a Promise.

Example :

```javascript
Query.collection('users')
  .rename('dateCreated', 'datecreated')
  // .rename(field_name, new_field_name)
  .where({});
```

### `remove()`

Remove a document in a collection. Returns a Promise.

Example :

```javascript
Query.collection('users')
  .remove()
  .where({
    isDeleted: true,
  });
```

### `drop()`

Drop an entire collection. Returns a Promise.

Example :

```javascript
Query.collection('users').drop();
```

### `unset()`

Unset a field in a collection. Returns a Promise.

Example :

```javascript
Query.collection('users')
  .unset('isDeleted')
  .where({
    isDeleted: {
      $exists: false,
    },
  });
```

### `set()`

Set a field in a collection. Returns a Promise.

Example :

```javascript
Query.collection('users')
  .set('isDeleted', false)
  .where({
    isDeleted: {
      $exists: false,
    },
  });
```

### `count()`

Count documents in a collection. Returns a Promise.

Example :

```javascript
Query.collection('users').count({
  isDeleted: {
    $exists: false,
  },
});
```
