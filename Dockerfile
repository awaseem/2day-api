FROM node:18.15.0-bullseye-slim

RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci --include=dev

RUN npm run build 

USER node

CMD ["dumb-init", "node", "dist/index.js"]
