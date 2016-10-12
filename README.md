
 _____ _____ _____ _____ _____ _____ ____  _____ _____ __    _____
|  _  |     | __  |   __|     | __  |    \|  _  | __  |  |  |   __|
|     |-   -|    -|   __|  |  |    -|  |  |     | __ -|  |__|   __|
|__|__|_____|__|__|__|  |_____|__|__|____/|__|__|_____|_____|_____|

# Airfordable DB Models

## Install using npm

##### via folder

``npm install <local folder path>/afmodels ``

##### via github

``npm install git+https://<accountname>@bitbucket.org/airfordable/afmodels
``

## Create db migration
1. At root, Run `` node_modules/east/bin/east create <migration name eg.addXtoBookings> ``

## Reads
Babel:http://kleopetrov.me/2016/03/18/everything-about-babel/


## Known issues
- Nodemon restarts process on tab switching in atom and other IDE's. Check out https://github.com/remy/nodemon/issues/763. Current solution is to peg it at 1.5.0 via nodemon@~1.5.0.
- Sometime debug run will raise the Error: listen EADDRINUSE :::5858. Run ``killall -9 node`` to kill all nodes processes and rerun command
