const express = require('express');
const app = express();
const cors = require('cors');
const { connectDB } = require('./config/database');
const { PORT: port, NAME_SPACE: nameSpace } = require('./config/env');
const { orderTopicConsumer } = require('./services/kafka.service');

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

app.listen(port, () => {
  console.log(`🚀 Servicio de mercado corriendo en el puerto ${port}`);
});