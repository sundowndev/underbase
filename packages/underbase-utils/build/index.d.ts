/**
 * CLI logging
 *
 * @ignore
 * @private
 * @returns object
 */
export declare const logger: any;
/**
 * Runtime timer
 * @ignore
 * @private
 */
export declare const timer: () => {
    spent(): number;
};
/**
 * Exits Underbase
 * @param {number} code - Exit code; typically # of failures
 * @ignore
 * @private
 */
export declare const exit: (code?: number) => void;
/**
 * Import migration files
 * @param {string} path - Path to file to be imported
 * @ignore
 * @private
 */
export declare const importFile: (path: string) => Promise<any>;
//# sourceMappingURL=index.d.ts.map