FROM node:latest

RUN mkdir -p /server
WORKDIR /server

COPY . /server

RUN npm install

CMD ["npm", "start", "server" ]