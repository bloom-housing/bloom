# Keep up to date with Active LTS: https://nodejs.org/en/about/previous-releases
#
# IMPORTANT: keep the 'run' layer below in sync.
FROM node:22@sha256:23c24e85395992be118734a39903e08c8f7d1abc73978c46b6bda90060091a49 AS build


# Create a non-root user to build (principle of least privilege).
WORKDIR /build
RUN groupadd --gid 2002 build && useradd --gid 2002 --uid 2002 --home /build build
RUN chown 2002:2002 /build
USER 2002:2002

# Install only runtime dependencies into a separate directory. This will be copied into the runner
# image.
WORKDIR /build/runtime_dependencies
COPY --chown=2002:2002 package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

# Copy package.json and yarn.lock in a separate layer from the source code and install the
# dependencies. This allows docker to cache this step if package.json and yarn.lock haven't changed
# from the last docker build, making build times a lot faster.
WORKDIR /build
COPY --chown=2002:2002 package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the source code and build.
COPY --chown=2002:2002 . .
RUN yarn prisma generate
RUN yarn build

# Start a new container filesystem and copy in just the runtime dependencies and the built
# application.
#
# IMPORTANT: keep the 'build' layer above in sync.
FROM node:22@sha256:23c24e85395992be118734a39903e08c8f7d1abc73978c46b6bda90060091a49 AS run
WORKDIR /run

# Copy over build artifacts.
COPY --from=build /build/runtime_dependencies/ .
COPY --from=build /build/dist ./dist

# Need to copy the prisma schema file and generated package from `yarn prisma generate`.
# TODO: be explicit about where the client package is generated:
# https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/generating-prisma-client
COPY --from=build /build/prisma/schema.prisma ./prisma/schema.prisma
COPY --from=build /build/prisma/migrations ./prisma/migrations
COPY --from=build /build/node_modules/.prisma ./node_modules/.prisma

# Create a non-root user to run (principle of least privilege).
WORKDIR /run
RUN groupadd --gid 2002 run && useradd --gid 2002 --uid 2002 --home /run run
RUN chown --recursive 2002:2002 /run
USER 2002:2002

# Run any DB migrations then start the server.
CMD [ "/bin/bash", "-c", "yarn db:migration:run && yarn start:prod" ]
