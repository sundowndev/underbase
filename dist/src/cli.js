#!/usr/bin/env node
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
const index_1 = require("./index");
const yargs = require("yargs");
const path = require("path");
const fs = require("fs");
;
;
const argv = yargs
    .usage('Usage: $0 <command> [OPTIONS]')
    .command('migrate <migration>', 'Execute migrations')
    .command('list', 'Show all migrations versions')
    .command('status', 'Show migrations status')
    .describe('db', 'MongoDB connection URL')
    .describe('migrations-dir', 'Migrations versions directory')
    .describe('backups', 'Enable automatic backups')
    .describe('backups-dir', 'Backups directory')
    .describe('collection-name', 'Migrations state collection')
    .describe('logs', 'Enable logs')
    .help('h')
    .alias('h', 'help')
    .argv;
let metro = {};
try {
    metro = require(argv.config);
}
catch (err) { }
const config = {
    log: argv.logs || metro.logs || true,
    logger: (level, ...arg) => console.log(`[${level}]`, ...arg),
    logIfLatest: true,
    collectionName: argv.collectionName || metro.collectionName || 'migrations',
    db: argv.db || metro.db || "mongodb://localhost:27017/api",
    backups: argv.backups || metro.backups || false,
    backupsDir: path.resolve(argv.backupsDir || metro.backupsDir || './migrations/backups'),
    migrationsDir: path.resolve(argv.migrationsDir || metro.migrationsDir || './migrations'),
};
(() => __awaiter(this, void 0, void 0, function* () {
    yield index_1.migrator.config(config);
    let versions = fs.readdirSync(config.migrationsDir)
        .filter((v) => v.match(new RegExp(/^[\d].[\d]$/)));
    switch (argv._[0]) {
        case 'migrate':
            if (!fs.existsSync(config.migrationsDir)) {
                config.logger('info', 'Created migration directory.');
                fs.mkdirSync(config.migrationsDir);
            }
            versions = versions.map((v) => parseFloat(v));
            if (argv.migration != 0 && versions.indexOf(parseFloat(argv.migration)) < 0) {
                console.log('This version does not exists.');
                process.exit();
            }
            versions = versions.map((v) => v.toFixed(1));
            versions.forEach((v) => __awaiter(this, void 0, void 0, function* () {
                const migrationObj = require(`${config.migrationsDir}/${v}`).default;
                yield index_1.migrator.add(migrationObj);
            }));
            yield index_1.migrator.migrateTo(argv.migration);
            break;
        case 'list':
            versions.forEach((v) => console.log(v));
            break;
        case 'status':
            break;
        default:
            console.log('show help');
            break;
    }
    if (config.backups) { }
    process.exit();
}))();
//# sourceMappingURL=cli.js.map