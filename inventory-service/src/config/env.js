require('dotenv').config();

/**
 * Se agregan valores por defecto en caso de que no se encuentren en el archivo .env
 */
const {
  MONGO_URI = 'mongodb://127.0.0.1:27017/DBFreeLunchDay',
  PORT = 3004,
  NAME_SPACE = '/ms/inventory',
  MAX_LISTENERS = 20,
  KAFKA_BROKER = '127.0.0.1:9092',
  KAFKA_CLIENT_ID ='inventory-service',
  KAFKA_INVENTORY_TOPIC = 'inventory-topic',
  KAFKA_MARKET_TOPIC = 'market-topic',
  KAFKA_INGREDIENTS_TOPIC = 'ingredients-topic'
} = process.env;

module.exports = {
  MONGO_URI,
  PORT: +PORT,
  NAME_SPACE,
  MAX_LISTENERS: +MAX_LISTENERS,
  KAFKA_BROKER,
  KAFKA_CLIENT_ID,
  KAFKA_INVENTORY_TOPIC,
  KAFKA_MARKET_TOPIC,
  KAFKA_INGREDIENTS_TOPIC
};