/* Copyright (C) Airfordable, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Emmanuel Buah <emmanuel@airforable.com>, Aug 2016
 */
/*jshint esversion: 6 */
/* global require */
/*jslint node: true */
'use strict';

import {
    mongoose,
    migrator
} from './src';
import Promise from 'bluebird';
import sync from 'synchronize';
import * as everything from './src/migration/1.addAuthServices';

import {
    Migrations
} from './src/migration/migration';

    debugger;


sync.fiber(function(){
 sync.await(Migrations.config({
        // Log job run details to console
        log: true,

        // Use a custom logger function (defaults to Meteor's logging package)
        logger: null,

        // Enable/disable logging "Not migrating, already at version {number}"
        logIfLatest: true,

        // migrations collection name to use in the database
        collectionName: "migrations",

        dbUrl: "mongodb://localhost:27017/airfordable"
    },sync.defer()));

Migrations.migrateTo('latest');

});





//var Migrate =  migrator("mongodb://localhost:27017/airfordable");
//Migrate(1);
