/* Copyright (C) Airfordable, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Emmanuel Buah <emmanuel@airforable.com>, Aug 2016
 */
/*jshint esversion: 6 */
/* global require */
/*jslint node: true */
'use strict';

import Migrator from 'east/lib/migrator';
import path  from 'path';
import { execSync } from 'child_process';

export default function migrator(dbUrl){

 return (migrationNumber) => {
  var east_path = path.join(__dirname,'../node_modules/east/bin/east');
  var east_dir = path.join(__dirname, "../migrations");
  var command;
  console.log(`${east_path} migrate --dir ${east_dir} --adapter east-mongo --url ${dbUrl}`);
  if(migrationNumber){
    command = `${east_path} migrate ${migrationNumber} --dir ${east_dir} --adapter east-mongo --url ${dbUrl}`
  } else {
    command = `${east_path} migrate --dir ${east_dir} --adapter east-mongo --url ${dbUrl}`
  }
  var cmd = execSync(command, { stdio: 'inherit' },
    (error, stdout, stderr) => {
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
      if (error !== null) {
          console.log(`exec error: ${error}`);
      }
  });

};

}
