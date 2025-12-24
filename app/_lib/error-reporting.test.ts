describe('error-reporting', () => {
  const mockError = new Error('Test error');
  const mockContext = { source: 'TestComponent', digest: 'abc123' };

  beforeEach(() => {
    jest.resetModules();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('in development mode', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
    });

    it('logs error to console with source and message', async () => {
      const { reportError } = await import('./error-reporting');

      reportError(mockError, mockContext);

      expect(console.error).toHaveBeenCalledWith(
        '[TestComponent]',
        'Test error',
        { error: mockError, context: mockContext }
      );
    });

    it('includes additional context properties', async () => {
      const { reportError } = await import('./error-reporting');
      const extendedContext = {
        source: 'Component',
        userId: '123',
        action: 'submit',
      };

      reportError(mockError, extendedContext);

      expect(console.error).toHaveBeenCalledWith(
        '[Component]',
        'Test error',
        { error: mockError, context: extendedContext }
      );
    });
  });

  describe('in production mode', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
    });

    it('does not log to console in production', async () => {
      const { reportError } = await import('./error-reporting');

      reportError(mockError, mockContext);

      expect(console.error).not.toHaveBeenCalled();
    });

    it('handles errors with additional metadata silently', async () => {
      const { reportError } = await import('./error-reporting');
      const extendedContext = {
        source: 'ProductionComponent',
        digest: 'xyz789',
        status: 500,
        url: '/api/data',
      };

      // Should not throw and should not log
      expect(() => reportError(mockError, extendedContext)).not.toThrow();
      expect(console.error).not.toHaveBeenCalled();
    });
  });

  describe('in test mode', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'test';
    });

    it('does not log to console in test mode', async () => {
      const { reportError } = await import('./error-reporting');

      reportError(mockError, mockContext);

      expect(console.error).not.toHaveBeenCalled();
    });
  });
});
