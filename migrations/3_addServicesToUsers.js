
/* Copyright (C) Airfordable, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Emmanuel Buah <emmanuel@airforable.com>, Sept 2016
 */
/*jshint esversion: 5 */
/* global require */
/*jslint node: true */

var Promise = require('bluebird');

exports.migrate = function(client, done) {
 //var connect = Promise.promisify(client.db.connect), insert()
 var db = client.db;

	console.log('YEAH!!! Running migration 3');
	done();
};

exports.rollback = function(client, done) {
	var db = client.db;
		console.log('YEAH!!! Rolling back migration 3');
	done();
};
