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
  'latest' or the version number you want to migrate to. Optionally, append
  ',exit' if you want the migrations to exit the meteor process, e.g if you're
  migrating from a script (remember to pass the --once parameter).

  e.g:
  MIGRATE="latest" mrt # ensure we'll be at the latest version and run the app
  MIGRATE="latest,exit" mrt --once # ensure we'll be at the latest version and exit
  MIGRATE="2,exit" mrt --once # migrate to version 2 and exit

  Note: Migrations will lock ensuring only 1 app can be migrating at once. If
  a migration crashes, the control record in the migrations collection will
  remain locked and at the version it was at previously, however the db could
  be in an inconsistant state.
*/

/* Copyright (C) Airfordable, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Emmanuel Buah <emmanuel@airforable.com>, Aug 2016
 */
/*jshint esversion: 6 */
/* global require */
/*jslint node: true */
/*eslint rest-spread-spacing: ["error", "never"]*/


//import 'babel-polyfill'; //Needed only for es5 polyfills like generate not supported by node v4 less.
import  MongoClient from 'mongodb';
import Promise from 'bluebird';
import * as _ from 'lodash';
var check = require('type-check').typeCheck;

// since we'll be at version 0 by default, we should have a migration set for
// it.
let co = Promise.coroutine;
var DefaultMigration = {version: 0, up: function(){}};

export var Migrations = {
  _list: [DefaultMigration],
  options: {
    // false disables logging
    log: true,
    // null or a function
    logger: null,
    // enable/disable info log "already at latest."
    logIfLatest: true,
    // migrations collection name
    collectionName: "migrations",
    //mongdb url
    dbUrl: null
  },
  config:function* (opts) {
    var self = this;
    self.options = _.extend({}, self.options, opts);
    var db = yield MongoClient.connect(self.options.dbUrl,{
      promiseLibrary: Promise
    });
    self._collection = db.collection(self.options.collectionName);
    self._db = db;
  }
};




/*
  Logger factory function. Takes a prefix string and options object
  and uses an injected `logger` if provided, else falls back to
  Meteor's `Log` package.
  Will send a log object to the injected logger, on the following form:
    message: String
    level: String (info, warn, error, debug)
    tag: 'Migrations'
*/
function createLogger(prefix) {
  check(prefix, String);

  // Return noop if logging is disabled.
  if(Migrations.options.log === false) {
    return function() {};
  }

  return function(level, ...args) {
    //check(level, Match.OneOf('info', 'error', 'warn', 'debug'));
    var logger = Migrations.options && Migrations.options.logger;

    if(logger && _.isFunction(logger)) {

      logger({level, ...args });

    } else {
      console[level]({ level, ...args });
    }
  }
}

var log = createLogger('Migrations');

['info', 'warn', 'error', 'debug'].forEach(function(level) {
  log[level] = _.partial(log, level);
});

if (process.env.MIGRATE){
  Migrations.migrateTo(process.env.MIGRATE);
}


// Add a new migration:
// {up: function *required
//  version: Number *required
//  down: function *optional
//  name: String *optional
// }
Migrations.add = function(migration) {
  if (typeof migration.up !== 'function')
    throw new Error('Migration must supply an up function.');

  if (typeof migration.version !== 'number')
    throw new Error('Migration must supply a version number.');

  if (migration.version <= 0)
    throw new Error('Migration version must be greater than 0');

  // Freeze the migration object to make it hereafter immutable
  Object.freeze(migration);

  this._list.push(migration);
  this._list = _.sortBy(this._list, function(m) {return m.version;});
}


// Attempts to run the migrations using command in the form of:
// e.g 'latest', 'latest,exit', 2
// use 'XX,rerun' to re-run the migration at that version
Migrations.migrateTo = co(function* (command) {
  var self = this;
  if (_.isUndefined(command) || command === '' || this._list.length === 0)
    throw new Error("Cannot migrate using invalid command: " + command);

  if (typeof command === 'number') {
    var version = command;
  } else {
    var version = command.split(',')[0];//.trim();
    var subcommand = command.split(',')[1];//.trim();
  }

  try {
      if (version === 'latest') {
          yield* self._migrateTo(_.last(self._list).version);
      } else {
          yield* this._migrateTo(parseInt(version), (subcommand === 'rerun'));
      }
  } catch (e) {
      throw e;
  }

  // remember to run meteor with --once otherwise it will restart
  if (subcommand === 'exit')
    process.exit(0);
});

// just returns the current version
Migrations.getVersion = function* () {
  let control = yield this._getControl();
  return control.version;
}

// migrates to the specific version passed in
Migrations._migrateTo = function* (version, rerun) {
  var self = this;
  var control = yield this._getControl(); // Side effect: upserts control document.
  var currentVersion = control.version;

  // run the actual migration
  let migrate = co(function* (direction, idx) {
    var migration = self._list[idx];

    if (typeof migration[direction] !== 'function') {
      unlock();
      throw new Error('Cannot migrate ' + direction + ' on version '+ migration.version);
    }

    function maybeName() {
      return migration.name ? ' (' + migration.name + ')' : '';
    }

    log.info('Running ' + direction + '() on version '+ migration.version + maybeName());

    if(migration[direction].constructor.name === 'GeneratorFunction'){ //if its a generator func
        yield* migration[direction](self._db,migration);
    } else if(migration[direction].then){ //if its a promise
          yield migration[direction](self._db,migration);
      } else {
       migration[direction](self._db,migration);
    }

  });


  // Returns true if lock was acquired.
  let lock = co(function* (){
    // This is atomic. The selector ensures only one caller at a time will see
    // the unlocked control, and locking occurs in the same update's modifier.
    // All other simultaneous callers will get false back from the update.
        var updateResult = yield self._collection.update(
        {_id: 'control', locked: false}, {$set: {locked: true, lockedAt: new Date()}});

        if(updateResult && updateResult.result.ok)
         return true;
        else
         return false;
  });

  // Side effect: saves version.
  let unlock = () => self._setControl({locked: false, version: currentVersion});


  if ((yield lock()) === false) {
    log.info('Not migrating, control is locked.');
    return;
  }

  if (rerun) {
    log.info('Rerunning version ' + version);
    migrate('up', version);
    log.info('Finished migrating.');
    yield unlock();
    return;
  }

  if (currentVersion === version) {
    if (Migrations.options.logIfLatest) {
      log.info('Not migrating, already at version ' + version);
    }
    yield unlock();
    return;
  }

  var startIdx = this._findIndexByVersion(currentVersion);
  var endIdx = this._findIndexByVersion(version);


  // log.info('startIdx:' + startIdx + ' endIdx:' + endIdx);
  log.info('Migrating from version ' + this._list[startIdx].version
    + ' -> ' + this._list[endIdx].version);


  if (currentVersion < version) {
    for (var i = startIdx;i < endIdx;i++) {
      migrate('up', i + 1);
      currentVersion = self._list[i + 1].version;
    }
  } else {
    for (var i = startIdx;i > endIdx;i--) {
      migrate('down', i);
      currentVersion = self._list[i - 1].version;
    }
  }

  yield unlock();
  log.info('Finished migrating.');
}

// gets the current control record, optionally creating it if non-existant
Migrations._getControl = co(function* () {
  var self = this;
  var con = yield self._collection.findOne({_id: 'control'});
  return con || (yield self._setControl({version: 0, locked: false}));

});

// sets the control record
Migrations._setControl = co(function* (control) {
  // be quite strict
  let self = this;
  check('Number',control.version);
  check('Boolean',control.locked);

  let updateResult = yield self._collection.update({_id: 'control'},
  {$set: {version: control.version, locked: control.locked}}, {upsert: true})

  if(updateResult && updateResult.result.ok)
   return control;
  else
   return null;
});


// returns the migration index in _list or throws if not found
Migrations._findIndexByVersion = function(version) {
  for (var i = 0;i < this._list.length;i++) {
    if (this._list[i].version === version)
      return i;
  }

  throw new Error('Can\'t find migration version ' + version);
}


//reset (mainly intended for tests)
Migrations._reset = function() {
  this._list = [{version: 0, up: function(){}}];
  this._collection.remove({});
}

// unlock control
Migrations.unlock = function() {
  this._list = [{version: 0, up: function(){}}];
  this._collection.update({_id: "control"}, {$set: {locked: false}});
}
