FROM node:18.9.1-alpine

ENV NODE_ENV production
WORKDIR /back

COPY --chown=node:node package*.json .
RUN mkdir -p node_modules && chown -R node node_modules
RUN npm ci --only=production
COPY --chown=node:node . .
RUN chmod a+x ./scripts/init.sh

USER node

ENTRYPOINT [ "./scripts/init.sh" ]
CMD [ "npm", "start" ]
