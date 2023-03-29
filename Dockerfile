FROM node:18-alpine AS base

WORKDIR /app

COPY package*.json ./

FROM curlimages/curl as UI

ARG UI_VERSION=v1.0.0

WORKDIR /app

# Then download the UI from the github release
RUN curl -L https://github.com/vymalo/api-watcher-ui/releases/download/$UI_VERSION/build.zip -o build.zip

# Now unzip the compiled react app
RUN unzip build.zip

FROM base as BUILD

ENV NODE_ENV=production
ENV DEBUG=false

RUN npm i --production --silent

RUN npm prune --production


FROM base

LABEL maintainer="Stephane, Segning Lambou <selastlambou@gmail.com>"

ENV PORT=3000
ENV DATA_PATH=/app/data
ENV SESSION_SECRET=someSecretKey
ENV NODE_ENV=production
ENV DEBUG=false
ENV REACT_APP_NODE_ENV=production

COPY dist dist

COPY --from=UI /app/build ./public
COPY --from=BUILD /app/node_modules ./node_modules

EXPOSE $PORT
VOLUME $DATA_PATH

ENTRYPOINT ["npm", "run", "start"]