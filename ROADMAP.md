# Roadmap

Since I forked the work of [emmanuelbuah](https://github.com/emmanuelbuah) and added few features, the very first thing to do is to make a stable version of this fork. The initial state for this fork is `v0.9-dev`.

### `v0.9-dev`

- [x] Improve TypeScript & TSlint configuration
- [x] Create [documentation](https://sundowndev.github.io/underbase/) using Docsify
- [x] Init CLI app

### `v1.0.0rc1`

- [x] Refactor TS types
- [x] Improve unit tests (to fit with new features)
- [x] Compile library files (including CLI app) using Webpack
- [x] Add the following API methods ([#16](https://github.com/sundowndev/underbase/issues/16)): 
  - `.isLocked()`
  - `.getMigrations()`
  - `.getConfig()`
- [x] Rename `log` config option to `logs` to fit with CLI usage
- [x] Improve CLI app
  - Backup feature
- [x] Implement MongoDB query interface ([#15](https://github.com/sundowndev/underbase/issues/15))

### `v1.0.0rc2`

- [x] Add time spent while executing migration for CLI usage ([#42](https://github.com/sundowndev/underbase/issues/42))
- [x] Rename getClient() to getDb() to avoid misleading ([#30](https://github.com/sundowndev/underbase/issues/30))
- [x] Allow array in iterate method ([#39](https://github.com/sundowndev/underbase/issues/39))
- [x] Fix docker:test build exiting with code 0 when errored ([#29](https://github.com/sundowndev/underbase/issues/29))
- [ ] Improve migration organization; see object injection ([#55](https://github.com/sundowndev/underbase/issues/55))
- [ ] Display a warning when migration up/down function is not an async function ([mgdb-migrator/issue#5](https://github.com/emmanuelbuah/mgdb-migrator/issues/5), see [this](https://stackoverflow.com/a/38510353))
- [ ] CLI: `--history` option to save migration history into a .log file
- [ ] Rename `mongo-interface.ts` to `query-interface.ts`
- [ ] Improve documentation with better migration process explanation & guides
  - Organizing migrations
  - Working with backups
  - Migrating with frameworks
  - Continuous integration

### `v1.0.0`

- [ ] Addtional query interface methods
  - $currentDate
  - $inc
  - $min
  - $max
  - $mul
  - $setOnInsert
- [ ] Improve CLI program
  - Create command
  - Template option
- [ ] Create a license file
