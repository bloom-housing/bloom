# Listings Service v0

This is a minimal listings service which stores listings in individual JSON files and serves them via the [Koa](https://github.com/koajs/koa) framework.

## Getting Started for Developers

Running the service should be very staight forward. Assuming you've already done a `yarn install` for the entire monorepo, the server should start locally by simply running `yarn dev`. This starts a [ts-node-dev](https://github.com/whitecolor/ts-node-dev) which handles compilation, including hot-restart-on-change.

### Environment Variables

Development environment variables can be easily loaded by creating a file named .env, and setting the variables as shown in .env.template. In a production PAAS environment (e.g. Heroku, AWS, GCP), these variables are typically defined in the management console so they are not persistently stored in either the base image or code repository. See also [the 12-factor principles](http://12factor.net/)