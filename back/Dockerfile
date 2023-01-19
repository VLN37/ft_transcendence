FROM node:18.10.1-alpine

ENV NODE_ENV production
WORKDIR /back

COPY --chown=node:node package*.json /back/
RUN mkdir -p node_modules && chown -R node node_modules
RUN mkdir -p dist && chown -R node dist
RUN touch /back/ormlogs.log &&chown node /back/ormlogs.log
RUN npm ci --only=production
COPY --chown=node:node . .
RUN chmod a+x ./scripts/init.sh

USER node

ENTRYPOINT [ "./scripts/init.sh" ]
CMD [ "npm", "start" ]
