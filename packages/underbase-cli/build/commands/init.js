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
exports.describe = 'Initiate migration environment';
exports.action = async ({ config }) => {
    if (!fs.existsSync(config.migrationsDir)) {
        await fs.mkdirpSync(config.migrationsDir);
        utils_1.logger.info('Created migration directory.');
    }
    else {
        utils_1.logger.info('Migration directory already exists.');
    }
    if (!fs.existsSync(config.backupsDir) && config.backup) {
        await fs.mkdirpSync(config.backupsDir);
        utils_1.logger.info('Created backup directory.');
    }
};
//# sourceMappingURL=init.js.map