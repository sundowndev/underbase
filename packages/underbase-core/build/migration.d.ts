import { IMigration, IMigrationOptions } from '@underbase/types';
export declare class Migration {
    private defaultMigration;
    private _list;
    private _collection;
    private _db;
    private options;
    /**
     * Creates an instance of Migration.
     * @param {IMigrationOptions} [opts]
     * @memberof Migration
     */
    constructor(opts?: IMigrationOptions);
    /**
     * Get migration configuration
     *
     * @returns {IMigrationOptions}
     * @memberof Migration
     */
    getConfig(): IMigrationOptions;
    /**
     * Get migrations
     *
     * @returns {any[]}
     * @memberof Migration
     */
    getMigrations(): any[];
    /**
     * Indicate if the migration state is locked or not
     *
     * @returns {Promise<boolean>}
     * @memberof Migration
     */
    isLocked(): Promise<boolean>;
    /**
     * Configure migration
     *
     * @param {IMigrationOptions} [opts]
     * @returns {Promise<void>}
     * @memberof Migration
     */
    config(opts?: IMigrationOptions): Promise<void>;
    /**
     * Add a new migration
     *
     * @param {IMigration} migration
     * @memberof Migration
     */
    add(migration: IMigration): void;
    /**
     * Run the migrations using command in the form of:
     * @example 'latest' - migrate to latest, 2, '2,rerun'
     * @example 2 - migrate to version 2
     * @example '2,rerun' - if at version 2, re-run up migration
     */
    migrateTo(command: string | number): Promise<void>;
    /**
     * Returns the number of migrations
     *
     * @returns {number}
     * @memberof Migration
     */
    getNumberOfMigrations(): number;
    /**
     * Returns the current version
     *
     * @returns {Promise<number>}
     * @memberof Migration
     */
    getVersion(): Promise<number>;
    /**
     * Unlock control
     *
     * @memberof Migration
     */
    unlock(): Promise<any>;
    /**
     * Reset migration configuration. This is intended for dev and test mode only. Use wisely
     *
     * @returns {Promise<void>}
     * @memberof Migration
     */
    reset(): Promise<void>;
    /**
     * Migrate to the specific version passed in
     *
     * @private
     * @param {string | number} version
     * @param {boolean} [rerun]
     * @returns {Promise<void>}
     * @memberof Migration
     */
    private execute;
    /**
     * Gets the current control record, optionally creating it if non-existant
     *
     * @private
     * @returns {Promise<{ version: number, locked: boolean }>}
     * @memberof Migration
     */
    private getControl;
    /**
     * Set the control record
     *
     * @private
     * @param {{ version: number, locked: boolean }} control
     * @returns {(Promise<{ version: number, locked: boolean } | null>)}
     * @memberof Migration
     */
    private setControl;
    /**
     * Returns the migration index in _list or throws if not found
     *
     * @private
     * @param {string | number} version
     * @returns {number}
     * @memberof Migration
     */
    private findIndexByVersion;
}
//# sourceMappingURL=migration.d.ts.map