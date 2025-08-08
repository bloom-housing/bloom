FROM node:18.19

RUN apt-get update 
RUN apt-get install -y postgresql-client \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/api

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn prisma generate
RUN yarn build

COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

EXPOSE 3100
ENTRYPOINT ["./entrypoint.sh"]

