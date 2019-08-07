"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@underbase/utils");
const utils_2 = require("../common/utils");
exports.describe = 'Show migrations status';
exports.action = async ({ config }) => {
    const migrator = await utils_2.initMigrator(config);
    const currentVersion = await migrator.getVersion();
    const isLocked = (await migrator.isLocked()) ? 'locked' : 'not locked';
    utils_1.logger.info(`Current version is ${currentVersion}`);
    utils_1.logger.info(`Migration state is ${isLocked}`);
};
//# sourceMappingURL=status.js.map