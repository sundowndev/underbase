/*
  Adds migration capabilities. Migrations are defined like:

  Migrations.add({
    up: function() {}, //*required* code to run to migrate upwards
    version: 1, //*required* number to identify migration order
    down: function() {}, //*optional* code to run to migrate downwards
    name: 'Something' //*optional* display name for the migration
  });

  The ordering of migrations is determined by the version you set.

  To run the migrations, set the MIGRATE environment variable to either
  'latest' or the version number you want to migrate to.

  e.g:
  MIGRATE="latest"  # ensure we'll be at the latest version and run the app
  MIGRATE="2,rerun"  # re-run the migration at that version

  Note: Migrations will lock ensuring only 1 app can be migrating at once. If
  a migration crashes, the control record in the migrations collection will
  remain locked and at the version it was at previously, however the db could
  be in an inconsistant state.
*/
// tslint:disable:variable-name
// tslint:disable:no-console

import { Promise as BluebirdPromise } from 'bluebird';
import * as _ from 'lodash';
import { Collection, Db, MongoClient } from 'mongodb';
import { typeCheck } from 'type-check';
const check = typeCheck;

export type SyslogLevels = 'debug' | 'info' | 'notice' | 'warning' | 'error' | 'crit' | 'alert';

export interface IMigrationOptions {
  log?: boolean;
  logger?: (level: SyslogLevels, ...args) => void;
  logIfLatest?: boolean;
  collectionName?: string;
  db: string | Db;
}
export interface IMigration {
  version: number;
  name: string;
  up: (db: Db) => void;
  down: (db: Db) => void;
}

export class Migration {

  // tslint:disable-next-line:no-empty
  private defaultMigration = { version: 0, up: () => { } };
  private _list: any[];
  private _collection: Collection;
  private _db: Db;
  private options: IMigrationOptions;

  constructor(opts?: IMigrationOptions) {
    // Since we'll be at version 0 by default, we should have a migration set for it.
    this._list = [this.defaultMigration];
    this.options = opts ? opts : {
      // False disables logging
      log: true,
      // Null or a function
      logger: null,
      // Enable/disable info log "already at latest."
      logIfLatest: true,
      // Migrations collection name
      collectionName: 'migrations',
      // Mongdb url or mongo Db instance
      db: null,
    };
  }

  public async config(opts?: IMigrationOptions): Promise<void> {

    this.options = Object.assign({}, this.options, opts);

    if (!this.options.logger && this.options.log) {
      this.options.logger = (level: string, ...args) => console.log(level,...args);
    }
    if (this.options.log === false) {
      // tslint:disable-next-line:no-empty
      this.options.logger = (level: string, ...args) => { };
    }
    if (!(this._db instanceof Db) && !this.options.db) {
      throw new ReferenceError('Option.db canno\'t be null');
    }
    let db: string | Db;
    if (typeof (this.options.db) === 'string') {
      db = await MongoClient.connect(this.options.db, {
        promiseLibrary: BluebirdPromise,
      });
    } else {
      db = this.options.db;
    }
    this._collection = db.collection(this.options.collectionName);
    this._db = db;
  }

  // Add a new migration:
  // {up: function *required
  //  Version: Number *required
  //  Down: function *optional
  //  Name: String *optional
  // }
  public add(migration: IMigration): void {

    if (typeof migration.up !== 'function') {
      throw new Error('Migration must supply an up function.');
    }

    if (typeof migration.version !== 'number') {
      throw new Error('Migration must supply a version number.');
    }

    if (migration.version <= 0) {
      throw new Error('Migration version must be greater than 0');
    }

    if (typeof migration.up === 'function' || typeof migration.down === 'function') {
      this.options.
        logger('warning', 'Prefer an async function (async | promise) for both up()/down() setup.' +
         ' This will ensure migration completes before version bump during execution');
    }

    // Freeze the migration object to make it hereafter immutable
    Object.freeze(migration);

    this._list.push(migration);
    this._list = _.sortBy(this._list, (m: any) => m.version);
  }

  /**
   * Attempts to run the migrations using command in the form of:
   * @example 'latest' - migrate to latest, 2, '2,rerun'
   * @example 2 - migrate to version 2
   * @example '2,rerun' - if at version 2, re-run up migration
   */
  public async migrateTo(command: string | number): Promise<void> {
    if (!this._db) {
      throw new Error('Migration instance has not be configured/initialized.' +
        ' Call <instance>.config(..) to initialize this instance');
    }

    if (_.isUndefined(command) || command === '' || this._list.length === 0) {
      throw new Error('Cannot migrate using invalid command: ' + command);
    }

    let version: string | number;
    let subcommand: string;
    if (typeof command === 'number') {
      version = command;
    } else {
      version = command.split(',')[0];
      subcommand = command.split(',')[1];
    }

    try {
      if (version === 'latest') {
        await this._migrateTo(_.last<any>(this._list).version);
      } else {
        await this._migrateTo(parseInt(version as string, null), (subcommand === 'rerun'));
      }
    } catch (e) {
      this.options.
        logger('info', `Encountered an error while migrating. Migration failed.`);
      throw e;
    }

  }

  // Returns the number of migrations
  public getNumberOfMigrations(): number {
    // Exclude default/base migration v0 since its not a configured migration
    return this._list.length - 1;
  }

  // Returns the current version
  public async getVersion(): Promise<number> {
    const control = await this._getControl();
    return control.version;
  }

  // Unlock control
  public unlock() {
    this._collection.update({ _id: 'control' }, { $set: { locked: false } });
  }

  // Reset (mainly intended for tests)
  public async _reset() {
    this._list = [this.defaultMigration];
    await this._collection.remove({});
  }

  // Migrates to the specific version passed in
  private async _migrateTo(version: any, rerun?: any): Promise<void> {
    const self = this;
    const control = await this._getControl(); // Side effect: upserts control document.
    let currentVersion = control.version;

    // Run the actual migration
    const migrate = async (direction, idx) => {
      const migration = self._list[idx];

      if (typeof migration[direction] !== 'function') {
        unlock();
        throw new Error('Cannot migrate ' + direction + ' on version ' + migration.version);
      }

      function maybeName() {
        return migration.name ? ' (' + migration.name + ')' : '';
      }

      this.options.logger('info',
        'Running ' + direction + '() on version ' + migration.version + maybeName());

      await migration[direction](self._db, migration);

    };

    // Returns true if lock was acquired.
    const lock = async () => {
      // This is atomic. The selector ensures only one caller at a time will see
      // The unlocked control, and locking occurs in the same update's modifier.
      // All other simultaneous callers will get false back from the update.
      const updateResult = await self._collection.update({
        _id: 'control',
        locked: false,
      }, {
          $set: {
            locked: true,
            lockedAt: new Date(),
          },
        });

      if (updateResult && updateResult.result.ok) {
        return true;
      } else {
        return false;
      }
    };

    // Side effect: saves version.
    const unlock = () => self._setControl({
      locked: false,
      version: currentVersion,
    });

    // Side effect: saves version.
    const updateVersion = async () => await self._setControl({
      locked: true,
      version: currentVersion,
    });

    if ((await lock()) === false) {
      this.options.logger('info', 'Not migrating, control is locked.');
      return;
    }

    if (rerun) {
      this.options.logger('info', 'Rerunning version ' + version);
      migrate('up', version);
      this.options.logger('info', 'Finished migrating.');
      await unlock();
      return;
    }

    if (currentVersion === version) {
      if (this.options.logIfLatest) {
        this.options.logger('info', 'Not migrating, already at version ' + version);
      }
      await unlock();
      return;
    }

    const startIdx = this._findIndexByVersion(currentVersion);
    const endIdx = this._findIndexByVersion(version);

    // Log.info('startIdx:' + startIdx + ' endIdx:' + endIdx);
    this.options.logger('info', 'Migrating from version ' + this._list[startIdx].version
      + ' -> ' + this._list[endIdx].version);

    if (currentVersion < version) {
      for (let i = startIdx; i < endIdx; i++) {
        try {
          await migrate('up', i + 1);
          currentVersion = self._list[i + 1].version;
          await updateVersion();
        } catch (e) {
          this.options.
            logger('error', `Encountered an error while migrating from ${i} to ${i + 1}`);
          throw e;
        }
      }
    } else {
      for (let i = startIdx; i > endIdx; i--) {
        try {
          await migrate('down', i);
          currentVersion = self._list[i - 1].version;
          await updateVersion();
        } catch (e) {
          this.options.
            logger('error', `Encountered an error while migrating from ${i} to ${i - 1}`);
          throw e;
        }
      }
    }

    await unlock();
    this.options.logger('info', 'Finished migrating.');
  }

  // Gets the current control record, optionally creating it if non-existant
  private async _getControl(): Promise<{ version: number, locked: boolean }> {
    const con = await this._collection.findOne({ _id: 'control' });
    return con || (await this._setControl({
      version: 0,
      locked: false,
    }));
  }

  // Sets the control record
  private async _setControl(control: { version: number, locked: boolean }) {
    // Be quite strict
    check('Number', control.version);
    check('Boolean', control.locked);

    const updateResult = await this._collection.update({
      _id: 'control',
    }, {
        $set: {
          version: control.version,
          locked: control.locked,
        },
      }, {
        upsert: true,
      });

    if (updateResult && updateResult.result.ok) {
      return control;
    } else {
      return null;
    }
  }

  // Returns the migration index in _list or throws if not found
  private _findIndexByVersion(version) {
    for (let i = 0; i < this._list.length; i++) {
      if (this._list[i].version === version) {
        return i;
      }
    }

    throw new Error('Can\'t find migration version ' + version);
  }

}
