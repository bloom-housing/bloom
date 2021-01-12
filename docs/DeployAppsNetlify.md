# Deplying Bloom Apps to Netlify

The Bloom front-end applications are designed to be stateless, and thus can be deployed as static sites to Netlify or directly to any major hosting environment (e.g. AWS, GCP, Azure). The following information is intended to help guide the deployment of the reference implementation to Netlify, but can also serve as a starting point for other front-end deployment scenarios

## Per-app Deployment

Because Bloom uses a monorepo style of organization, there are likely multiple apps (e.g. public and partners) that will each need their own deployment configuration. Each build configuation should make sure to work from the correct code base directory, for example the public app build command might be:

    cd sites/public; yarn run build ; yarn run export

### Changing the Base Directory

Netlify offers the option to set a "Base Directory" for each deployed app, which can offer increased isolation from the rest of the monorepo and ensures that shared packages are imported from the officially published versions rather than elsewhere in the monorepo tree.

In order to make this configuration work, make sure to have an empty yarn.lock in your base directory in addition to having YARN_VERSION defined (see below). Netlify will not install or use yarn correctly unless it sees a yarn.lock file in the build root.

## Server-side Rendering

## Environment Variables

In addition to those environment variables defined in .env.template for the relevant applications, make sure to define the following variables to ensure the release process is consistent with the Bloom supported versions:

- NODE_VERSION
- YARN_VERSION

Note that there is a `netlify.toml` file in each reference app directory so that settings can be specified in a version controlled manner. If there are any environment variables that should not be publically accessible as part of the source, they can be set direcly in the Netlify console so long as they're not in the toml file.
