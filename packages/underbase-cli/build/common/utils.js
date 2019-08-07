"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@underbase/core");
const utils_1 = require("@underbase/utils");
/**
 * Initialize migrator constructor
 * @param {IConfigFile} config - Config object
 * @ignore
 * @private
 */
exports.initMigrator = async (config) => {
    utils_1.logger.info('Connecting to MongoDB...');
    await core_1.migrator.config(config); // Returns a promise
    return core_1.migrator;
};
//# sourceMappingURL=utils.js.map