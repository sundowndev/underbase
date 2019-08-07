"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@underbase/utils");
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const yargs = __importStar(require("yargs"));
// Middlewares
const validation = __importStar(require("./middlewares/validation"));
// Commands
const initCmd = __importStar(require("./commands/init"));
const listCmd = __importStar(require("./commands/list"));
const migrateCmd = __importStar(require("./commands/migrate"));
const rerunCmd = __importStar(require("./commands/rerun"));
const statusCmd = __importStar(require("./commands/status"));
const unlockCmd = __importStar(require("./commands/unlock"));
const commands = {
    init: initCmd,
    list: listCmd,
    migrate: migrateCmd,
    status: statusCmd,
    unlock: unlockCmd,
    rerun: rerunCmd,
};
// Enable ES6 module for migrations files
require = require('esm')(module);
const argv = yargs
    .scriptName('underbase')
    .usage('Usage: $0 <command> [OPTIONS]')
    .command('migrate <migration>', migrateCmd.describe)
    .command('init', initCmd.describe)
    .command('list', listCmd.describe)
    .command('status', statusCmd.describe)
    .command('unlock', unlockCmd.describe)
    .command('rerun', rerunCmd.describe)
    .describe('config <path>', 'Configuration file path')
    .describe('db <url>', 'MongoDB connection URL')
    .describe('migrations-dir <path>', 'Migrations versions directory')
    .describe('backup', 'Enable automatic backups')
    .describe('backups-dir <path>', 'Backups directory')
    .describe('collection-name <name>', 'Migrations state collection')
    .describe('logs', 'Enable logs')
    .describe('chdir <path>', 'Change the working directory')
    .describe('version', 'Show package version')
    .describe('mongodumpBinary <path>', 'Binary file for mongodump (it can be a docker exec command)')
    .help('h', 'Show this help message')
    .alias('h', 'help')
    .locale('en_US')
    .parse();
let configFile;
if (argv.config) {
    configFile = require(path.resolve(argv.config));
}
else {
    configFile = {};
}
const workingDirectory = argv.chdir || configFile.chdir || process.cwd();
const config = {
    workingDirectory,
    // False disables logging
    logs: argv.logs || configFile.logs || true,
    // Null or a function
    logger: utils_1.logger,
    // Enable/disable info log "already at latest."
    logIfLatest: true,
    // Migrations collection name. Defaults to 'migrations'
    collectionName: argv.collectionName ||
        configFile.collectionName ||
        'migrations',
    // MongDB url
    db: argv.db || configFile.db || null,
    // Enable automatic backups
    backup: argv.backup || configFile.backup || false,
    // Directory to save backups
    backupsDir: path.resolve(argv.backupsDir ||
        configFile.backupsDir ||
        './migrations/backups'),
    migrationsDir: path.resolve(argv.migrationsDir ||
        configFile.migrationsDir ||
        './migrations'),
    mongodumpBinary: argv.mongodumpBinary ||
        configFile.mongodumpBinary ||
        'mongodump',
};
async function main() {
    validation.checkNoArgPassed(yargs, argv);
    const versions = fs.existsSync(config.migrationsDir)
        ? fs
            .readdirSync(config.migrationsDir)
            .filter((v) => v.match(new RegExp(/^[\d].[\d]$/)))
        : [];
    if (Object.keys(commands).indexOf(argv._[0]) > -1) {
        validation.checkMigrationDirExists(config);
        validation.createbackupDir(config);
        await commands[argv._[0]].action({
            config,
            versions,
            argv,
        });
    }
    else {
        utils_1.logger.error('Invalid command. Use --help option to show available commands.');
    }
    utils_1.exit();
}
main();
//# sourceMappingURL=index.js.map