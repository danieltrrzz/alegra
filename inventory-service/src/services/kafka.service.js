/**
 * @fileoverview Servicio de eventos de Kafka para consumir o emitir mensajes.
 * @name kafka.service.js
 */
module.exports = (() => {
  'use strict';
  
  const { Kafka } = require('kafkajs');
  const { v4: uuidv4 } = require("uuid");
  const { MAX_LISTENERS ,KAFKA_BROKER, KAFKA_CLIENT_ID, KAFKA_INVENTORY_TOPIC, KAFKA_MARKET_TOPIC, KAFKA_INGREDIENTS_TOPIC } = require('../config/env');
  const { inventoryProcessStart } = require('./inventory.service');
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
  const consumer = kafka.consumer({ groupId: `inventory-${uuidv4()}` });
  const producer = kafka.producer();

  /**
   * Producer para enviar mensajes al tópico de mercado (Dirigido al servicio de mercado)
   * @param {{ orderId: 'asdas983190' }} order 
   */
  const marketTopicProducer = async (order) => {
    try {
      await producer.connect();
      await producer.send({
        topic: KAFKA_MARKET_TOPIC,
        messages: [{ value: JSON.stringify(order)}]
      });
      await producer.disconnect();
    } catch (error) {
      console.error(`❌ Error al enviar mensaje al tópico ${KAFKA_MARKET_TOPIC}`, error);
    }
  };

  /**
   * Producer para enviar mensajes al tópico de ingredientes (Dirigido al servicio de cocina)
   * @param {{ orderId: 'asdas983190' }} order 
   */
  const ingredientsTopicProducer = async (order) => {
    try {
      await producer.connect();
      await producer.send({
        topic: KAFKA_INGREDIENTS_TOPIC,
        messages: [{ value: JSON.stringify(order)}]
      });
      await producer.disconnect();
    } catch (error) {
      console.error(`❌ Error al enviar mensaje al tópico ${KAFKA_INGREDIENTS_TOPIC}`, error);
    };
  };

  /**
   * Consumer de los mensajes del tópico de inventario.
   */
  const inventoryTopicConsumer = async () => {
    try {
      await consumer.connect();
      await consumer.subscribe({
        topic: KAFKA_INVENTORY_TOPIC,
        fromBeginning: true
      });
      // Inicializo el consumidor de mensajes
      await consumer.run({
        eachMessage: ({ topic, partition, message }) => {
          try {
            const { orderId } = JSON.parse(message.value.toString());
            orderId
              ? inventoryProcessStart(orderId, marketTopicProducer, ingredientsTopicProducer)
              : console.log(`⚠️ Orden no recibida en el mensaje del tópico ${KAFKA_INVENTORY_TOPIC}`);

          } catch (error) {
            console.error(`❌ Error al procesar mensaje del tópico ${KAFKA_INVENTORY_TOPIC} - El mensaje no es un JSON válido`, error);
          };
        },
      });
    } catch (error) {
      console.error(`❌ Error al consumir mensajes del tópico ${KAFKA_INVENTORY_TOPIC}`, error);
    };
  };

  return {
    inventoryTopicConsumer
  };
})();