<p align="center">
  <img src="website/static/img/logo.svg" width="128" alt="" />
</p>

<h1 align="center">Underbase</h1>

<p align="center">MongoDB schema and data migration library. Check out <a href="https://sundowndev.github.io/underbase">documentation</a>.</p>

<div align="center">
  <a href="https://travis-ci.org/sundowndev/underbase">
    <img src="https://img.shields.io/travis/sundowndev/underbase/master.svg?style=flat-square" alt="build status" />
  </a>
  <a href="https://codecov.io/gh/sundowndev/underbase">
    <img src="https://img.shields.io/codecov/c/gh/sundowndev/underbase/develop.svg?style=flat-square" alt="code coverage" />
  </a>
  <a href="https://github.com/sundowndev/underbase/releases">
    <img src="https://img.shields.io/github/release/sundowndev/underbase.svg?style=flat-square" alt="release" />
  </a>
  <!--<a href="https://www.npmjs.com/package/underbase">
    <img alt="npm" src="https://img.shields.io/npm/v/underbase.svg?style=flat-square">
  </a>-->
  <a href="https://david-dm.org/sundowndev/underbase">
    <img src="https://david-dm.org/sundowndev/underbase/status.svg?style=flat-square" alt="dependencies" />
  </a>
</div>

## What's this ?

Underbase is a MongoDB schema and data migration library that provides an easy-to-use abstract interface for writting, organizing and executing your database migrations. Usable both in the CLI and as a module, you can easily implement it in your framework's code base.

## Goals

- Migration versioning (major and minor)
- Multiple MongoDB databases support
- Execution flow control & middlewares
- Provide additional MongoDB query interface
- Handle scalable environments by design

## Examples

Want to see projects using Underbase ? We created some examples for you.

- [get-started](examples/get-started)
- [babel-async-await](examples/babel-async-await)
- [typescript](examples/typescript)
- [docker-backup](examples/docker-backup)

## Documentation

Learn more about using Underbase on the official site!

- [Getting Started](https://sundowndev.github.io/underbase/docs/installation)
- [Configuration](https://sundowndev.github.io/underbase/docs/configuration)
- [Guides](https://sundowndev.github.io/underbase/docs/organize)
- [API Reference](https://sundowndev.github.io/underbase/docs/api)

## Contributing

- Fork it!
- Create your feature branch: git checkout -b feature/my-new-feature
- Commit your changes: git commit -am 'Add some feature'
- Push to the branch: git push origin feature/my-new-feature
- Submit a pull request

## Support

Underbase is continuously being tested using node 8, 10, 11, the latest version of the [mongodb nodejs driver](https://github.com/mongodb/node-mongodb-native) (3.x) and the latest version of the [MongoDB docker image](https://docs.docker.com/samples/library/mongo/). Dependencies are frequently updated. It's compatible with any Node.js version above v7.x.

## Roadmap

See [ROADMAP.md](ROADMAP.md)

## Security

See [SECURITY.md](SECURITY.md)

## Credits

This repository is a fork of [emmanuelbuah/mgdb-migrator](https://github.com/emmanuelbuah/mgdb-migrator), which is a generic mongodb migration library based on [percolatestudio/meteor-migrations](https://github.com/percolatestudio/meteor-migrations). This fork was created in order to provide a CLI application to interact with the API and several new features.

Icon was made by [Fabiana Antonioli](https://thenounproject.com/FafiAC) and published on [thenounproject](https://thenounproject.com/search/?q=prism&i=2263153).

## License

[MIT](https://github.com/sundowndev/underbase/blob/develop/LICENSE)

© 2019-present Raphaël Cerveaux