import logger from '../config/logger.js';

export const requestLogger = (req, res, next) => {
  const logData = {
    method: req.method,
    url: req.originalUrl,
  };

  if (Object.keys(req.params).length > 0) {
    logData.params = req.params;
  }

  if (Object.keys(req.query).length > 0) {
    logData.query = req.query;
  }

  if (req.body && Object.keys(req.body).length > 0) {
    logData.body = req.body;
  }

  logger.info(logData, `Incoming Request: ${req.method} ${req.originalUrl}`);

  next();
};
