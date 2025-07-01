# This file is largely based on the template-application-flask Dockerfile and
# Next.js Docker example: https://github.com/vercel/next.js/blob/canary/examples/with-docker-compose
# =============================================================================
FROM node:18.14-alpine AS base
WORKDIR /app

# Copy over config files to help with local dependency resolution
COPY --chown=node:node *.json yarn*.lock *config.js ./

# Bring in just the site we need
COPY --chown=node:node sites/public ./sites/public

# And shared helpers
COPY --chown=node:node shared-helpers ./shared-helpers

ARG SITE

# We need to have this nested 2 layers deep due to hardcoded paths in package.json
WORKDIR /app/sites/public

# Install deps
RUN yarn install --frozen-lockfile

# # =============================================================================
# # Development stage
# # =============================================================================
# FROM base AS dev
# WORKDIR /app

# COPY tsconfig.json .
# COPY sites/public/tsconfig.json .
# COPY sites/public/*.config.js .
# COPY sites/public/*.d.ts .
# COPY sites/public/src ./src
# COPY shared-helpers ./shared-helpers

# ENV NEXT_TELEMETRY_DISABLED=1

# CMD ["yarn", "dev"]

# =============================================================================
# Release stage
# =============================================================================

# Build the Next.js app
# =====================================
FROM base AS builder
WORKDIR /app/sites/public
# Environment variables must be present at build time
# https://github.com/vercel/next.js/discussions/14030
# ARG ENV_VARIABLE
# ENV ENV_VARIABLE=${ENV_VARIABLE}
# ARG NEXT_PUBLIC_ENV_VARIABLE
# ENV NEXT_PUBLIC_ENV_VARIABLE=${NEXT_PUBLIC_ENV_VARIABLE}

ENV NEXT_TELEMETRY_DISABLED=1

RUN yarn build

# The optimize stage installs only production dependencies
FROM base AS optimize

ARG SITE

WORKDIR /app/sites/public

# Reinstall only dependencies required to run the application
RUN yarn install --frozen-lockfile --only=production

# Run the Next.js server
# =====================================
# Use clean image for release, excluding any unnecessary files or dependencies
FROM node:18.14 AS release
WORKDIR /app

RUN apt-get update \
    # Install security updates
    # https://pythonspeed.com/articles/security-updates-in-docker/
    && apt-get upgrade --yes \
    # Install wget, required for health checks
    wget \
    # Reduce the image size by clearing apt cached lists
    && rm -fr /var/lib/apt/lists/* \
    # Release stage doesn't have a need for `npm`, so remove it to avoid
    # any vulnerabilities specific to NPM
    && npm uninstall -g npm \
    # Remove yarn as well (https://github.com/nodejs/docker-node/issues/777)
    && rm -rf /opt/yarn-v*\
    # Don't run production as root
    && addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs \
    # Support <Image> cache
    && mkdir -p .next/cache/images/ \
    && chown nextjs:nodejs .next/cache/images/

USER nextjs

COPY --from=optimize --chown=node:node /app/node_modules ./node_modules

# Just the site we need to reduce size
COPY --from=optimize --chown=node:node /app/sites/public/node_modules ./sites/public/node_modules

COPY --from=builder /app/sites/public/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=builder --chown=nextjs:nodejs /app/sites/public/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/sites/public/.next/static ./.next/static

# Yarn needs a package.json file to work, even for `yarn start`
COPY --chown=node:node \
        ./sites/public/package*.json \
        ./sites/public/tailwind.config.js \
        ./sites/public/next.config.js \
        ./

COPY --from=builder --chown=node:node /app/sites/public/public ./public
COPY --from=builder --chown=node:node /app/sites/public/.next ./.next

# Environment variables must be redefined at run time
# ARG ENV_VARIABLE
# ENV ENV_VARIABLE=${ENV_VARIABLE}
# ARG NEXT_PUBLIC_ENV_VARIABLE
# ENV NEXT_PUBLIC_ENV_VARIABLE=${NEXT_PUBLIC_ENV_VARIABLE}
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

EXPOSE 3000

# hadolint ignore=DL3025
# Make sure to use the built-in node user
USER node

# Start the server
CMD ["yarn", "start"]