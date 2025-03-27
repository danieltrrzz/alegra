const deliveryService = require('../../src/services/delivery.service');
const orderService = require('../../src/services/order.service');
const { orderStatus } = require('../../src/utils/const.util');

jest.mock('../../src/services/order.service');

describe('deliveryProcessStart', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log a warning if the order is not found', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    orderService.get.mockResolvedValueOnce(null);

    await deliveryService.deliveryProcessStart('123');

    expect(orderService.get).toHaveBeenCalledWith('123');
    expect(consoleLogSpy).toHaveBeenCalledWith(
      '⚠️ La orden N°123 no fue encontrada o no está en estado "Finalizada"'
    );

    consoleLogSpy.mockRestore();
  });

  it('should log a warning if the order is not in FINISHED status', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    orderService.get.mockResolvedValueOnce({ status: orderStatus.PENDING });

    await deliveryService.deliveryProcessStart('123');

    expect(orderService.get).toHaveBeenCalledWith('123');
    expect(consoleLogSpy).toHaveBeenCalledWith(
      '⚠️ La orden N°123 no fue encontrada o no está en estado "Finalizada"'
    );

    consoleLogSpy.mockRestore();
  });

  it('should update the order status to DELIVERED and log success', async () => {
    const mockOrder = {
      _id: '123',
      status: orderStatus.FINISHED,
      toObject: jest.fn().mockReturnValue({ _id: '123', status: orderStatus.FINISHED }),
    };
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    orderService.get.mockResolvedValueOnce(mockOrder);
    orderService.update.mockResolvedValueOnce();

    await deliveryService.deliveryProcessStart('123');

    expect(orderService.get).toHaveBeenCalledWith('123');
    expect(orderService.update).toHaveBeenCalledWith('123', { status: orderStatus.DELIVERED });
    expect(consoleLogSpy).toHaveBeenCalledWith('✅ Orden N°123 entregada con éxito');

    consoleLogSpy.mockRestore();
  });

  it('should log an error if an exception occurs', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    orderService.get.mockRejectedValueOnce(new Error('Database error'));

    await deliveryService.deliveryProcessStart('123');

    expect(orderService.get).toHaveBeenCalledWith('123');
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '❌ error al procesar la orden 123',
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });
});