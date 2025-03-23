require('dotenv').config();

/**
 * Se agregan valores por defecto en caso de que no se encuentren en el archivo .env
 */
const {
  MONGO_URI = 'mongodb://127.0.0.1:27017/DBFreeLunchDay',
  PORT = 3002,
  NAME_SPACE = '/ms/kitchen',
  MAX_LISTENERS = 20,
  KAFKA_BROKER = '127.0.0.1:9092',
  KAFKA_CLIENT_ID = 'kitchen-service',
  KAFKA_KITCHEN_TOPIC = 'kitchen-topic',
  KAFKA_INVENTORY_TOPIC = 'inventory-topic',
  KAFKA_INGREDIENTS_TOPIC = 'ingredients-topic',
  KAFKA_ORDER_TOPIC = 'order-topic',
  KITCHEN_TIME = 10000,
  SOCKET_HOST = 'http://localhost:3001',
  SOCKET_URI_EMITTER = '/io/change-event'
} = process.env;

module.exports = {
  MONGO_URI,
  PORT: +PORT,
  NAME_SPACE,
  MAX_LISTENERS: +MAX_LISTENERS,
  KAFKA_BROKER,
  KAFKA_CLIENT_ID,
  KAFKA_KITCHEN_TOPIC,
  KAFKA_INVENTORY_TOPIC,
  KAFKA_INGREDIENTS_TOPIC,
  KAFKA_ORDER_TOPIC,
  KITCHEN_TIME: +KITCHEN_TIME,
  SOCKET_HOST,
  SOCKET_URI_EMITTER
};