FROM node:20-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --force
COPY . .

RUN npm install -g express-gateway

EXPOSE 3000
CMD ["node", "server.js"]