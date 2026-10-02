import logger from '../config/logger.js';

export const errorHandler = (error, req, res, next) => {
  logger.error(error);

  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Error interno del servidor',
  });
};
