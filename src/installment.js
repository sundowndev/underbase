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

var Installment = mongoose.model('Installment', {
	amount: { type: Number, required: true },
	dueDate: { type: Date, required: true },
	paymentDate: { type: Date, required: false },
	status: { type: String, enum: ['Not Due Yet', 'Scheduled', 'Paid', 'Past Due', 'Charge Failed'], required: false, default: 'Not Due Yet' },
	paid: { type: Boolean, default: false },
	stripeChargeId :  { type: String },
	downPayment: false
});

export default Installment;
