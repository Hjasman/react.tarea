import { Sequelize } from 'sequelize';
import { env } from '../config/env.js';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: env.db.host,
  port: env.db.port,
  database: env.db.database,
  username: env.db.username,
  password: env.db.password,
  logging: false,
  ...(env.nodeEnv === 'production' && {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }),
});

export default sequelize;
