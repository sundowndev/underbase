#!/bin/sh

SCRIPT_DIR=$(pwd)/examples/__scripts__
EXAMPLES_DIR=$(pwd)/examples

# Populate database
pip3 install -r $SCRIPT_DIR/requirements.txt
python3 $SCRIPT_DIR/populate.py

# Run migration for each examples
npm --prefix $EXAMPLES_DIR/get-started run migrations:validate
npm --prefix $EXAMPLES_DIR/get-started run migrations:run
npm --prefix $EXAMPLES_DIR/get-started run migrations:reset