# Listings Service v0

This is a minimal listings service which stores listings in individual JSON files and serves them via the [micro](https://github.com/zeit/micro) framework.

## Running the service in development
Set the port you would like the service to run on via a .env file.

In this directory, create a .env file with the following contents:
```
MICRO_DEV_PORT=[your port of choice]
```

For example, if you would like the service to run on port 3001, your .env would be:
```
MICRO_DEV_PORT=3001
```

Then, run `yarn dev` to start the service locally on `http://localhost:[your port of choice]`.
