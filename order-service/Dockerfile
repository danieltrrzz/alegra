FROM node:20-alpine

WORKDIR /usr/src/app

# Copiar package.json y package-lock.json y luego instalar dependencias
COPY package*.json ./
RUN npm ci --force

# Copiar el resto del código de la aplicación
COPY . .

# Exponer los puertos necesarios
EXPOSE 3002

# Comando para iniciar la aplicación
CMD ["node", "src/server.js"]