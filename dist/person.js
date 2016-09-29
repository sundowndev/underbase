/* Copyright (C) Airfordable, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Emmanuel Buah <emmanuel@airforable.com>, Aug 2016
 */
/*jshint esversion: 6 */
/* global require */
/*jslint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Person = function () {
  function Person(name) {
    _classCallCheck(this, Person);

    this.name = name;
  }

  _createClass(Person, [{
    key: 'sayHello',
    value: function sayHello() {
      return 'Hello ' + this.name + '!';
    }
  }, {
    key: 'sayHelloThreeTimes',
    value: function sayHelloThreeTimes() {
      var hello = this.sayHello();
      return (hello + ' ').repeat(3);
    }
  }]);

  return Person;
}();

exports.default = Person;