/* Copyright (C) Airfordable, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Emmanuel Buah <emmanuel@airforable.com>, Aug 2016
 */
/*jshint esversion: 6 */
/* global require */
/*jslint node: true */
'use strict';

import { Migrations } from './../migrations.pkg/migrations';
import './migrations';
import Promise from 'bluebird';
import { isNil } from 'lodash';

let co = Promise.coroutine;

debugger;

export default {
   /**
   * @description Initialize migrator
   * @param {String} dbUrl - Database connection url.
   * @param {Object} logger - Logger object.
   * @return {Object} Migrator - Migrator.
   */
   init (dbUrl,logger) {
      this.dbUrl = dbUrl;
      this.logger = logger;
      return this;
   },

     /**
     * @param {String} version - migration version. Defaults to latest.
     * @return {Promise} promise - object.
     */
     run : co(function* (version)  {
       let self = this;

       if(self.dbUrl){

           try{
             yield* Migrations.config({
                 // Log job run details to console
                 log: true,
                 // Use a custom logger function (defaults to Meteor's logging package)
                 logger: self.logger? self.logger: null,
                 // Enable/disable logging "Not migrating, already at version {number}"
                 logIfLatest: true,
                 // migrations collection name to use in the database
                 collectionName: "_migration",
                 //db connection string
                 dbUrl: self.dbUrl
             });
             yield Migrations.migrateTo((!isNil(version))? version : 'latest');
           } catch (e){
             return Promise.reject(e);
           }

       } else {
          return Promise.reject(Error("dbUrl can't be null")) ;
       }
     })
 }
