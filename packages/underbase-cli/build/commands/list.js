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
exports.describe = 'Show available migrations versions';
exports.action = async ({ config, versions, }) => {
    if (fs.existsSync(config.migrationsDir)) {
        utils_1.logger.info('Versions list based on folders');
        versions.forEach((v) => utils_1.logger.log(`- ${v}`));
    }
};
//# sourceMappingURL=list.js.map