FROM node:14.17-alpine3.13 AS development

WORKDIR /usr/app

COPY package*.json ./

RUN npm install glob rimraf

RUN npm install --only=development

COPY . .

EXPOSE 3000

RUN npm run build

FROM node:14.17-alpine3.13 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

EXPOSE 3000

COPY --from=development /usr/app/dist ./dist

CMD ["node", "dist/main"]
