ARG ECR_ACCOUNT_ID
ARG ECR_REGION
# The base image will contain all the source code needed for this task

FROM ${ECR_ACCOUNT_ID}.dkr.ecr.${ECR_REGION}.amazonaws.com/docker-hub/library/node:18.14-alpine AS source


WORKDIR /app

# Bring in all of our source files
COPY --chown=node:node ./ ./


#####################
##### NEW STAGE #####
#####################

# The deps stage installs full dependencies
FROM source as deps

WORKDIR /app

# When building this image, make sure to use the built-in node user
#USER node

# Install deps
RUN yarn install --frozen-lockfile


#####################
##### NEW STAGE #####
#####################

# The test stage builds an image safe for running tests
FROM deps AS test

WORKDIR /app

# Make a coverage directory in case test:cov is run
RUN mkdir coverage
RUN chown node:node coverage

# When building this image, make sure to use the built-in node user
USER node

# This can be overridden with other test commands
CMD yarn test


#####################
##### NEW STAGE #####
#####################

# The build stage builds the task
FROM deps AS build

WORKDIR /app

# Build/compile
RUN yarn build


#####################
##### NEW STAGE #####
#####################

# The optimize stage installs only production dependencies
FROM source AS optimize

WORKDIR /app

# Reinstall only dependencies required to run the application
RUN yarn install --frozen-lockfile --only=production


#####################
##### NEW STAGE #####
#####################

# The run stage contains an optimized image for running the task
FROM node:18.14-alpine AS run

WORKDIR /app

# Yarn needs a package.json file to work
COPY --chown=node:node package*.json tsconfig*.json ./

# Add only dependencies required to run the task
COPY --from=optimize --chown=node:node /app/node_modules ./node_modules

# Add the compiled code from the build image
COPY --from=build --chown=node:node /app/.build ./.build

# When running this image, make sure to use the built-in node user
USER node

CMD yarn import:run
