'use strict';

var _migration = require('./migration');

_migration.Migrations.add({
  version: 1,
  name: 'Adds pants to some people in the db.',
  up: function up(db) {
    console.log('YEAH!!! up at version 1');
  },
  down: function down(db) {
    console.log('YEAH!!! down at version 1');
  }
}); /* Copyright (C) Airfordable, Inc - All Rights Reserved
     * Unauthorized copying of this file, via any medium is strictly prohibited
     * Proprietary and confidential
     * Written by Emmanuel Buah <emmanuel@airforable.com>, Aug 2016
     */
/*jshint esversion: 6 */
/* global require */
/*jslint node: true */