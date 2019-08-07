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
const backup = __importStar(require("../common/backup"));
const utils_2 = require("../common/utils");
exports.describe = 'Migrate to a specified version';
exports.action = async ({ config, versions, argv, }) => {
    const versionsArray = versions.map((v) => parseFloat(v));
    if (argv.migration !== 0 &&
        argv.migration !== 'latest' &&
        versionsArray.indexOf(parseFloat(argv.migration)) < 0) {
        utils_1.logger.error('This version does not exists.');
        return utils_1.exit();
    }
    versions = versionsArray.map((v) => v.toFixed(1));
    versionsArray.sort((a, b) => a - b);
    const migrator = await utils_2.initMigrator(config);
    for (const i in versions) {
        if (versions.hasOwnProperty(i)) {
            const migrationObj = await utils_1.importFile(`${config.migrationsDir}/${versions[i]}`);
            await migrator.add(migrationObj);
        }
    }
    if (config.backup) {
        const currentVersion = await migrator.getVersion();
        await backup.create(config, currentVersion);
    }
    const time = utils_1.timer();
    await migrator.migrateTo(argv.migration);
    utils_1.logger.log('');
    utils_1.logger.log('⌛', `Time spent: ${time.spent()} sec`);
};
//# sourceMappingURL=migrate.js.map