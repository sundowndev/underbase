<p align="center">
  <img src="https://svgshare.com/i/CAV.svg" width="160" alt="" />
</p>

<h1 align="center">Underbase</h1>

<p align="center">MongoDB schema and data migration library.</p>

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

MongoDB schema migrations done right. Underbase is an abstract framework for writing, executing, and organizing your database migrations.

## Goals

- Multi database support
- Migration versioning
- Automatic and incremental backups
- Backup restoration
- Flexible & easy to configure
- Provide MongoDB query interface
- Minimal performance cost for big databases

## Contributing

- Fork it!
- Create your branch: `git checkout -b <scope>/my-new-feature`
- Commit your changes: `git commit -am 'Add some feature/fix/support'`
- Push to the branch: `git push origin <scope>/my-new-feature`
- Submit a pull request

The scope can be one of the following : `feature`, `bugfix`, `hotfix`, `support`

## Credits

This repository is a fork of [emmanuelbuah/mgdb-migrator](https://github.com/emmanuelbuah/mgdb-migrator), which is a generic mongodb migration library based on [percolatestudio/meteor-migrations](https://github.com/percolatestudio/meteor-migrations).

This fork was created in order to provide a CLI program to interact with the library's API and add some features such as automatic backups and MongoDB query interface.
