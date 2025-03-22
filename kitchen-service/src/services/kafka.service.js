/**
 * @fileoverview Servicio de eventos de Kafka para consumir o emitir mensajes.
 * @name kafka.service.js
 */
module.exports = (() => {
  'use strict';

  const { Kafka } = require('kafkajs');
  const { v4: uuidv4 } = require("uuid");
  const {
    MAX_LISTENERS,
    KAFKA_BROKER,
    KAFKA_CLIENT_ID,
    KAFKA_KITCHEN_TOPIC,
    KAFKA_INVENTORY_TOPIC,
    KAFKA_INGREDIENTS_TOPIC,
    KAFKA_ORDER_TOPIC
  } = require('../config/env');
  const { kitchenProcessStart, preparationProcessStart } = require('./kitchen.service');
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
  const kitchenConsumer = kafka.consumer({ groupId: `kitchen-${uuidv4()}` });
  const ingredientsconsumer = kafka.consumer({ groupId: `kitchen-${uuidv4()}` });
  const producer = kafka.producer();

  /**
   * Producer para enviar mensajes al tópico de inventario (Dirigido al servicio de inventario)
   * @param {{ orderId: 'asdas983190' }} order 
   */
  const inventoryTopicProducer = async (order) => {
    try {
      await producer.connect();
      await producer.send({
        topic: KAFKA_INVENTORY_TOPIC,
        messages: [{ value: JSON.stringify(order) }]
      });
      await producer.disconnect();
    } catch (error) {
      console.error(`❌ Error al enviar mensaje al tópico ${KAFKA_INVENTORY_TOPIC}`, error);
    }
  };

  /**
   * Producer para enviar mensajes al tópico de ordenes (Dirigido al servicio de ordenes)
   * @param {{ orderId: 'asdas983190' }} order 
   */
  const orderTopicProducer = async (order) => {
    try {
      await producer.connect();
      await producer.send({
        topic: KAFKA_ORDER_TOPIC,
        messages: [{ value: JSON.stringify(order) }]
      });
      await producer.disconnect();
    } catch (error) {
      console.error(`❌ Error al enviar mensaje al tópico ${KAFKA_ORDER_TOPIC}`, error);
    };
  };

  /**
   * Consumer de los mensajes del tópico de cocina (Proveniente del servicio de ordenes)
   */
  const kitchenTopicConsumer = async () => {
    try {
      await kitchenConsumer.connect();
      await kitchenConsumer.subscribe({
        topic: KAFKA_KITCHEN_TOPIC,
        fromBeginning: true
      });
      // Inicializo el consumidor de mensajes
      await kitchenConsumer.run({
        eachMessage: ({ topic, partition, message }) => {
          try {
            const { orderId } = JSON.parse(message.value.toString());
            orderId
              ? kitchenProcessStart(orderId, inventoryTopicProducer)
              : console.log(`⚠️ Orden no recibida en el mensaje del tópico ${KAFKA_KITCHEN_TOPIC}`);

          } catch (error) {
            console.error(`❌ Error al procesar mensaje del tópico ${KAFKA_KITCHEN_TOPIC} - El mensaje no es un JSON válido`, error);
          };
        },
      });
    } catch (error) {
      console.error(`❌ Error al consumir mensajes del tópico ${KAFKA_KITCHEN_TOPIC}`, error);
    };
  };

  /**
   * Consumer de los mensajes del tópico de ingredientes (Proveniente del servicio de inventario)
   */
  const ingredientsTopicConsumer = async () => {
    try {
      await ingredientsconsumer.connect();
      await ingredientsconsumer.subscribe({
        topic: KAFKA_INGREDIENTS_TOPIC,
        fromBeginning: true
      });
      // Inicializo el consumidor de mensajes
      await ingredientsconsumer.run({
        eachMessage: ({ topic, partition, message }) => {
          try {
            const { orderId } = JSON.parse(message.value.toString());
            orderId
              ? preparationProcessStart(orderId, orderTopicProducer)
              : console.log(`⚠️ Orden no recibida en el mensaje del tópico ${KAFKA_INGREDIENTS_TOPIC}`);

          } catch (error) {
            console.error(`❌ Error al procesar mensaje del tópico ${KAFKA_INGREDIENTS_TOPIC} - El mensaje no es un JSON válido`, error);
          };
        },
      });
    } catch (error) {
      console.error(`❌ Error al consumir mensajes del tópico ${KAFKA_INGREDIENTS_TOPIC}`, error);
    };
  };

  return {
    kitchenTopicConsumer,
    ingredientsTopicConsumer
  };
})();