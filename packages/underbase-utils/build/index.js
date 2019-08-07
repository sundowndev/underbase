"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-console
const chalk_1 = __importDefault(require("chalk"));
/**
 * CLI logging
 *
 * @ignore
 * @private
 * @returns object
 */
exports.logger = {
    info: (...args) => {
        console.log(chalk_1.default.bold('[INFO]'), ...args);
    },
    warn: (...args) => {
        console.log(chalk_1.default.bold('[WARNING]'), ...args);
    },
    success: (...args) => {
        console.log(chalk_1.default.green(`✔ ${args.join(' ')}`));
    },
    error: (...args) => {
        console.log(chalk_1.default.bgRed('ERROR'), chalk_1.default.red(`${args.join(' ')}`));
    },
    log: (...args) => {
        console.log(...args);
    },
};
/**
 * Runtime timer
 * @ignore
 * @private
 */
exports.timer = () => {
    const t0 = new Date().getTime();
    return {
        spent() {
            const t1 = new Date().getTime();
            return (t1 - t0) / 1000;
        },
    };
};
/**
 * Exits Underbase
 * @param {number} code - Exit code; typically # of failures
 * @ignore
 * @private
 */
exports.exit = (code = 0) => {
    process.exit(code);
};
/**
 * Import migration files
 * @param {string} path - Path to file to be imported
 * @ignore
 * @private
 */
exports.importFile = async (path) => {
    // tslint:disable-next-line: no-var-requires
    require = require('esm')(module);
    try {
        return await require(path).default;
    }
    catch (error) {
        throw new Error(error);
    }
};
//# sourceMappingURL=index.js.map