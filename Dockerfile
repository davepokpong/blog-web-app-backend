FROM node:18.4.0-alpine as dependencies
WORKDIR /blog-web-app
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

FROM node:18.4.0-alpine as builder
WORKDIR /blog-web-app
COPY . .
COPY --from=dependencies /blog-web-app/node_modules ./node_modules

ARG MONGO_URL_ARG
ENV MONGO_URL $MONGO_URL_ARG

FROM node:18.4.0-alpine as runner
WORKDIR /blog-web-app

COPY ./node_modules ./node_modules
COPY ./package.json ./package.json
COPY ./dist ./dist

EXPOSE 3000
CMD ["node", "./dist/server.js"]