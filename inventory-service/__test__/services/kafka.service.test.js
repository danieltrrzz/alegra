jest.mock('kafkajs', () => {
  const mockKafka = {
    producer: jest.fn(() => ({
      connect: jest.fn().mockResolvedValue(),
      send: jest.fn().mockResolvedValue(),
      disconnect: jest.fn().mockResolvedValue()
    })),
    consumer: jest.fn(() => ({
      connect: jest.fn().mockResolvedValue(),
      subscribe: jest.fn().mockResolvedValue(),
      run: jest.fn(({ eachMessage }) => {
        const mockMessage = {
          topic: 'test-topic',
          partition: 0,
          message: { value: JSON.stringify({ orderId: '1234' }) }
        };
        return eachMessage(mockMessage);
      })
    }))
  };
  return {
    Kafka: jest.fn(() => mockKafka)
  };
});

const kafkaService = require('../../src/services/kafka.service');
const { inventoryProcessStart } = require('../../src/services/inventory.service');

jest.mock('../../src/services/inventory.service', () => ({
  inventoryProcessStart: jest.fn()
}));

describe('Kafka Service', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should process a message from the inventory successfully', async () => {
    await kafkaService.inventoryTopicConsumer();
    expect(inventoryProcessStart).toHaveBeenCalled();
  });
});
