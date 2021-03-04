FROM node:14-alpine
ENV NODE_ENV=production

COPY ["package.json", "yarn.lock", "./"]
RUN yarn install --production

COPY . .
RUN yarn build:production

RUN rm -rf ./node_modules
CMD ["yarn", "start"]
