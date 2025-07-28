#####################
##### Run image #####
#####################
FROM node:18.20-alpine AS run

# install the appropriate openSSL package in order to run all commands
RUN ln -s /usr/lib/libssl.so.3 /lib/libssl.so.3

WORKDIR /usr/src/api

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn prisma generate
RUN yarn build

EXPOSE 3100
CMD ["yarn", "start:prod"]

###########################
##### Migration image #####
###########################
FROM run AS migrate

# command to run the migrations
CMD ["yarn", "db:migration:run"]
