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
exports.describe = 'Rerun the current version';
exports.action = async ({ config, versions, }) => {
    const versionsArray = versions.map((v) => parseFloat(v));
    versions = versionsArray.map((v) => v.toFixed(1));
    versionsArray.sort((a, b) => a - b);
    const migrator = await utils_2.initMigrator(config);
    for (const i in versions) {
        if (versions.hasOwnProperty(i)) {
            const migrationObj = await utils_1.importFile(`${config.migrationsDir}/${versions[i]}`);
            await migrator.add(migrationObj);
        }
    }
    const currentVersion = await migrator.getVersion();
    if (config.backup) {
        await backup.create(config, currentVersion);
    }
    const time = utils_1.timer();
    await migrator.migrateTo(`${currentVersion},rerun`);
    utils_1.logger.log('');
    utils_1.logger.log('⌛', `Time spent: ${time.spent()} sec`);
};
//# sourceMappingURL=rerun.js.map