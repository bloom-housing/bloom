FROM node:18
# start in repo root
WORKDIR /usr/src

# bring in root manifests + tsconfig
COPY package.json yarn.lock tsconfig.json ./

# workspace manifests
COPY sites/partners/package.json ./sites/partners/package.json
COPY shared-helpers/package.json ./shared-helpers/package.json

# workspace sources
COPY shared-helpers ./shared-helpers
COPY sites/partners ./sites/partners

# install everything
RUN yarn install --frozen-lockfile

# switch into the app
WORKDIR /usr/src/sites/partners

# launch in dev mode
CMD ["yarn", "dev"]

