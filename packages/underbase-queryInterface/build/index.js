"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MongoCollection_1 = require("./MongoCollection");
class QueryInterface {
    constructor(db) {
        this.collection = (name) => {
            this._collection = this._db.collection(name);
            return new MongoCollection_1.MongoCollection(name, this._collection, this._db);
        };
        this._db = db;
        this._collection = null;
    }
}
exports.QueryInterface = QueryInterface;
//# sourceMappingURL=index.js.map