import pg from 'pg';
import { env, validateEnv } from '../config/env.js';

const { Client } = pg;
let client;

try {
  validateEnv();

  client = new Client({
    host: env.db.host,
    port: env.db.port,
    database: 'postgres',
    user: env.db.username,
    password: env.db.password,
    ...(env.nodeEnv === 'production' && {
      ssl: { rejectUnauthorized: false },
    }),
  });

  await client.connect();
  const { rows } = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [
    env.db.database,
  ]);

  if (rows.length > 0) {
    console.info(`La base de datos "${env.db.database}" ya existe.`);
  } else {
    const quotedDatabaseName = `"${env.db.database.replaceAll('"', '""')}"`;
    await client.query(`CREATE DATABASE ${quotedDatabaseName}`);
    console.info(`Base de datos "${env.db.database}" creada correctamente.`);
  }
} catch (error) {
  console.error(`No se pudo crear la base de datos: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (client) {
    await client.end();
  }
}