"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@underbase/utils");
const utils_2 = require("../common/utils");
exports.describe = 'Unlock migrations state';
exports.action = async ({ config }) => {
    const migrator = await utils_2.initMigrator(config);
    if (await migrator.isLocked()) {
        const time = utils_1.timer();
        await migrator.unlock(); // Returns a promise
        utils_1.logger.info(`Migration state unlocked.`);
        utils_1.logger.info(`Time spent: ${time.spent()} sec`);
    }
    else {
        utils_1.logger.info(`Migration state is already unlocked.`);
    }
};
//# sourceMappingURL=unlock.js.map