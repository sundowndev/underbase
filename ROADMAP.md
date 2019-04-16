# Roadmap

Since I forked the work of [emmanuelbuah](https://github.com/emmanuelbuah) and added few features, the very first thing to do is to make a stable version of this fork. The initial state for this fork is `v0.9-dev`.

### `v0.9-dev`

- Improve TypeScript & TSlint configuration
- Create [documentation](https://sundowndev.github.io/underbase/) using Docsify
- Init CLI app

### `v1.0.0rc1`

- Refactor TS types
- Improve unit tests (to fit with new features)
- Compile library files (including CLI app) using Webpack
- Add the following API methods (#16) : 
  - `.isLocked()`
  - `.getMigrations()`
  - `.getConfig()`
- Rename `log` config option to `logs` to fit with CLI usage
- Improve CLI app
  - Backup feature
- Implement MongoDB query interface (#15)

### `v1.0.0rc2`

- Improve documentation with better migration process explanation & guides
  - Organizing migrations
  - Working with backups
  - Migrating with frameworks
  - Continuous integration
- Improve CLI app
  - Create command
  - Template option

### `v1.0.0`

- Create a license file
- Display a warning when migration up/down function is not an asyc function ([mgdb-migrator/issue#5](https://github.com/emmanuelbuah/mgdb-migrator/issues/5))
