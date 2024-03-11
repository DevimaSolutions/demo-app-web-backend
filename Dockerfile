###################
# BUILD FOR PRODUCTION
###################

# Base image
FROM node:20-alpine As build

# Create app directory
WORKDIR /src/app

# A wildcard is used to ensure both package.json AND yarn.json are copied
COPY --chown=node:node package*.json yarn.lock ./

# Install app dependencies
RUN yarn install

# Bundle app source
COPY --chown=node:node . .

RUN yarn build

USER node

###################
# PRODUCTION
###################

# Base image for production
FROM node:20-alpine As production

WORKDIR /src/app

ENV NODE_ENV production

COPY --chown=node:node package*.json yarn.lock ./

RUN yarn install --production

COPY --chown=node:node --from=build /src/app/dist ./dist

EXPOSE 8080

# Start the server
CMD [ "yarn", "start:prod" ]
