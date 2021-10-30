FROM node:14.17-alpine3.13 AS development

ENV PORT=3000

WORKDIR /usr/app

COPY package*.json ./

RUN npm install glob rimraf

RUN npm install --only=development

COPY . ./

EXPOSE 3000

RUN npm run build

FROM node:14.17-alpine3.13 as production

ARG NODE_ENV=production
ARG PORT=3000

ENV NODE_ENV=${NODE_ENV}
ENV PORT=${PORT}

WORKDIR /usr/app

COPY package*.json ./

RUN npm install --only=production

USER node

EXPOSE 3000

COPY --from=development /usr/app/dist ./dist

ENTRYPOINT ["node", "dist/main"]
