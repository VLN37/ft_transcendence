FROM node:18-alpine

WORKDIR /front

COPY ./package.json .

RUN npm install

ENTRYPOINT [ "npm", "start" ]
