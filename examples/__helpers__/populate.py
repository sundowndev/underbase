#!/usr/bin/env python3
import random
import datetime
from pymongo import MongoClient

# MongoDB infos
dbURL = 'mongodb://localhost:27017/'
dbName = 'underbase_example'

# ------------ script ------------
client = MongoClient(dbURL)
client.drop_database(dbName)
db = client[dbName]

def populateUsers():
    collectionName = 'Users'
    max = 10000

    col = db[collectionName]

    col.drop()

    index = 0
    while index < max:
        user = {
            'firstname': random.choice(['John', 'Patrick', 'David', 'Raphael']),
            'lastname': random.choice(['Payet', 'Fontaine', 'Hoareau', 'Cervoni']),
            'isDeleted': random.choice([True, False]),
            'datecreated': datetime.datetime.now(),
        }

        col.insert_one(user)
        index += 1
    
    print('Inserted ' + str(index) + ' entries in ' + collectionName)

def populateTasks():
    collectionName = 'Tasks'
    max = 36157

    col = db[collectionName]

    col.drop()

    index = 0
    while index < max:
        user = {
            'title': random.choice(['Finish the underbase example repository', 'Make some covfefe']),
            'label': random.choice(['development', 'office']),
            'isDeleted': random.choice([True, False]),
            'datecreated': datetime.datetime.now(),
        }

        col.insert_one(user)
        index += 1
    
    print('Inserted ' + str(index) + ' entries in ' + collectionName)

populateUsers()
populateTasks()

print('Finished.')