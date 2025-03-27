const { socketNotify } = require('../../src/services/socket.service');
const clientIo = require('socket.io-client');

jest.mock('socket.io-client');

describe('socketNotify', () => {
  let mockEmit;

  beforeEach(() => {
    mockEmit = jest.fn();
    clientIo.mockReturnValue({ emit: mockEmit });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log an error and reject if an exception occurs', async () => {
    mockEmit.mockImplementationOnce(() => {
      throw new Error('Socket error');
    });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(socketNotify()).rejects.toEqual('Error al notificar cambio');

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error al notificar cambio',
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });
});