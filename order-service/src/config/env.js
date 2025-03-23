require('dotenv').config();

/**
 * Se agregan valores por defecto en caso de que no se encuentren en el archivo .env
 */
const {
  MONGO_URI = 'mongodb://127.0.0.1:27017/DBFreeLunchDay',
  PORT = 3001,
  NAME_SPACE = '/ms/order',
  SECRET_KEY = 'Fr33LunchD4y',
  MAX_LISTENERS = 20,
  KAFKA_BROKER = '127.0.0.1:9092',
  KAFKA_CLIENT_ID = 'order-service',
  KAFKA_KITCHEN_TOPIC = 'kitchen-topic',
  KAFKA_ORDER_TOPIC = 'order-topic',
  SOCKET_HOST = 'http://localhost:3001',
  SOCKET_URI_LISTENER = '/io/change-event',
  SOCKET_URI_EMITTER = '/io/notify-change-event'
} = process.env;

module.exports = {
  MONGO_URI,
  PORT: +PORT,
  NAME_SPACE,
  SECRET_KEY,
  MAX_LISTENERS: +MAX_LISTENERS,
  KAFKA_BROKER,
  KAFKA_CLIENT_ID,
  KAFKA_KITCHEN_TOPIC,
  KAFKA_ORDER_TOPIC,
  SOCKET_HOST,
  SOCKET_URI_LISTENER,
  SOCKET_URI_EMITTER
};