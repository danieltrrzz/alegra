# **Autor** [Daniel Felipe Torres Vanegas](linkedin.com/in/daniel-felipe-torres-vanegas-a8237419a)

## Arquitectura de microservicios con Docker
Este proyecto está diseñado con una arquitectura de microservicios, utilizando Docker para la gestión y ejecución de contenedores. La solución se compone de cuatro microservicios independientes que se comunican entre sí mediante Kafka, un sistema de mensajería altamente eficiente. Además, los microservicios notifican al API Gateway sobre los cambios en el estado de la tabla "órdenes" de la base de datos mediante WebSockets, permitiendo una actualización en tiempo real de los datos. Todos los microservicios están expuestos a través del API Gateway, que facilita la gestión de las solicitudes externas y la coordinación entre los servicios. A continuación, se describen las diferentes partes del proyecto y se incluyen las instrucciones necesarias para su correcta ejecución.

## Estructura del Proyecto
El proyecto está organizado de la siguiente manera:

- api-gateway/
- database/
- frontend/
- inventory-service/
- kitchen-service/
- market-service/
- order-service/
- .gitignore
- compose.yaml
- flow.drawio
- README.md

## Descripción de los Componentes

### `api-gateway/`
Un **API Gateway** implementado con **Express Gateway**, encargado de gestionar las rutas que solicitan acceso a los microservicios. Además, recibe notificaciones a través de WebSockets para enviar alertas sobre los cambios en el estado de la tabla "órdenes" de la base de datos, garantizando una actualización en tiempo real.
- **Puerto:** 3000
- **Puerto:** 3001

Los puertos de los microservicios está expuestos únicamente en la red interna, lo que garantiza que solo el API Gateway tenga acceso directo a ellos.

### `order-service/`
**Microservicio de órdenes**: 
- **Puerto:** 3002
- **Endpoints:**
  - `GET /ms/order`: Obtiene todas las órdenes registradas.
  - `GET /ms/order/:id`: Recupera una orden específica mediante su ID.
  - `POST /ms/order`: Crea una nueva orden en el sistema.

### `kitchen-service/`
**Microservicio de cocina**
- **Puerto:** 3003
- **Endpoints:**
  - `GET /ms/kitchen`: Obtiene todas los platos de comida registrados.
  - `GET /ms/kitchen/:id`: Recupera una plato de comida específico mediante su ID.

### `inventory-service/`
**Microservicio de inventario**
- **Puerto:** 3004
- **Endpoints:**
  - `GET /ms/inventory`: Obtiene todas los ingredientes con su respectivo stock registrados.
  - `GET /ms/inventory/:ingredient`: Recupera una ingrediente específico mediante su ID.

### `market-service/`
**Microservicio de mercado**
- **Puerto:** 3005
- **Endpoints:**
  - `GET /ms/market`: Obtiene todas las compras de ingredientes registradas.
  - `GET /ms/market/:id`: Recupera una compra específica mediante su ID.

### `frontend/`
Proyecto de frontend desarrollado en **Angular**, que consume los endpoints gestionados por el API Gateway. Además, recibe notificaciones a través de WebSockets para mostrar en tiempo real los cambios en el estado de las órdenes.
- **Puerto:** 80

### `database`
- **DBFreeLunchDay.dishes.json:** Archivo utilizado para restaurar la colección de platos, almacenando los seis diferentes platos de comida disponibles durante la Jornada de Almuerzo ¡Gratis!
- **DBFreeLunchDay.inventories.json:** Archivo utilizado para restaurar la colección de ingredientes, con un stock inicial de 5 unidades para cada ingrediente.

### `flow.drawio`
Archivo de Draw.io que contiene el diagrama de flujo detallado del comportamiento del proyecto. En él se explica cómo los endpoints REST son gestionados por el API Gateway y cómo consultan los microservicios. También se describe la comunicación entre los microservicios a través de Kafka y sus respectivos tópicos, así como la notificación en tiempo real de los cambios en el estado de la tabla "órdenes" de la base de datos mediante WebSockets.

### `compose.yaml`
Archivo de configuración para **Docker Compose** que facilita la ejecución de los contenedores y la orquestación de los microservicios.

## Requisitos Previos

Para poder ejecutar este proyecto, necesitarás tener instalados los siguientes programas en tu máquina:

- **Docker**: Debes tener Docker instalado. Si no lo tienes, puedes instalarlo desde [aquí](https://www.docker.com/get-started).
- **Docker Compose**: Necesitarás Docker Compose para orquestar los servicios. La instalación de Docker Compose se puede hacer siguiendo las instrucciones [aquí](https://docs.docker.com/compose/install/).

## Pasos para Ejecutar el Proyecto

Sigue estos pasos para levantar el proyecto con Docker:

### 1. Clonar el Repositorio

Primero, clona este repositorio en tu máquina:

```bash
git clone <https://github.com/danieltrrzz/alegra.git>
cd <alegra>
```

### 2. Construir las Imágenes Docker
Asegúrate de estar en la raíz del proyecto. En cada directorio que contiene un Dockerfile (como api-gateway/, frontend/, order-service/, kitchen-service/, inventory-service/ y market-service/), ejecuta el siguiente comando para construir las imágenes Docker correspondientes.

Para api-gateway:
```bash
cd api-gateway
docker build -t api-gateway:latest .
```

Para frontend:
- Antes de construir la imagen, debes dirigirte al archivo **frontend/src/environments/environment.prod.ts** y configurar el host correspondiente, indicando la dirección donde quedará expuesto o desplegado el API Gateway. Puedes usar la IP directa del servidor o un dominio.
```bash
cd frontend
docker build -t alegra-frontend:latest .
```

Para order-service:
```bash
cd order-service
docker build -t order-service:latest .
```

Para kitchen-service:
```bash
cd kitchen-service
docker build -t kitchen-service:latest .
```

Para inventory-service:
```bash
cd inventory-service
docker build -t inventory-service:latest .
```

Para market-service:
```bash
cd market-service
docker build -t market-service:latest .
```

### 3. Levantar los Servicios con Docker Compose
Una vez que hayas construido las imágenes, puedes levantar todos los servicios utilizando Docker Compose. Ejecuta el siguiente comando desde la raíz del proyecto:

```bash
docker-compose -f compose.yaml up
```
Este comando descargará las imágenes necesarias (si no están ya presentes), levantará los contenedores y configurará las conexiones entre ellos.

### 4. Verificar que los Servicios Están Corriendo
Este seria el resultado una vez que Docker Compose haya iniciado todos los servicios:

- alegra-frontend: http://host:80
- alegra-mongodb: http://host:27017
- api-gateway: http://host:3000 (Solo para solicitudes REST)
- api-gateway: http://host:3001 (Solo para WebSockets)
- alegra-kafka-broker: http://host:9092
- alegra zookeeper: http://host:2181
- order-service: http://host:3002
- kitchen-service: http://host:3003
- invetory-service: http://host:3004
- market-service: http://host:3005

### 5. Crear la Base de Datos en Mongo
Cuando levantes los servicios, MongoDB se iniciará automáticamente. Una vez que MongoDB esté en funcionamiento, puedes acceder al contenedor de MongoDB de la siguiente manera:
**Accede al contenedor de MongoDB:**
```bash
docker exec -it <nombre_del_contenedor_mongo> mongo
```
Esto abrirá el cliente de MongoDB en la terminal.

### Crear la base de datos y las colecciones
En MongoDB, las bases de datos y colecciones se crean de forma implícita cuando insertas el primer documento en ellas, por lo que no es necesario ejecutar comandos SQL para crear bases de datos o tablas.

Sin embargo, para establecer la base de datos **DBFreeLunchDay** y agregar las colecciones **dishes** e **inventories**, es necesario tener datos en estas colecciones. Puedes hacerlo insertando documentos de ejemplo, o importando un archivo de backup con la siguiente información.

### Importar los Datos desde un Archivo de Backup (si ya tienes uno)
Si tienes archivos de backup para las colecciones y necesitas importarlos a MongoDB, puedes usar la herramienta **mongoimport** de la siguiente manera (en tu máquina local):
```bash
mongoimport --db DBFreeLunchDay --collection dishes --file /ruta/a/DBFreeLunchDay.dishes.json --jsonArray
mongoimport --db DBFreeLunchDay --collection inventories --file /ruta/a/DBFreeLunchDay.inventories.json --jsonArray
```
Este proceso importará los datos de las colecciones **dishes** e **inventories** a la base de datos **DBFreeLunchDay** desde los archivos JSON correspondientes.

## Detalles Técnicos
### Dockerfiles
Cada servicio tiene un archivo Dockerfile que especifica cómo construir la imagen para cada microservicio:
- api-gateway/Dockerfile
- frontend/Dockerfile
- order-service/Dockerfile
- kitchen-service/Dockerfile
- inventory-service/Dockerfile
- market-service/Dockerfile