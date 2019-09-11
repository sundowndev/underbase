# Roadmap

Since I forked the project of [emmanuelbuah](https://github.com/emmanuelbuah), before adding new features, the very first thing to do is to make a stable version of this fork. The initial state for this fork is `v0.9-dev`. My goal with this project is to maintain this repository with a good workflow using CI and unit/integration tests, as well as having ~100% coverage and ensure support for node 8,10,11, the last version of [mongodb](https://docs.mongodb.com/manual/release-notes/) (currently 4.0), and [node-mongodb-native](https://github.com/mongodb/node-mongodb-native) 3.x.

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
- [x] Implement MongoDB query interface ([#15](https://github.com/sundowndev/underbase/issues/15))

### `v1.0.0rc2`

- [x] Add time spent while executing migration for CLI usage ([#42](https://github.com/sundowndev/underbase/issues/42))
- [x] Rename getClient() to getDb() to avoid misleading ([#30](https://github.com/sundowndev/underbase/issues/30))
- [x] Allow array in iterate method ([#39](https://github.com/sundowndev/underbase/issues/39))
- [x] Fix docker:test build exiting with code 0 when errored ([#29](https://github.com/sundowndev/underbase/issues/29))
- [x] Init command
- [x] Improve migration organization; see object injection ([#55](https://github.com/sundowndev/underbase/issues/55))
- [x] Display a warning when migration up/down function is not an async function ([mgdb-migrator/issue#5](https://github.com/emmanuelbuah/mgdb-migrator/issues/5), see [this](https://stackoverflow.com/a/38510353))
- [x] Rename `mongo-interface.ts` to `query-interface.ts`
- [x] Create a license file
- [x] Move `src` to `lib` and `dist` to `build`
- [x] Rerun command
- [ ] Backup feature

### `v1.0.0` (mvp)

<!--- [ ] CLI: `--history` option to save migration history into a .log file-->
- [x] Init monorepo using Lerna with the following packages
- [x] Support for ES6 and Typescript
- [x] Validate command
- [x] Event isteners
- [x] Refactor yargs implementation ([#131](https://github.com/sundowndev/underbase/issues/131))
- [ ] Create examples ([#132](https://github.com/sundowndev/underbase/issues/132))
  - [x] commonjs
  - [x] babel-async-await
  - [x] babel-typescript
  - [ ] typescript
  - [ ] backup
  - [ ] docker-backup
- [ ] Update documentation (guides)
  - [ ] Organizing migrations
  - [ ] Usage with Typescript
  - [ ] Working with backups
  - [ ] Working with continuous deployment
  - [ ] Testing your migrations (assert)
  
