FROM node:lts-alpine As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run sequelize db:migrate

CMD ["node", "src/server.js"]