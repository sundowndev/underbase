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
const mongodb_1 = require("mongodb");
const sinon = require("sinon");
const src_1 = require("../src/");
const dbURL = process.env.DBURL;
describe('Migration', () => {
    let migrator;
    let migrationsList;
    let configObject;
    beforeAll(() => __awaiter(this, void 0, void 0, function* () {
        try {
            configObject = {
                logs: true,
                logIfLatest: true,
                collectionName: '_migration',
                db: dbURL,
                logger: () => { },
            };
            migrator = new src_1.Migration(configObject);
            yield migrator.config();
            migrationsList = [];
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }));
    beforeEach(() => {
        migrationsList = [];
        migrationsList.push({
            version: 0,
            up: () => { },
        });
        migrationsList.push({
            version: 1,
            name: 'Version 1',
            up: (db) => {
                return 'done';
            },
            down: (db) => {
                return 'done';
            },
        });
        migrator.add(migrationsList[1]);
        migrationsList.push({
            version: 2,
            name: 'Version 2',
            up: (db) => {
                return 'done';
            },
            down: (db) => {
                return 'done';
            },
        });
        migrator.add(migrationsList[2]);
    });
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        yield migrator.reset();
    }));
    describe('#migrateTo', () => {
        test('1 from 0, should migrate to v1', () => __awaiter(this, void 0, void 0, function* () {
            let currentVersion = yield migrator.getVersion();
            expect(currentVersion).toBe(0);
            yield migrator.migrateTo(1);
            currentVersion = yield migrator.getVersion();
            expect(currentVersion).toBe(1);
        }));
        test('2 from 0, should migrate to v2', () => __awaiter(this, void 0, void 0, function* () {
            let currentVersion = yield migrator.getVersion();
            expect(currentVersion).toBe(0);
            yield migrator.migrateTo(2);
            currentVersion = yield migrator.getVersion();
            expect(currentVersion).toBe(2);
        }));
        test(`'latest' from 0, should migrate to v2`, () => __awaiter(this, void 0, void 0, function* () {
            let currentVersion = yield migrator.getVersion();
            expect(currentVersion).toBe(0);
            yield migrator.migrateTo('latest');
            currentVersion = yield migrator.getVersion();
            expect(currentVersion).toBe(2);
        }));
        test('from 2 to 1, should migrate to v1', () => __awaiter(this, void 0, void 0, function* () {
            yield migrator.migrateTo('2');
            let currentVersion = yield migrator.getVersion();
            expect(currentVersion).toBe(2);
            yield migrator.migrateTo(1);
            currentVersion = yield migrator.getVersion();
            expect(currentVersion).toBe(1);
        }));
        test('from 2 to 0, should migrate to v0', () => __awaiter(this, void 0, void 0, function* () {
            yield migrator.migrateTo('2');
            let currentVersion = yield migrator.getVersion();
            expect(currentVersion).toBe(2);
            yield migrator.migrateTo(0);
            currentVersion = yield migrator.getVersion();
            expect(currentVersion).toBe(0);
        }));
        test('rerun 0 to 0, should migrate to v0', () => __awaiter(this, void 0, void 0, function* () {
            let currentVersion = yield migrator.getVersion();
            expect(currentVersion).toBe(0);
            yield migrator.migrateTo('0,rerun');
            currentVersion = yield migrator.getVersion();
            expect(currentVersion).toBe(0);
        }));
        describe('With async(async/await and Promise) up() & down()', () => {
            beforeEach(() => {
                migrator.add({
                    version: 3,
                    name: 'Version 3.',
                    up: (db) => __awaiter(this, void 0, void 0, function* () {
                        return 'done';
                    }),
                    down: (db) => __awaiter(this, void 0, void 0, function* () {
                        return 'done';
                    }),
                });
                migrator.add({
                    version: 4,
                    name: 'Version 4',
                    up: bluebird_1.Promise.method((db) => {
                        return 'done';
                    }),
                    down: bluebird_1.Promise.method((db) => {
                        return 'done';
                    }),
                });
            });
            test('from 0 to 3, should migrate to v3', () => __awaiter(this, void 0, void 0, function* () {
                let currentVersion = yield migrator.getVersion();
                expect(currentVersion).toBe(0);
                yield migrator.migrateTo(3);
                currentVersion = yield migrator.getVersion();
                expect(currentVersion).toBe(3);
            }));
            test('from 0 to 4, should migrate to v4', () => __awaiter(this, void 0, void 0, function* () {
                let currentVersion = yield migrator.getVersion();
                expect(currentVersion).toBe(0);
                yield migrator.migrateTo(4);
                currentVersion = yield migrator.getVersion();
                expect(currentVersion).toBe(4);
            }));
        });
        describe('On Error', () => {
            beforeEach(() => {
                migrator.add({
                    version: 3,
                    name: 'Version 3.',
                    up: (db) => __awaiter(this, void 0, void 0, function* () {
                    }),
                    down: (db) => __awaiter(this, void 0, void 0, function* () {
                    }),
                });
                migrator.add({
                    version: 4,
                    name: 'Version 4.',
                    up: (db) => __awaiter(this, void 0, void 0, function* () {
                    }),
                    down: (db) => __awaiter(this, void 0, void 0, function* () {
                        throw new Error('Something went wrong');
                    }),
                });
                migrator.add({
                    version: 5,
                    name: 'Version 5.',
                    up: (db) => __awaiter(this, void 0, void 0, function* () {
                        throw new Error('Something went wrong');
                    }),
                    down: (db) => __awaiter(this, void 0, void 0, function* () {
                    }),
                });
            });
            test('from 0 to 5, should stop migration at v4 due to error from v4 to v5', () => __awaiter(this, void 0, void 0, function* () {
                let currentVersion = yield migrator.getVersion();
                expect(currentVersion).toBe(0);
                try {
                    yield migrator.migrateTo(5);
                }
                catch (e) {
                    expect(e).toBeTruthy();
                    expect(e).toBeInstanceOf(Error);
                }
                currentVersion = yield migrator.getVersion();
                expect(currentVersion).toBe(4);
            }));
            test('from 4 to 3, should stop migration at 4 due to error from v4 to v3', () => __awaiter(this, void 0, void 0, function* () {
                yield migrator.migrateTo(4);
                let currentVersion = yield migrator.getVersion();
                expect(currentVersion).toBe(4);
                try {
                    yield migrator.migrateTo(3);
                }
                catch (e) {
                    expect(e).toBeTruthy();
                    expect(e).toBeInstanceOf(Error);
                }
                currentVersion = yield migrator.getVersion();
                expect(currentVersion).toBe(4);
            }));
        });
    });
    describe('#isLocked', () => {
        test(`should be unlocked`, () => __awaiter(this, void 0, void 0, function* () {
            const locked = yield migrator.isLocked();
            expect(locked).toBe(false);
        }));
        test(`should be locked`, () => __awaiter(this, void 0, void 0, function* () {
            sinon.stub(mongodb_1.MongoClient.connect.prototype).returns({ findOne: () => true });
            const locked = yield migrator.isLocked();
            expect(locked).toBe(true);
        }));
    });
    describe('#getConfig', () => {
        test('should return config objet', () => {
            const config = migrator.getConfig();
            expect(config).toMatchObject(configObject);
        });
    });
    describe('#getMigrations', () => {
        test('should return migrations array', () => {
            const migrations = migrator.getMigrations();
            migrations.forEach((m) => {
                expect(m).toHaveProperty('version');
                expect(m).toHaveProperty('up');
                if (m.version !== 0) {
                    expect(m).toHaveProperty('name');
                    expect(m).toHaveProperty('down');
                }
            });
        });
    });
});
//# sourceMappingURL=test.spec.js.map