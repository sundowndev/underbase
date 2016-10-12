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
import Migrator from './../src/migrator';

let co = Promise.coroutine;

let migrator = Migrator.init("mongodb://localhost:27017/airfordable");

//test migrations
migrator.run(0).then(function(){
    console.log('migrated to 0');
}).catch(function(e){
    console.log(e);
}).then(() => migrator.run()).then(function(){
    console.log('migrated to latest - 1');
}).catch(function(e){
    console.log(e);
}).then(() => migrator.run(0)).then(function(){
    console.log('rollback to 0');
}).catch(function(e){
    console.log(e);
});
