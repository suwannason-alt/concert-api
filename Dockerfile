FROM node:22.15.0-alpine3.21 AS base

FROM base AS builder
RUN mkdir -p /home/alpine/backend
RUN apk update && apk upgrade
RUN apk add --no-cache git python3 py3-pip build-base

FROM builder AS build
WORKDIR /home/alpine/backend
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build

FROM builder AS dependencies
WORKDIR /home/alpine/backend
COPY package.json yarn.lock ./
RUN yarn install --production

FROM base AS deploy
RUN mkdir -p /home/alpine/backend
WORKDIR /home/alpine/backend
COPY --from=build /home/alpine/backend/dist ./dist
COPY --from=dependencies /home/alpine/backend/node_modules ./node_modules

EXPOSE 4000

CMD ["node", "./dist/main.js"]
