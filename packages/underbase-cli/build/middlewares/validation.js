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
exports.checkNoArgPassed = (yargs, argv) => {
    if (!argv._[0]) {
        yargs.showHelp();
        utils_1.exit();
    }
};
exports.checkMigrationDirExists = (config) => {
    if (!fs.existsSync(config.migrationsDir)) {
        utils_1.logger.warn('Migration directory does not exists. Please run underbase init.');
    }
};
exports.createbackupDir = (config) => {
    if (!fs.existsSync(config.backupsDir) && config.backup) {
        fs.mkdirpSync(config.backupsDir);
        utils_1.logger.info('Created backup directory.');
    }
};
//# sourceMappingURL=validation.js.map