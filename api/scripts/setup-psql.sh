#!/bin/bash

##
# This script is for docker users
# It helps to resolve the issue with "setup" script in /api/package.json
# that is using psql client directly. When postgre db is set via docker and official postgree image
# it is not possible to use psql client without passing the connection parameters
# to the client. To avoid midifying package.json script use given script before running the command.
# This script sets the environment variables for psql client
# to connect to the postgre db running in docker container.
# Please use official postgree docker image without any modifications.
##

export PGHOST=localhost
export PGPORT=5432
export PGUSER=postgres
export PGPASSWORD=postgres
export PGDATABASE=postgres
