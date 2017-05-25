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
const _1 = require("../");
describe('Migration', () => {
    beforeAll(() => __awaiter(this, void 0, void 0, function* () {
        try {
            yield _1.migrator.config({
                log: true,
                logIfLatest: true,
                collectionName: '_migration',
                dbUrl: 'mongodb://localhost:27017/migration-test-db',
            });
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }));
    beforeEach(() => {
        _1.migrator.add({
            version: 1,
            name: 'Version 1',
            up: (db) => {
            },
            down: (db) => {
            },
        });
        _1.migrator.add({
            version: 2,
            name: 'Version 2.',
            up: (db) => {
            },
            down: (db) => {
            },
        });
    });
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        yield _1.migrator._reset();
    }));
    describe('#migrateTo', () => {
        test('1 from 0, should migrate to v1', () => __awaiter(this, void 0, void 0, function* () {
            let currentVersion = yield _1.migrator.getVersion();
            expect(currentVersion).toBe(0);
            yield _1.migrator.migrateTo(1);
            currentVersion = yield _1.migrator.getVersion();
            expect(currentVersion).toBe(1);
        }));
        test('2 from 0, should migrate to v2', () => __awaiter(this, void 0, void 0, function* () {
            let currentVersion = yield _1.migrator.getVersion();
            expect(currentVersion).toBe(0);
            yield _1.migrator.migrateTo(2);
            currentVersion = yield _1.migrator.getVersion();
            expect(currentVersion).toBe(2);
        }));
        test('\'latest\' from 0, should migrate to v2', () => __awaiter(this, void 0, void 0, function* () {
            let currentVersion = yield _1.migrator.getVersion();
            expect(currentVersion).toBe(0);
            yield _1.migrator.migrateTo('latest');
            currentVersion = yield _1.migrator.getVersion();
            expect(currentVersion).toBe(2);
        }));
        test('from 2 to 1, should migrate to v1', () => __awaiter(this, void 0, void 0, function* () {
            yield _1.migrator.migrateTo('latest');
            let currentVersion = yield _1.migrator.getVersion();
            expect(currentVersion).toBe(2);
            yield _1.migrator.migrateTo(1);
            currentVersion = yield _1.migrator.getVersion();
            expect(currentVersion).toBe(1);
        }));
        test('from 2 to 0, should migrate to v0', () => __awaiter(this, void 0, void 0, function* () {
            yield _1.migrator.migrateTo('latest');
            let currentVersion = yield _1.migrator.getVersion();
            expect(currentVersion).toBe(2);
            yield _1.migrator.migrateTo(0);
            currentVersion = yield _1.migrator.getVersion();
            expect(currentVersion).toBe(0);
        }));
        test('rerun 0 to 0, should migrate to v0', () => __awaiter(this, void 0, void 0, function* () {
            let currentVersion = yield _1.migrator.getVersion();
            expect(currentVersion).toBe(0);
            yield _1.migrator.migrateTo('0,rerun');
            currentVersion = yield _1.migrator.getVersion();
            expect(currentVersion).toBe(0);
        }));
    });
});
//# sourceMappingURL=test.spec.js.map