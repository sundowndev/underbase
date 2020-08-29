<p align="center">
  <img src="website/static/img/logo.svg" width="128" alt="" />
</p>

<h1 align="center">Underbase</h1>

<p align="center"><strong>MongoDB schema and data migration library</strong></p>

<div align="center">
  <a href="https://github.com/sundowndev/underbase/actions">
    <img src="https://img.shields.io/endpoint.svg?url=https://actions-badge.atrox.dev/sundowndev/underbase/badge?ref=master" alt="build status" />
  </a>
  <a href="https://codeclimate.com/github/sundowndev/underbase/maintainability">
    <img src="https://api.codeclimate.com/v1/badges/ef8db7f1334994f01ea6/maintainability" />
  </a>
  <a href="https://codecov.io/gh/sundowndev/underbase">
    <img src="https://codecov.io/gh/sundowndev/underbase/branch/master/graph/badge.svg" />
  </a>
  <a href="https://github.com/sundowndev/underbase/releases">
    <img src="https://img.shields.io/github/release/sundowndev/underbase.svg" alt="release" />
  </a>
  <a href="https://badge.fury.io/js/underbase">
    <img src="https://badge.fury.io/js/underbase.svg" alt="npm version">
  </a>
</div>

## :warning: Deprecation notice

> **This project has been discontinued as of August, 2020** since it didn't match my expectations. Feel free to fork or contribute by making pull requests to keep the project up to date and maintained. Renovate has been disabled, dependencies will no longer be updated. Only security patches will be published to npm.

## What's this ?

Underbase is a MongoDB schema and data migration library that provides an easy-to-use abstract interface for writting, organizing and executing your database migrations. Usable both in the CLI and as a module, you can easily implement it in your framework's code base.

- **Promised:** uses promises and async/await. No callback hell.
- **Flexible:** Multiple databases support. Migrations can be grouped, organized. Migrator can have event listeners.
- **Scalable:** uses MongoDB cursor and aggregator.
- **Testable:** can be used with assertions.

## Current status

The current API (v2.x) is stable and production ready.

## Quick start

### Install

```shell
npm install -g @underbase/cli
```

>Underbase is compatible with any Node.js version above v8.x. ⚠️ As of March 2020, Underbase will drop support for Nodejs v8.x.

### Configuration

```js
// underbase.config.js
const path = require('path');

module.exports = {
  db: 'mongodb://localhost:27017/example_db',
  migrationsDir: __dirname,
  collectionName: '_migrations',
};
```

### Usage

```js
// migrations/1.0/index.js
module.exports = {
  version: 1.0,
  describe: 'Update users collection',
  async up({ Query }) {
    const Users = Query.collection('Users');

    await Users.rename('datecreated', 'dateCreated').where({
      datecreated: {
        $exists: true,
      },
    });
  },
  async down({ Query }) {
    const Users = Query.collection('Users');

    await Users.rename('dateCreated', 'datecreated').where({
      dateCreated: {
        $exists: true,
      },
    });
  },
};
```

**Then, you can migrate :**

```shell
# From 0 to 1.0
underbase migrate 1.0 --config underbase.config.js
```

**Want to rerun current migration version ?**

```shell
underbase rerun --config underbase.config.js
```

**Want to rollback a migration ?**

```shell
# From 1.0 to 0
underbase migrate 0 --config underbase.config.js
```

## Documentation

Learn more about using Underbase on the official site!

- [Getting Started](https://sundowndev.github.io/underbase/docs/installation)
- [Configuration](https://sundowndev.github.io/underbase/docs/configuration)
- [Guides](https://sundowndev.github.io/underbase/docs/organize)
- [API Reference](https://sundowndev.github.io/underbase/docs/api)

## Examples

Want to see real-world usage of Underbase ? We've created some examples for you.

- [get-started](examples/get-started)
- [babel-async-await](examples/babel-async-await)
- [babel-typescript](examples/babel-typescript)
- [typescript](examples/typescript)
- [backup](examples/backup)
- [docker-backup](examples/docker-backup)

## Support

Underbase is continuously being tested with node v10 & v12, the latest version of the [mongodb nodejs driver](https://github.com/mongodb/node-mongodb-native) (3.x) and the latest version of the [MongoDB docker image](https://docs.docker.com/samples/library/mongo/). Dependencies are frequently updated. It's compatible with any Node.js version above v8.x.

## Contributing

- Fork it!
- Create your feature branch: git checkout -b feature/my-new-feature
- Commit your changes: git commit -am 'Add some feature'
- Push to the branch: git push origin feature/my-new-feature
- Submit a pull request

## README Badge

Using Underbase in an open-source project? Add a README badge to show it off: [![underbase](https://img.shields.io/badge/migrating%20with-underbase-2c3e50.svg)](https://sundowndev.github.io/underbase/)

```
[![underbase](https://img.shields.io/badge/migrating with-underbase-2c3e50.svg)](https://sundowndev.github.io/underbase/)
```

## Credits

This repository is a fork of [emmanuelbuah/mgdb-migrator](https://github.com/emmanuelbuah/mgdb-migrator), which is a generic mongodb migration library based on [percolatestudio/meteor-migrations](https://github.com/percolatestudio/meteor-migrations). This fork was created in order to provide a CLI application to interact with the API and several new features.

Icon was made by [Fabiana Antonioli](https://thenounproject.com/FafiAC) and published on [thenounproject](https://thenounproject.com/search/?q=prism&i=2263153).

## License

[MIT](https://github.com/sundowndev/underbase/blob/master/LICENSE)

© 2019-present Raphaël Cerveaux
