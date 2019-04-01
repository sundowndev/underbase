# Underbase

[![build status](https://img.shields.io/travis/sundowndev/underbase/master.svg?style=flat-square)](https://travis-ci.org/sundowndev/underbase)
[![tag](https://img.shields.io/github/release/sundowndev/underbase.svg?style=flat-square)](https://github.com/sundowndev/underbase/releases)
[![dependencies](https://david-dm.org/sundowndev/underbase/status.svg?style=flat-square)](https://david-dm.org/sundowndev/underbase)

>MongoDB migrations done right. Abstract framework and CLI app for writing, executing, and organizing your database migrations.

## Links

- [Documentation](https://sundowndev.github.io/underbase/)
- [CLI app](https://github.com/sundowndev/underbase-cli)

## Goals

- Migration versioning
- Automatic and incremental backups
- Backup restoration
- Flexible & easy to configure
- Provide MongoDB query interface
- Minimal performance cost for big databases

## Credits

This repository is a fork of [emmanuelbuah/mgdb-migrator](https://github.com/emmanuelbuah/mgdb-migrator), which is a generic mongodb migration library based on [percolatestudio/meteor-migrations](https://github.com/percolatestudio/meteor-migrations).

This fork was created in order to provide a CLI program to interact with the library's API and add some features such as automatic backups and MongoDB query interface.
