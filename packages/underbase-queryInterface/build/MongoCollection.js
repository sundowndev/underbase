"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MongoCollection {
    constructor(collectionName, collection, db) {
        this.rename = (fieldName, newFieldName) => {
            const renameQuery = {};
            renameQuery[fieldName] = newFieldName;
            this._updateQuery = {
                $rename: renameQuery,
            };
            return { where: this.where };
        };
        this.unset = (fieldName) => {
            const unsetQuery = {};
            if (typeof fieldName === 'string') {
                unsetQuery[fieldName] = 1;
            }
            else if (Array.isArray(fieldName)) {
                for (const field of fieldName) {
                    unsetQuery[field] = 1;
                }
            }
            else {
                throw new Error('Field name in .unset() must of type string or array.');
            }
            this._updateQuery = {
                $unset: unsetQuery,
            };
            return { where: this.where };
        };
        this.set = (fieldName, value) => {
            const setQuery = {};
            setQuery[fieldName] = value;
            this._updateQuery = {
                $set: setQuery || {},
            };
            return { where: this.where };
        };
        this.drop = async () => {
            return await this._db.dropCollection(this._collectionName);
        };
        this.count = async (query = {}) => {
            this._whereQuery = query;
            return await this._collection.find(this._whereQuery, {}).count();
        };
        this.where = async (query = {}) => {
            this._whereQuery = query;
            return await this.execute();
        };
        this.execute = async () => {
            return await this.cursor(this._whereQuery, (doc) => {
                this._collection.updateOne({
                    _id: doc._id,
                }, this._updateQuery);
            });
        };
        this.cursor = async (query, cb) => {
            return new Promise(async (resolve, reject) => {
                const cursor = await this._collection.aggregate([
                    {
                        $match: query || {},
                    },
                ], this.cursorOptions);
                cursor.on('data', (doc) => cb(doc));
                cursor.on('close', () => reject('MongoDB closed the connection'));
                cursor.on('end', () => resolve());
            });
        };
        this._db = db;
        this._collectionName = collectionName;
        this._collection = collection;
        this._updateQuery = {};
        this._whereQuery = {};
        this.cursorOptions = {
            cursor: {
                batchSize: 500,
            },
            allowDiskUse: true,
        };
    }
}
exports.MongoCollection = MongoCollection;
//# sourceMappingURL=MongoCollection.js.map