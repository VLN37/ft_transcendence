FROM node:18-alpine

ENV NODE_ENV production
WORKDIR /back

COPY --chown=node:node package*.json .
RUN npm ci --only=production
COPY --chown=node:node . .
RUN chown -R node node_modules

USER node

ENTRYPOINT [ "npm", "start" ]
