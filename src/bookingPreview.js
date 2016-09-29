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

var BookingPreviewSchema = new mongoose.Schema({
	userEmail: { type: String, required: true },
  departureDate: { type: Date, required: true },
  returnDate: { type: Date },
  fareCost: { type: Number, required: true },
  split: { type: Boolean, required: true }
});

var BookingPreview = mongoose.model('BookingPreview', BookingPreviewSchema);

export default BookingPreview;
