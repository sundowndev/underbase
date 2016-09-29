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

var BookingPreviewSchema = new _mongoose2.default.Schema({
  userEmail: { type: String, required: true },
  departureDate: { type: Date, required: true },
  returnDate: { type: Date },
  fareCost: { type: Number, required: true },
  split: { type: Boolean, required: true }
});

var BookingPreview = _mongoose2.default.model('BookingPreview', BookingPreviewSchema);

exports.default = BookingPreview;