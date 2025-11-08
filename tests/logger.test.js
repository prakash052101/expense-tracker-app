const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');

describe('Logger', () => {
  const logDir = path.join(__dirname, '..', 'logs');
  const errorLogPath = path.join(logDir, 'error.log');
  const combinedLogPath = path.join(logDir, 'combined.log');

  beforeAll(() => {
    // Ensure logs directory exists
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  });

  it('should be defined and have required methods', () => {
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.warn).toBe('function');
  });

  it('should log info messages', () => {
    expect(() => {
      logger.info('Test info message', { testData: 'value' });
    }).not.toThrow();
  });

  it('should log error messages with stack traces', () => {
    expect(() => {
      const error = new Error('Test error');
      logger.error('Test error message', {
        error: error.message,
        stack: error.stack
      });
    }).not.toThrow();
  });

  it('should log warning messages', () => {
    expect(() => {
      logger.warn('Test warning message', { warning: 'test' });
    }).not.toThrow();
  });

  it('should create log files', (done) => {
    logger.info('Test log file creation');
    
    // Give it a moment to write to file
    setTimeout(() => {
      const combinedExists = fs.existsSync(combinedLogPath);
      expect(combinedExists).toBe(true);
      done();
    }, 100);
  });
});
