/* Copyright (C) Airfordable, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Emmanuel Buah <emmanuel@airforable.com>, Aug 2016
 */
/*jshint esversion: 6 */
/* global require */
/*jslint node: true */
'use strict';


import Promise from 'bluebird';
import { Migrations } from './migrations';

let co = Promise.coroutine;



//setup test migrations
Migrations.add({
  version: 1,
  name: 'Version 1',
  up: (db) => {
    	console.log('YEAH!!! up at version 1');
  },
  down: (db) => {
    	console.log('YEAH!!! down at version 0');
  }
});

Migrations.add({
  version: 2,
  name: 'Version 2.',
  up: (db) => {
    	console.log('YEAH!!! up at version 2');
  },
  down: (db) => {
    	console.log('YEAH!!! down to version 1');
  }
});


//run simple migration test
co(function* () {

    yield* Migrations.config({
        // Log job run details to console
        log: true,

        // Use a custom logger function (defaults to Meteor's logging package)
        logger: null,

        // Enable/disable logging "Not migrating, already at version {number}"
        logIfLatest: true,

        // migrations collection name to use in the database
        collectionName: "_migration",

        dbUrl: "mongodb://localhost:27017/airfordable"
    });

    yield Migrations.migrateTo(1);

    yield Migrations.migrateTo(2);

    yield Migrations.migrateTo(1);

    yield Migrations.migrateTo('1,rerun');

    yield Migrations.migrateTo(0);

})();




/*var result = Promise.coroutine(function* () {
     console.log('before yield');
     yield Promise.resolve(3);
     return 4;
     console.log('after yield');
})();

result.then((r)=> console.log('value from promise',r));
//console.log('continue',result.value());*/
