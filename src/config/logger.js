import pino from 'pino';
import { env } from './env.js';

const logger = pino({
  level: env.logger.level,
  transport:
    env.nodeEnv === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        }
      : undefined,
});

export default logger;
