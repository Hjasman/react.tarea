import app from './app.js';

import { env, validateEnv } from './config/env.js';
import sequelize from './database/sequelize.js';
import { runMigrations } from './database/migrations.js';
import logger from './config/logger.js';

import './entities/index.js';

const startServer = async () => {
  try {
    validateEnv();
    await runMigrations();
    logger.info('✅ Database connected');
    logger.info('✅ Database migrations applied');

    app.listen(env.port, () => {
      logger.info(`🚀 Server running on port ${env.port}`);
    });
  } catch (error) {
    logger.error('❌ Error starting server');
    logger.error(error);
    process.exit(1);
  }
};

startServer();
