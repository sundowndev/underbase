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

var Airport = mongoose.model('Airport', {
	name: { type: String, required: false },
	country: { type: String, required: false },
	code: { type: String, index: false, unique: false, required: false },
	city: { type: String, required: false }
});

export default Airport;
