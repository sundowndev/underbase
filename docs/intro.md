---
id: intro
title: Introduction
---

## What's this ?

Underbase is a MongoDB schema and data migration library that provides an easy-to-use abstract interface for writting, organizing and executing your database migrations. Usable both in the CLI and as a module, you can easily implement it in your framework's code base.

## Motivation

Although MongoDB is a No-SQL database, a lot of developers use it for relational operations. In fact, this is actually a best practice to use a modeling library like Mongoose to create model schema. But when it comes to update data, where a SQL database would need migrations to update existing data, MongoDB does not need to have these data updated. But that's a problem since at every update, data could lose any schema integrity. When you are updating the model schema of your collection, you have to update existing data. In order to fix this, we need to have a migration system, Mongoose does not handle migrations and there's no official library to do this. Some companies choose to create their own, some just don't use migrations. Underbase was created in order to solve the problem for everyone, the right way.

## Goals

* Migration versioning (major and minor)
* Multiple MongoDB databases support
* Execution flow control & middlewares
* Provide additional MongoDB query interface
* Handle scalable environments by design

Also supporting Mongoose out of the box, semantic versioning (x.y), incremental backups, middlewares, CLI app, Babel or Typescript transpilers, and a lot more!