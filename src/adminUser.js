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

var AdminUserSchema = new mongoose.Schema({
	firstName: { type: String },
	lastName: { type: String },
	email: { type: String, index: true, unique: true, required: true },
	password: { type: String, required: true }
})

var AdminUser = mongoose.model('AdminUser', AdminUserSchema);

export default AdminUser;
