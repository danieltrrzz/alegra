/**
 * @fileoverview Servicio de eventos de Kafka para consumir o emitir mensajes.
 * @name kafka.service.js
 */
module.exports = (() => {
  'use strict';
  const { Kafka } = require('kafkajs');
  const { v4: uuidv4 } = require("uuid");
  const { MAX_LISTENERS, KAFKA_BROKER, KAFKA_CLIENT_ID, KAFKA_MARKET_TOPIC, KAFKA_INVENTORY_TOPIC } = require('../config/env');
  const { marketProcessStart } = require('./market.service');
  // Se establece el número máximo de listeners para evitar warnings
  const EventEmitter = require('events');
  EventEmitter.defaultMaxListeners = MAX_LISTENERS;  

  /**
   * Configuración de Kafka
   * Se implementa gropuId único en caso de que varios servicios consuman del mismo tópico
   */
  const kafka = new Kafka({
    clientId: KAFKA_CLIENT_ID,
    brokers: [KAFKA_BROKER],
    reauthenticationThreshold: 5000,
    retry: { retries: 1, maxRetryTime: 1000 },
  });
  const consumer = kafka.consumer({ groupId: `market-${uuidv4()}` });
  const producer = kafka.producer();

  /**
   * Producer para enviar mensajes al tópico de inventario.
   * @param {{ orderId: 'asdas983190' }} order 
   */
  const inventoryTopicProducer = async (order) => {
    try {
      await producer.connect();
      await producer.send({
        topic: KAFKA_INVENTORY_TOPIC,
        messages: [{ value: JSON.stringify(order)}]
      });
      await producer.disconnect();
    } catch (error) {
      console.error(`❌ Error al enviar mensaje al tópico ${KAFKA_INVENTORY_TOPIC}`, error);
    }
  };

  /**
   * Consumer de los mensajes del tópico de mercado.
   */
  const marketTopicConsumer = async () => {
    try {
      await consumer.connect();
      await consumer.subscribe({
        topic: KAFKA_MARKET_TOPIC,
        fromBeginning: true
      });
      // Inicializo el consumidor de mensajes
      await consumer.run({
        eachMessage: ({ topic, partition, message }) => {
          try {
            const { orderId } = JSON.parse(message.value.toString());
            orderId
              ? marketProcessStart(orderId, inventoryTopicProducer)
              : console.log(`⚠️ Orden no recibida en el mensaje del tópico ${KAFKA_MARKET_TOPIC}`);

          } catch (error) {
            console.error(`❌ Error al procesar mensaje del tópico ${KAFKA_MARKET_TOPIC} - El mensaje no es un JSON válido`, error);
          };
        },
      });
    } catch (error) {
      console.error(`❌ Error al consumir mensajes del tópico ${KAFKA_MARKET_TOPIC}`, error);
    };
  };

  return {
    marketTopicConsumer
  };
})();