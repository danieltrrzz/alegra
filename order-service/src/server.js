const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { connectDB } = require('./config/database');
const { PORT: port, NAME_SPACE: nameSpace } = require('./config/env');
const { orderTopicConsumer } = require('./services/kafka.service');
const { initSocketServer } = require('./services/socket.service');

// Conectar a la base de datos
connectDB();

// Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Kafka
orderTopicConsumer();

// Rutas
app.use(nameSpace, require('./routes/order.routes'));

// Iniciar el servidor
const server = http.createServer(app).listen(port, () => {
  console.log(`🚀 Servicio de ordenes corriendo en el puerto ${port}`);
});

// Inicializar el servidor de sockets
initSocketServer(server);