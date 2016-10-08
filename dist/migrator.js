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
exports.default = migrator;

var _migrator = require('east/lib/migrator');

var _migrator2 = _interopRequireDefault(_migrator);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function migrator(dbUrl) {

  return function (migrationNumber) {
    var east_path = _path2.default.join(__dirname, '../node_modules/east/bin/east');
    var east_dir = _path2.default.join(__dirname, "../migrations");
    var command;
    console.log(east_path + ' migrate --dir ' + east_dir + ' --adapter east-mongo --url ' + dbUrl);
    if (migrationNumber) {
      command = east_path + ' migrate ' + migrationNumber + ' --dir ' + east_dir + ' --adapter east-mongo --url ' + dbUrl;
    } else {
      command = east_path + ' migrate --dir ' + east_dir + ' --adapter east-mongo --url ' + dbUrl;
    }
    var cmd = (0, _child_process.execSync)(command, { stdio: 'inherit' }, function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });
  };
}