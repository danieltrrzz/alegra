require('dotenv').config();

/**
 * Se agregan valores por defecto en caso de que no se encuentren en el archivo .env
 */
const {
  MONGO_URI = 'mongodb://127.0.0.1:27017/DBFreeLunchDay',
  MAX_LISTENERS = 20,
  KAFKA_BROKER = '127.0.0.1:9092',
  KAFKA_CLIENT_ID ='market-service',
  KAFKA_MARKET_TOPIC = 'market-topic',
  KAFKA_INVENTORY_TOPIC = 'inventory-topic',
  MARKET_PLACE_URI = 'https://recruitment.alegra.com/api/farmers-market/buy'
} = process.env;

module.exports = {
  MONGO_URI,
  MAX_LISTENERS: +MAX_LISTENERS,
  KAFKA_BROKER,
  KAFKA_CLIENT_ID,
  KAFKA_MARKET_TOPIC,
  KAFKA_INVENTORY_TOPIC,
  MARKET_PLACE_URI
};