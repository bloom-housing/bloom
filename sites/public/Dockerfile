
# The base image will contain all the source code needed for our site
FROM node:18.20-alpine AS base

# https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
RUN ln -s /usr/lib/libssl.so.3 /lib/libssl.so.3

# We don't need a complicated root path
WORKDIR /app

# Copy over config files to help with local dependency resolution
COPY --chown=node:node *.json yarn*.lock *config.js ./

# Bring in just the site we need
COPY --chown=node:node sites/public ./sites/public
# And shared helpers
COPY --chown=node:node shared-helpers ./shared-helpers


#####################
##### NEW STAGE #####
#####################

# The deps stage installs full dependencies
FROM base AS deps

ARG SITE

# We need to have this nested 2 layers deep due to hardcoded paths in package.json
WORKDIR /app/sites/public

# Install deps
RUN yarn install --frozen-lockfile


#######################
##### BUILD STAGE #####
#######################

# The build stage builds the app
FROM deps AS build

# We need to have this nested 2 layers deep due to hardcoded paths in package.json
WORKDIR /app/sites/public

# Environment variables must be present at build time
# https://github.com/vercel/next.js/discussions/14030
ARG BACKEND_API_BASE
ENV BACKEND_API_BASE=$BACKEND_API_BASE
ENV NEXT_TELEMETRY_DISABLED=1

# Build/compile
RUN yarn build

RUN yarn install --frozen-lockfile --only=production


#####################
##### RUN STAGE #####
#####################

# The run stage is used to run our optimized app
FROM node:18.20-alpine AS run

ARG SITE

# Copy (almost) everything over to our fresh image
WORKDIR /app

# node_modules in the root has some necessary binaries
# COPY --from=optimize --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/node_modules ./node_modules

# Just the site we need to reduce size
COPY --from=build --chown=node:node /app/sites/public/node_modules ./sites/public/node_modules

# Bring in our local dependencies
COPY --from=build /app/shared-helpers ./shared-helpers

# Switch to our site
WORKDIR /app/sites/public

# Yarn needs a package.json file to work, even for `yarn start`
COPY --chown=node:node \
        ./sites/public/package*.json \
        ./sites/public/tailwind.config.js \
        ./sites/public/next.config.js \
        ./

COPY --from=build --chown=node:node /app/sites/public/public ./public
COPY --from=build --chown=node:node /app/sites/public/.next ./.next

# Make sure to get the minimum dependencies
COPY --from=build --chown=node:node /app/sites/public/node_modules ./node_modules

# Disable Next.js telemetry by default
ENV NEXT_TELEMETRY_DISABLED=1

# Make sure to use the built-in node user
USER node

# Start the server
CMD ["yarn", "start"]
