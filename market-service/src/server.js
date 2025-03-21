const { connectDB } = require('./config/database');
const { marketTopicConsumer } = require('./services/kafka.service');

// Conectar a la base de datos
connectDB();

// Kafka
marketTopicConsumer();