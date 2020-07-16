FROM node:13.5.0-alpine3.11

RUN apk --no-cache add curl
RUN apk add --update busybox-suid
RUN mkdir /server && chown -R node:node /server

WORKDIR /server

COPY --chown=node:node package*.json ./

USER node

RUN npm install && npm cache clean --force --loglevel=error

COPY --chown=node:node . ./

CMD [ "node", "server.js"]