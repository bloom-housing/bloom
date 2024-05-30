
# Base image
FROM node:18

# Create working directory
WORKDIR /usr/src/api

# Copy package.json
COPY package.json ./

# Copy yarn.lcok
COPY yarn.lock ./

# run yarn install
RUN yarn install

# Copy source code into docker image
COPY . .

# Copy .env
COPY .env ./

# run build commands
RUN yarn prisma generate
RUN yarn build

# Expose port 3101 for api
EXPOSE 3101

# Start api
CMD ["yarn", "dev"]