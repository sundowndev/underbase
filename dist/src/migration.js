"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird_1 = require("bluebird");
const _ = require("lodash");
const mongodb_1 = require("mongodb");
const type_check_1 = require("type-check");
const check = type_check_1.typeCheck;
class Migration {
    constructor(opts) {
        this.defaultMigration = {
            version: 0,
            up: () => { },
        };
        this._list = [this.defaultMigration];
        this.options = opts ? opts : {
            log: true,
            logger: null,
            logIfLatest: true,
            collectionName: 'migrations',
            db: null,
        };
    }
    config(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            this.options = Object.assign({}, this.options, opts);
            if (!this.options.logger && this.options.log) {
                this.options.logger = (level, ...args) => console.log(level, ...args);
            }
            if (this.options.log === false) {
                this.options.logger = (level, ...args) => { };
            }
            if (!(this._db instanceof mongodb_1.Db) && !this.options.db) {
                throw new ReferenceError('Option.db canno\'t be null');
            }
            let db;
            if (typeof (this.options.db) === 'string') {
                const client = yield mongodb_1.MongoClient.connect(this.options.db, {
                    promiseLibrary: bluebird_1.Promise,
                    useNewUrlParser: true,
                });
                db = client.db();
            }
            else {
                db = this.options.db;
            }
            this._collection = db.collection(this.options.collectionName);
            this._db = db;
        });
    }
    add(migration) {
        if (typeof migration.up !== 'function') {
            throw new Error('Migration must supply an up function.');
        }
        if (typeof migration.down !== 'function') {
            throw new Error('Migration must supply a down function.');
        }
        if (typeof migration.version !== 'number') {
            throw new Error('Migration must supply a version number.');
        }
        if (migration.version <= 0) {
            throw new Error('Migration version must be greater than 0');
        }
        Object.freeze(migration);
        this._list.push(migration);
        this._list = _.sortBy(this._list, (m) => m.version);
    }
    migrateTo(command) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._db) {
                throw new Error('Migration instance has not be configured/initialized.' +
                    ' Call <instance>.config(..) to initialize this instance');
            }
            if (_.isUndefined(command) || command === '' || this._list.length === 0) {
                throw new Error('Cannot migrate using invalid command: ' + command);
            }
            let version;
            let subcommand;
            if (typeof command === 'number') {
                version = command;
            }
            else {
                version = command.split(',')[0];
                subcommand = command.split(',')[1];
            }
            try {
                if (version === 'latest') {
                    yield this.execute(_.last(this._list).version);
                }
                else {
                    yield this.execute(parseFloat(version), (subcommand === 'rerun'));
                }
            }
            catch (e) {
                this.options.
                    logger('info', `Encountered an error while migrating. Migration failed.`);
                throw e;
            }
        });
    }
    getNumberOfMigrations() {
        return this._list.length - 1;
    }
    getVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            const control = yield this.getControl();
            return control.version;
        });
    }
    unlock() {
        this._collection.updateOne({ _id: 'control' }, { $set: { locked: false } });
    }
    reset() {
        return __awaiter(this, void 0, void 0, function* () {
            this._list = [this.defaultMigration];
            yield this._collection.deleteMany({});
        });
    }
    execute(version, rerun) {
        return __awaiter(this, void 0, void 0, function* () {
            const self = this;
            const control = yield this.getControl();
            let currentVersion = control.version;
            const migrate = (direction, idx) => __awaiter(this, void 0, void 0, function* () {
                const migration = self._list[idx];
                if (typeof migration[direction] !== 'function') {
                    unlock();
                    throw new Error('Cannot migrate ' + direction + ' on version ' + migration.version);
                }
                function maybeName() {
                    return migration.name ? ' (' + migration.name + ')' : '';
                }
                this.options.logger('info', 'Running ' + direction + '() on version ' + migration.version + maybeName());
                yield migration[direction](self._db, migration);
            });
            const lock = () => __awaiter(this, void 0, void 0, function* () {
                const updateResult = yield self._collection.findOneAndUpdate({
                    _id: 'control',
                    locked: false,
                }, {
                    $set: {
                        locked: true,
                        lockedAt: new Date(),
                    },
                });
                return null != updateResult.value && 1 === updateResult.ok;
            });
            const unlock = () => self.setControl({
                locked: false,
                version: currentVersion,
            });
            const updateVersion = () => __awaiter(this, void 0, void 0, function* () {
                return yield self.setControl({
                    locked: true,
                    version: currentVersion,
                });
            });
            if ((yield lock()) === false) {
                this.options.logger('info', 'Not migrating, control is locked.');
                return;
            }
            if (rerun) {
                this.options.logger('info', 'Rerunning version ' + version);
                migrate('up', version);
                this.options.logger('info', 'Finished migrating.');
                yield unlock();
                return;
            }
            if (currentVersion === version) {
                if (this.options.logIfLatest) {
                    this.options.logger('info', 'Not migrating, already at version ' + version);
                }
                yield unlock();
                return;
            }
            const startIdx = this.findIndexByVersion(currentVersion);
            const endIdx = this.findIndexByVersion(version);
            this.options.logger('info', 'Migrating from version ' + this._list[startIdx].version
                + ' -> ' + this._list[endIdx].version);
            if (currentVersion < version) {
                for (let i = startIdx; i < endIdx; i++) {
                    try {
                        yield migrate('up', i + 1);
                        currentVersion = self._list[i + 1].version;
                        yield updateVersion();
                    }
                    catch (e) {
                        this.options.
                            logger('error', `Encountered an error while migrating from ${i} to ${i + 1}`);
                        throw e;
                    }
                }
            }
            else {
                for (let i = startIdx; i > endIdx; i--) {
                    try {
                        yield migrate('down', i);
                        currentVersion = self._list[i - 1].version;
                        yield updateVersion();
                    }
                    catch (e) {
                        this.options.
                            logger('error', `Encountered an error while migrating from ${i} to ${i - 1}`);
                        throw e;
                    }
                }
            }
            yield unlock();
            this.options.logger('info', 'Finished migrating.');
        });
    }
    getControl() {
        return __awaiter(this, void 0, void 0, function* () {
            const con = yield this._collection.findOne({ _id: 'control' });
            return con || (yield this.setControl({
                version: 0,
                locked: false,
            }));
        });
    }
    setControl(control) {
        return __awaiter(this, void 0, void 0, function* () {
            check('Number', control.version);
            check('Boolean', control.locked);
            const updateResult = yield this._collection.updateOne({
                _id: 'control',
            }, {
                $set: {
                    version: control.version,
                    locked: control.locked,
                },
            }, {
                upsert: true,
            });
            if (updateResult && updateResult.result.ok) {
                return control;
            }
            else {
                return null;
            }
        });
    }
    findIndexByVersion(version) {
        for (let i = 0; i < this._list.length; i++) {
            if (this._list[i].version === version) {
                return i;
            }
        }
        throw new Error('Can\'t find migration version ' + version);
    }
}
exports.Migration = Migration;
//# sourceMappingURL=migration.js.map