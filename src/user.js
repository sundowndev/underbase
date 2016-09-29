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

var UserSchema = new mongoose.Schema({

  firstName: { type: String, required: true, index: true },
  lastName: { type: String, required: true, index: true },
  email: { type: String, index: true, unique: true, required: true },
  /**
  * services holds all user local and third parter auth account
  * {  password : { bcrypt : xxxx }, facebook: { accessToken, id, etc }, google : { ..} etc }
  services: { type: Object, required: false, default: {} },
  */
  password: { type: String, required: true },
  phoneNumber: { type: String },
  dob: { type: Date },
  gender: { type: String, enum: ['Male', 'Female'] },
  referrer: { type: String },
  agentCode: { type: String },
  fee: { type: Number,  default: 20 },
  /*  mailingAddres: {
      streetAddress: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String },
    }
    */
  streetAddress: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
  country: { type: String },


  wishList: { type: Array, default: []},
  seatPreference: { type: String, enum: ['No Preference', 'Aisle', 'Middle', 'Window'] },

  resetToken: { type: String },
  tokenExpiration: { type: Date },
  confirmationToken: { type: String },
  stripeCustomerId: { type: String },
  bookings: {
    inprogress :{ type: Number, default: 0 },
    completed :{ type: Number , default: 0},
    defaulted :{ type: Number , default: 0},
    denied : { type: Number , default: 0}
  },
  photo: { type: String, required: false },
  timezone: { type: String, required: false },

}, {timestamps: true} );

var User = mongoose.model('User', UserSchema);


export default User;
