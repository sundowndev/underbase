!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.migrator=e():t.migrator=e()}(global,function(){return function(t){var e={};function o(i){if(e[i])return e[i].exports;var n=e[i]={i:i,l:!1,exports:{}};return t[i].call(n.exports,n,n.exports,o),n.l=!0,n.exports}return o.m=t,o.c=e,o.d=function(t,e,i){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(o.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)o.d(i,n,function(e){return t[e]}.bind(null,n));return i},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="",o(o.s=0)}([function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const i=o(2);e.Migration=i.Migration;const n=new i.Migration;e.migrator=n},function(t,e){t.exports=require("chalk")},function(t,e,o){"use strict";var i=this&&this.__awaiter||function(t,e,o,i){return new(o||(o=Promise))(function(n,r){function s(t){try{l(i.next(t))}catch(t){r(t)}}function c(t){try{l(i.throw(t))}catch(t){r(t)}}function l(t){t.done?n(t.value):new o(function(e){e(t.value)}).then(s,c)}l((i=i.apply(t,e||[])).next())})};Object.defineProperty(e,"__esModule",{value:!0});const n=o(3),r=o(1),s=o(4),c=o(5),l=o(6),u=o(7),d=o(10),a=l.typeCheck;e.Migration=class{constructor(t){this.defaultMigration={version:0,up:()=>{}},this._list=[this.defaultMigration],this.options=t||{logs:!0,logger:null,logIfLatest:!0,collectionName:"migrations",db:null}}getConfig(){return this.options}getMigrations(){return this._list}isLocked(){return i(this,void 0,void 0,function*(){return null!==(yield this._collection.findOne({_id:"control",locked:!0}))})}config(t){return i(this,void 0,void 0,function*(){if(this.options=Object.assign({},this.options,t),!this.options.logger&&this.options.logs&&(this.options.logger=u.logger),!1===this.options.logs&&(this.options.logger=(...t)=>{}),!(this._db instanceof c.Db||this.options.db))throw new ReferenceError("Option.db canno't be null");let e;e="string"==typeof this.options.db?(yield c.MongoClient.connect(this.options.db,{promiseLibrary:n.Promise,useNewUrlParser:!0})).db():this.options.db,this._collection=e.collection(this.options.collectionName),this._db=e})}add(t){if("function"!=typeof t.up)throw new Error("Migration must supply an up function.");if("function"!=typeof t.down)throw new Error("Migration must supply a down function.");if("number"!=typeof t.version)throw new Error("Migration must supply a version number.");if(t.version<=0)throw new Error("Migration version must be greater than 0");Object.freeze(t),this._list.push(t),this._list=s.sortBy(this._list,t=>t.version)}migrateTo(t){return i(this,void 0,void 0,function*(){if(!this._db)throw new Error("Migration instance has not be configured/initialized. Call <instance>.config(..) to initialize this instance");if(s.isUndefined(t)||""===t||0===this.getMigrations().length)throw new Error("Cannot migrate using invalid command: "+t);let e,o;"number"==typeof t?e=t:(e=t.split(",")[0],o=t.split(",")[1]);try{"latest"===e?yield this.execute(s.last(this.getMigrations()).version):yield this.execute(parseFloat(e),"rerun"===o)}catch(t){throw this.options.logger.info("Encountered an error while migrating. Migration failed."),t}})}getNumberOfMigrations(){return this.getMigrations().length-1}getVersion(){return i(this,void 0,void 0,function*(){return(yield this.getControl()).version})}unlock(){return i(this,void 0,void 0,function*(){yield this._collection.updateOne({_id:"control"},{$set:{locked:!1}})})}reset(){return i(this,void 0,void 0,function*(){this._list=[this.defaultMigration],yield this._collection.deleteMany({})})}execute(t,e){return i(this,void 0,void 0,function*(){const o=this;let n=(yield this.getControl()).version;const s=(t,e)=>i(this,void 0,void 0,function*(){const n=o.getMigrations()[e];if("function"!=typeof n[t])throw yield c(),new Error("Cannot migrate "+t+" on version "+n.version);this.options.logger.log("\n",r.default.yellow("Running "+t+"() on version "+n.version)),n.describe&&this.options.logger.log(" ".repeat(4),r.default.grey(n.describe)),"AsyncFunction"!==n[t].constructor.name&&"Promise"!==n[t].constructor.name&&this.options.logger.log(" ".repeat(4),r.default.bold("[WARNING]"),r.default.yellow(`One of the ${t} functions is nor Async or Promise (${n.describe||"not described"})`));const s={MongoClient:this._db,Migrate:e=>i(this,void 0,void 0,function*(){for(const o in e)if(e.hasOwnProperty(o)){"AsyncFunction"!==e[o][t].constructor.name&&"Promise"!==e[o][t].constructor.name&&this.options.logger.warn(`One of the ${t} functions is nor Async or Promise`,`(${e[o].describe||"not described"})`),e[o].describe&&this.options.logger.log(" ".repeat(8),r.default.grey(e[o].describe));try{yield e[o][t](s)}catch(t){throw new Error(t)}}}),Query:new d.QueryInterface(o._db),Logger:(...t)=>this.options.logger.log(" ".repeat(8),r.default.inverse("LOGGER"),...t)};try{yield n[t](s),this.options.logger.log("")}catch(t){throw new Error(t)}}),c=()=>o.setControl({locked:!1,version:n}),l=()=>i(this,void 0,void 0,function*(){return yield o.setControl({locked:!0,version:n})});if(!1===(yield(()=>i(this,void 0,void 0,function*(){const t=yield o._collection.findOneAndUpdate({_id:"control",locked:!1},{$set:{locked:!0,lockedAt:new Date}});return null!=t.value&&1===t.ok}))()))return void this.options.logger.info("Not migrating, control is locked.");if(e)return this.options.logger.info("Rerunning version "+t),yield s("up",this.findIndexByVersion(t)),this.options.logger.success("Finished migrating"),void(yield c());if(n===t)return this.options.logIfLatest&&this.options.logger.error("Not migrating, already at version "+t),void(yield c());const u=this.findIndexByVersion(n),a=this.findIndexByVersion(t);if(this.options.logger.info("Migrating from version "+this.getMigrations()[u].version+" -> "+this.getMigrations()[a].version),n<t)for(let e=u;e<a;e++)try{yield s("up",e+1),n=o.getMigrations()[e+1].version,yield l()}catch(e){throw this.options.logger.error(`Encountered an error while migrating from ${n} to ${t}`),e}else for(let e=u;e>a;e--)try{yield s("down",e),n=o.getMigrations()[e-1].version,yield l()}catch(e){throw this.options.logger.error(`Encountered an error while migrating from ${n} to ${t}`),e}yield c(),this.options.logger.success("Finished migrating.")})}getControl(){return i(this,void 0,void 0,function*(){return(yield this._collection.findOne({_id:"control"}))||(yield this.setControl({version:0,locked:!1}))})}setControl(t){return i(this,void 0,void 0,function*(){a("Number",t.version),a("Boolean",t.locked);const e=yield this._collection.updateOne({_id:"control"},{$set:{version:t.version,locked:t.locked}},{upsert:!0});return e&&e.result.ok?t:null})}findIndexByVersion(t){for(let e=0;e<this.getMigrations().length;e++)if(this.getMigrations()[e].version===t)return e;throw new Error("Can't find migration version "+t)}}},function(t,e){t.exports=require("bluebird")},function(t,e){t.exports=require("lodash")},function(t,e){t.exports=require("mongodb")},function(t,e){t.exports=require("type-check")},function(t,e,o){"use strict";(function(t){var i,n=this&&this.__awaiter||function(t,e,o,i){return new(o||(o=Promise))(function(n,r){function s(t){try{l(i.next(t))}catch(t){r(t)}}function c(t){try{l(i.throw(t))}catch(t){r(t)}}function l(t){t.done?n(t.value):new o(function(e){e(t.value)}).then(s,c)}l((i=i.apply(t,e||[])).next())})};Object.defineProperty(e,"__esModule",{value:!0});const r=o(1),s=o(0);e.initMigrator=t=>n(this,void 0,void 0,function*(){return e.logger.info("Connecting to MongoDB..."),yield s.migrator.config(t),s.migrator}),e.logger={info:(...t)=>{console.log(r.default.bold("[INFO]"),...t)},warn:(...t)=>{console.log(r.default.bold("[WARNING]"),...t)},success:(...t)=>{console.log(r.default.green(`✔ ${t.join(" ")}`))},error:(...t)=>{console.log(r.default.bgRed("ERROR"),r.default.red(`${t.join(" ")}`))},log:(...t)=>{console.log(...t)}},e.timer=()=>{const t=(new Date).getTime();return{spent:()=>((new Date).getTime()-t)/1e3}},e.exit=(t=0)=>{process.exit()},e.importFile=e=>n(this,void 0,void 0,function*(){i=o(9)(t);try{return(yield i(e)).default}catch(t){throw new Error(t)}})}).call(this,o(8)(t))},function(t,e){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),t.webpackPolyfill=1),t}},function(t,e){t.exports=require("esm")},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const i=o(11);e.QueryInterface=class{constructor(t){this.collection=t=>(this._collection=this._db.collection(t),new i.MongoCollection(t,this._collection,this._db)),this._db=t}}},function(t,e,o){"use strict";var i=this&&this.__awaiter||function(t,e,o,i){return new(o||(o=Promise))(function(n,r){function s(t){try{l(i.next(t))}catch(t){r(t)}}function c(t){try{l(i.throw(t))}catch(t){r(t)}}function l(t){t.done?n(t.value):new o(function(e){e(t.value)}).then(s,c)}l((i=i.apply(t,e||[])).next())})};Object.defineProperty(e,"__esModule",{value:!0});e.MongoCollection=class{constructor(t,e,o){this.rename=(t,e)=>{const o={};return o[t]=e,this._updateQuery={$rename:o},{where:this.where}},this.unset=t=>{const e={};if("string"==typeof t)e[t]=1;else{if(!Array.isArray(t))throw new Error("Field name in .unset() must of type string or array.");for(const o of t)e[o]=1}return this._updateQuery={$unset:e},{where:this.where}},this.set=(t,e)=>{const o={};return o[t]=e,this._updateQuery={$set:o||{}},{where:this.where}},this.drop=()=>i(this,void 0,void 0,function*(){return yield this._db.dropCollection(this._collectionName)}),this.count=(t={})=>i(this,void 0,void 0,function*(){return this._whereQuery=t,yield this._collection.find(this._whereQuery,{}).count()}),this.where=(t={})=>i(this,void 0,void 0,function*(){return this._whereQuery=t,yield this.execute()}),this.reset=()=>{this._updateQuery={},this._whereQuery={},this.cursorOptions={cursor:{batchSize:500},allowDiskUse:!0}},this.execute=()=>i(this,void 0,void 0,function*(){return yield this.cursor(this._whereQuery,t=>{this._collection.updateOne({_id:t._id},this._updateQuery)})}),this.cursor=(t,e)=>i(this,void 0,void 0,function*(){return new Promise((o,n)=>i(this,void 0,void 0,function*(){const i=yield this._collection.aggregate([{$match:t||{}}],this.cursorOptions,null);i.on("data",t=>e(t)),i.on("close",()=>n("MongoDB closed the connection")),i.on("end",()=>o())}))}),this._db=o,this._collectionName=t,this._collection=e,this._updateQuery={},this._whereQuery={},this.cursorOptions={cursor:{batchSize:500},allowDiskUse:!0}}}}])});