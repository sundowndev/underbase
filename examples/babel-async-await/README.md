# underbase-example

An example of Underbase usage on a high scalability database.

To get this working you need :

- npm
- node 8, 10, or 11
- Python 3
- A running mongodb database

## Installation

```shell
git clone https://github.com/sundowndev/underbase-example
npm install
```

Populate the database. This script will create around 10k users and 36k tasks.

```shell
pip install -r requirements.txt --user
python scripts/populate.py
```

## Configuration

The config file is located in the `migrations` folder.

```js
module.exports = {
  db: "mongodb://localhost:27017/underbase_example",
  migrationsDir: "./migrations",
  collectionName: "_migrations",
  backupsDir: "./migrations/backups",
  mongodumpBinary: "mongodump",
  backup: false,
  logs: true
}
```

## Usage

After everything is setup, you can run migrations

```shell
underbase --config ./migrations/config.js migrate 1.0
# or...
npx underbase --config ./migrations/config.js migrate 1.0
# or...
./node_modules/underbase/dist/cli.js --config ./migrations/config.js migrate 1.0
```
