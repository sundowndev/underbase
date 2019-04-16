<p align="center">
  <img src="docs/logo.svg" width="128" alt="" />
</p>

<h1 align="center">Underbase</h1>

<p align="center">MongoDB schema and data migration library. Check out <a href="https://sundowndev.github.io/underbase">documentation</a>.</p>

<div align="center">
  <a href="https://travis-ci.org/sundowndev/underbase">
    <img src="https://img.shields.io/travis/sundowndev/underbase/master.svg?style=flat-square" alt="build status" />
  </a>
  <a href="https://github.com/sundowndev/underbase/releases">
    <img src="https://img.shields.io/github/release/sundowndev/underbase.svg?style=flat-square" alt="release" />
  </a>
  <a href="https://www.npmjs.com/package/underbase">
    <img alt="npm" src="https://img.shields.io/npm/v/underbase.svg?style=flat-square">
  </a>
  <a href="https://david-dm.org/sundowndev/underbase">
    <img src="https://david-dm.org/sundowndev/underbase/status.svg?style=flat-square" alt="dependencies" />
  </a>
</div>

## Goals

- Multi database support
- Migration versioning
- Automatic and incremental backups
- Backup restoration
- Flexible & easy to configure
- Provide MongoDB query interface
- Handle scalable environments

## Table of content

- Getting started
  - [Introduction](https://sundowndev.github.io/underbase/#/intro)
  - [Quick start](https://sundowndev.github.io/underbase/#/quick-start)
  - [Configuration](https://sundowndev.github.io/underbase/#/configuration)
  - [Logging](https://sundowndev.github.io/underbase/#/logging)
  - [Advanced](https://sundowndev.github.io/underbase/#/advanced)
  - [Troubleshooting](https://sundowndev.github.io/underbase/#/troubleshooting)
- Guides
  - [Organizing migrations](https://sundowndev.github.io/underbase/#/organize)
  - [Working with backups](https://sundowndev.github.io/underbase/#/working-with-backups)
  - [Migrating with frameworks](https://sundowndev.github.io/underbase/#/migrating-with-frameworks)
  - [Continuous integration](https://sundowndev.github.io/underbase/#/continuous-integration)
- API Reference
  - [API](https://sundowndev.github.io/underbase/#/api)
  - [Query interface API](https://sundowndev.github.io/underbase/#/query-interface-api)
  - [Developer API](https://sundowndev.github.io/underbase/#/dev-api)

## Contributing

- Fork it!
- Create your feature branch: git checkout -b feature/my-new-feature
- Commit your changes: git commit -am 'Add some feature'
- Push to the branch: git push origin feature/my-new-feature
- Submit a pull request

## Credits

This repository is a fork of [emmanuelbuah/mgdb-migrator](https://github.com/emmanuelbuah/mgdb-migrator), which is a generic mongodb migration library based on [percolatestudio/meteor-migrations](https://github.com/percolatestudio/meteor-migrations).

This fork was created in order to provide a CLI program to interact with the library's API and add some features such as automatic backups and MongoDB query interface.

Icon was made by [Fabiana Antonioli](https://thenounproject.com/FafiAC) and published on [thenounproject](https://thenounproject.com/search/?q=prism&i=2263153).
