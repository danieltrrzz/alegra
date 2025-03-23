# Etapa 1: Compilación de la aplicación Angular
FROM node:20-alpine AS build

WORKDIR /usr/src/app

# Copiar package.json y package-lock.json e instalar dependencias
COPY package*.json ./
RUN npm ci --force

# Copiar el resto del código de la aplicación y compilar
COPY . .
RUN npm run build-prod

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:alpine

# Copiar los archivos compilados desde la etapa de compilación
COPY --from=build /usr/src/app/dist/browser /usr/share/nginx/html

# Copiar el archivo de configuración del servidor Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
