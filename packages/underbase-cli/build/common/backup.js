"use strict";
// tslint:disable no-console
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@underbase/utils");
const child_process_1 = require("child_process");
exports.create = (config, version) => new Promise(resolve => {
    utils_1.logger.info('Creating backup...');
    const dbUrlSegments = config.db.split('/');
    let host;
    let database;
    if (dbUrlSegments[0] === 'mongodb:' && dbUrlSegments[1] === '') {
        host = dbUrlSegments[2];
        database = dbUrlSegments[3];
    }
    else {
        host = dbUrlSegments[0];
        database = dbUrlSegments[1];
    }
    const backupFile = [version.toFixed(1), `${Date.now()}.gz`].join('_');
    const cmd = [
        config.mongodumpBinary,
        `--host ${host}`,
        `--archive=${config.backupsDir}/${backupFile}`,
        `--gzip --db ${database}`,
    ].join(' ');
    child_process_1.exec(cmd, error => {
        if (error) {
            utils_1.logger.error('An error occured while creating backup... Cancelling migration.');
            console.error(error);
            utils_1.exit();
        }
        utils_1.logger.info(`Backup created : ${config.backupsDir}/${backupFile}`);
        return resolve();
    });
});
//# sourceMappingURL=backup.js.map