import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },

  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

export const validateEnv = () => {
  const requiredVariables = {
    DB_NAME: env.db.database,
    DB_USER: env.db.username,
    DB_PASSWORD: env.db.password,
    JWT_SECRET: env.jwt.secret,
  };
  const missingVariables = Object.entries(requiredVariables)
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missingVariables.length > 0) {
    throw new Error(
      `Faltan variables de entorno requeridas: ${missingVariables.join(', ')}. Configúralas en el archivo .env.`,
    );
  }

  if (!Number.isInteger(env.db.port) || env.db.port < 1 || env.db.port > 65535) {
    throw new Error('DB_PORT debe ser un puerto válido entre 1 y 65535.');
  }
};
