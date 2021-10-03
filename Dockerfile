FROM node:14.16-alpine3.10
WORKDIR /usr/app/
COPY ./server.js /usr/app
COPY ./angular.json /usr/app
EXPOSE 80
CMD [ "node", "./server.js", "--port=80" ]
