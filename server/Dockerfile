FROM node:latest

RUN mkdir -p /srv/app/server
WORKDIR /srv/app/server

COPY . /srv/app/server

RUN npm install

CMD ["npm", "run", "dev" ]