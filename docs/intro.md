# Underbase

MongoDB schema migrations done right. Underbase is an abstract framework for writing, executing, and organizing your database migrations.

## Goals

- Migration versioning
- Multiple MongoDB databases support
- Automatic and incremental backups
- Provide MongoDB query interface
- Handle scalable environments

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
