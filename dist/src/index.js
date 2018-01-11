"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const migration_1 = require("./migration");
exports.Migration = migration_1.Migration;
const migrator = new migration_1.Migration();
exports.migrator = migrator;
if (process.env.MIGRATE) {
    migrator.migrateTo(process.env.MIGRATE);
}
//# sourceMappingURL=index.js.map