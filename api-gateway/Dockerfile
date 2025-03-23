FROM node:20-alpine

WORKDIR /usr/src/app

# Copiar package.json y package-lock.json y luego instalar dependencias
COPY package*.json ./
RUN npm ci --force

# Copiar el resto del código de la aplicación
COPY . .

# Instalar express-gateway globalmente
RUN npm install -g express-gateway

# Exponer los puertos necesarios
EXPOSE 3000
EXPOSE 3001

# Comando para iniciar la aplicación
CMD ["node", "server.js"]