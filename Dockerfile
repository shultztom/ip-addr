FROM node:12.16.0-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json yarn.lock ./

RUN yarn install --production
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3000
USER node
CMD [ "yarn", "start" ]