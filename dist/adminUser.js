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

var _mongoose = require('./mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AdminUserSchema = new _mongoose2.default.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, index: true, unique: true, required: true },
  password: { type: String, required: true }
});

var AdminUser = _mongoose2.default.model('AdminUser', AdminUserSchema);

exports.default = AdminUser;