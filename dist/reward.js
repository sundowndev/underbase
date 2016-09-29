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

var rewardSchema = new _mongoose2.default.Schema({
  referrer: { type: String, required: true, index: true },
  referrerAmount: { type: String, required: true },
  referrerRedeemed: { type: Boolean, required: true, default: false },
  referree: { type: String, required: true, index: true },
  referreeAmount: { type: String, required: true },
  referreeRedeemed: { type: Boolean, required: true, default: false }
}, { timestamps: true });

var Reward = _mongoose2.default.model('Reward', rewardSchema);

exports.default = Reward;