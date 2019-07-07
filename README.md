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
- Automatic and incremental backups
- Provide additional MongoDB query interface
- Handle scalable environments by design
<!-- - Backup restoration- Flexible & easy to configure -->

## Example

Check out this [example repository](https://github.com/sundowndev/underbase-example) for a real-world use case.

## Contributing

- Fork it!
- Create your feature branch: git checkout -b feature/my-new-feature
- Commit your changes: git commit -am 'Add some feature'
- Push to the branch: git push origin feature/my-new-feature
- Submit a pull request

## Roadmap

See [ROADMAP.md](ROADMAP.md)

## Support

Underbase is being tested in continuous integration using node 8, 10 and 11, the latest version of the mongodb nodejs driver and the latest version of the MongoDB docker image. Dependencies are checked as soon as they are changed.

## Credits

This repository is a fork of [emmanuelbuah/mgdb-migrator](https://github.com/emmanuelbuah/mgdb-migrator), which is a generic mongodb migration library based on [percolatestudio/meteor-migrations](https://github.com/percolatestudio/meteor-migrations).

This fork was created in order to provide a CLI program to interact with the library's API and add some features such as automatic backups and MongoDB query interface.

Icon was made by [Fabiana Antonioli](https://thenounproject.com/FafiAC) and published on [thenounproject](https://thenounproject.com/search/?q=prism&i=2263153).
