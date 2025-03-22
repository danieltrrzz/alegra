FROM node:20-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --force
COPY . .

EXPOSE 80
CMD ["node", "src/server.js"]