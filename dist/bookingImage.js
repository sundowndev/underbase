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

var BookingImage = _mongoose2.default.model('Image', {
	data: { type: String, required: true },
	bookingId: { type: String },
	type: { type: String, enum: ["User Upload", "SAD", "ICA", "eTicket"], required: true },
	userId: { type: String },
	_user: { type: String, ref: 'User', required: true },
	_booking: { type: String, ref: 'Booking', required: true }
});

exports.default = BookingImage;