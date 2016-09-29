/* Copyright (C) Airfordable, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Emmanuel Buah <emmanuel@airforable.com>, Aug 2016
 */
/*jshint esversion: 6 */
/* global require */
/*jslint node: true */
'use strict';

import mongoose from './mongoose';


var rewardSchema = new mongoose.Schema({
  referrer: { type: String, required: true, index: true },
  referrerAmount: { type: String, required: true },
  referrerRedeemed:  { type: Boolean, required: true, default: false  },
  referree: { type: String, required: true, index: true },
  referreeAmount: { type: String, required: true },
  referreeRedeemed:  { type: Boolean, required: true, default: false },
}, {timestamps: true});

var Reward = mongoose.model('Reward', rewardSchema)

export default Reward;
