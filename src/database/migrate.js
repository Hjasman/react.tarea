import { validateEnv } from '../config/env.js';
import sequelize from './sequelize.js';
import { runMigrations } from './migrations.js';

try {
  validateEnv();
  const appliedMigrations = await runMigrations();
  console.info(
    appliedMigrations.length
      ? `Migraciones aplicadas: ${appliedMigrations.join(', ')}`
      : 'La base de datos ya está actualizada.',
  );
} catch (error) {
  console.error(`No se pudieron aplicar las migraciones: ${error.message}`);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}