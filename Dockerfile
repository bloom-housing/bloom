FROM node:18
# start in repo root
WORKDIR /usr/src

# bring in root manifests + tsconfig
COPY --chown=node:node package.json yarn.lock tsconfig.json ./

# workspace manifests
COPY sites/public/package.json ./sites/public/package.json
COPY shared-helpers/package.json ./shared-helpers/package.json

# workspace sources
COPY shared-helpers ./shared-helpers
COPY sites/public ./sites/public

# install everything (hoists, links shared-helpers)
RUN yarn install --frozen-lockfile

# switch into the app
WORKDIR /usr/src/sites/public

# launch in dev mode
RUN yarn build
CMD ["yarn", "start"]