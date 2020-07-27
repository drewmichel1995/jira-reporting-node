FROM node:latest

ADD . client

RUN npm install --prefix client
RUN npm install -g serve
EXPOSE 5000

RUN npm run build --prefix client
CMD serve -s ./client/build 
