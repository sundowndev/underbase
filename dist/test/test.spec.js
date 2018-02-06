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
const _1 = require("../src/");
const dbURL = process.env.DBURL;
describe('Migration', () => {
    let migrator;
    beforeAll(() => __awaiter(this, void 0, void 0, function* () {
        try {
            migrator = new _1.Migration({
                log: true,
                logIfLatest: true,
                collectionName: '_migration',
                db: dbURL,
            });
            yield migrator.config();
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }));
    beforeEach(() => {
        migrator.add({
            version: 1,
            name: 'Version 1',
            up: (db) => {
            },
            down: (db) => {
            },
        });
        migrator.add({
            version: 2,
            name: 'Version 2',
            up: (db) => {
            },
            down: (db) => {
            },
        });
    });
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        yield migrator._reset();
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
        describe('On Error', () => {
            beforeEach(() => {
                migrator.add({
                    version: 3,
                    name: 'Version 3.',
                    up: (db) => {
                    },
                    down: (db) => {
                    },
                });
                migrator.add({
                    version: 4,
                    name: 'Version 4.',
                    up: (db) => {
                    },
                    down: (db) => {
                        throw new Error('Something went wrong');
                    },
                });
                migrator.add({
                    version: 5,
                    name: 'Version 5.',
                    up: (db) => {
                        throw new Error('Something went wrong');
                    },
                    down: (db) => {
                    },
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
});
//# sourceMappingURL=test.spec.js.map