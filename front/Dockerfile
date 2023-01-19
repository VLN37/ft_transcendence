FROM node:18.10.0-alpine

ENV NODE_ENV production
WORKDIR /front

COPY --chown=node:node package*.json /front/
RUN mkdir -p node_modules && chown -R node node_modules
RUN npm ci --only=production
COPY --chown=node:node . .

USER node

ENTRYPOINT [ "npm", "start" ]
