FROM node:22-alpine AS builder

ENV NODE_ENV=build

USER node
WORKDIR /home/node

COPY ./package*.json /home/node/

#### AUTH TOKEN 
ARG NPM_ACCESS_TOKEN
ARG NPM_REGISTRY_EP
RUN npm config set @ematric:registry 'https:${NPM_REGISTRY_EP}'
RUN npm config set -- '${NPM_REGISTRY_EP}:_authToken' '${NPM_ACCESS_TOKEN}'
####

RUN npm ci 

COPY --chown=node:node . /home/node
RUN npm run build \
    && npm prune --production

FROM node:22-alpine

ENV NODE_ENV=production

USER node
WORKDIR /home/node


COPY --chown=node:node --from=builder /home/node/package*.json /home/node/
COPY --chown=node:node --from=builder /home/node/node_modules/ /home/node/node_modules/
COPY --chown=node:node --from=builder /home/node/dist/ /home/node/dist/
COPY --chown=node:node --from=builder /home/node/src/migrations /home/node/src/migrations
COPY --chown=node:node --from=builder /home/node/src/config/database /home/node/src/config/database
COPY --chown=node:node --from=builder /home/node/entrypoint.sh /home/node/entrypoint.sh
COPY --chown=node:node --from=builder /home/node/tsconfig.typeorm.json /home/node/tsconfig.typeorm.json
COPY --chown=node:node --from=builder /home/node/db.mmdb /home/node/db.mmdb


RUN chmod +x /home/node/entrypoint.sh

CMD [ "/bin/sh" , "-c" , "./entrypoint.sh" ]

