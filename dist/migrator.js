/* Copyright (C) Airfordable, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Emmanuel Buah <emmanuel@airforable.com>, Aug 2016
 */
/*jshint esversion: 6 */
/* global require */
/*jslint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _migrations = require('./../migrations.pkg/migrations');

require('./migrations');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var co = _bluebird2.default.coroutine;

exports.default = {
   /**
   * @description Initialize migrator
   * @param {String} dbUrl - Database connection url.
   * @param {Object} logger - Logger object.
   * @return {Object} Migrator - Migrator.
   */
   init: function init(dbUrl, logger) {
      undefined.dbUrl = dbUrl;
      undefined.logger = logger;
      return undefined;
   },

   /**
   * @param {String} version - migration version. Defaults to latest.
   * @return {Promise} promise - object.
   */
   run: function run(version) {
      var self = undefined;

      if (self.dbUrl) {
         return co(function* () {
            yield* _migrations.Migrations.config({
               // Log job run details to console
               log: true,

               // Use a custom logger function (defaults to Meteor's logging package)
               logger: self.logger ? self.logger : null,

               // Enable/disable logging "Not migrating, already at version {number}"
               logIfLatest: true,

               // migrations collection name to use in the database
               collectionName: "_migration",

               dbUrl: self.dbUrl
            });
            _migrations.Migrations.migrateTo(version ? version : 'latest');
         })();
      } else {
         return _bluebird2.default.reject(Error("dbUrl can't be null"));
      }
   }
};