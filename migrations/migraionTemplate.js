
/* Copyright (C) Airfordable, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Emmanuel Buah <emmanuel@airforable.com>, Aug 2016
 */
/*jshint esversion: 5 */
/* global require */
/*jslint node: true */

var Promise = require('bluebird');

exports.migrate = function(client, done) {
 var db = client.db;

	console.log('YEAH!!! Forward migration');
	done();
};

exports.rollback = function(client, done) {
	var db = client.db;

	console.log('YEAH!!! Backward migration');
	done();
};
