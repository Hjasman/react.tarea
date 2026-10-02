import { DataTypes, QueryTypes } from 'sequelize';
import sequelize from './sequelize.js';
import initialSchema from './migrations/001-initial-schema.js';

const migrations = [initialSchema];

export const runMigrations = async () => {
  await sequelize.authenticate();

  const queryInterface = sequelize.getQueryInterface();
  const tables = await queryInterface.showAllTables();
  const tableNames = new Set(
    tables.map((table) =>
      (typeof table === 'string' ? table : table.tableName).toLowerCase(),
    ),
  );
  const hasMigrationsTable = tableNames.has('sequelizemeta');
  const hasLegacySchema = ['users', 'projects', 'tasks'].every((table) =>
    tableNames.has(table),
  );

  if (!hasMigrationsTable) {
    await queryInterface.createTable('SequelizeMeta', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      executed_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  }

  const appliedRows = await sequelize.query('SELECT name FROM "SequelizeMeta"', {
    type: QueryTypes.SELECT,
  });
  const appliedMigrations = new Set(appliedRows.map(({ name }) => name));
  const newlyApplied = [];

  if (hasLegacySchema && !appliedMigrations.has(initialSchema.name)) {
    await queryInterface.bulkInsert('SequelizeMeta', [
      { name: initialSchema.name, executed_at: new Date() },
    ]);
    appliedMigrations.add(initialSchema.name);
  }

  for (const migration of migrations) {
    if (appliedMigrations.has(migration.name)) {
      continue;
    }

    await sequelize.transaction(async (transaction) => {
      await migration.up(queryInterface, { transaction });
      await queryInterface.bulkInsert(
        'SequelizeMeta',
        [{ name: migration.name, executed_at: new Date() }],
        { transaction },
      );
    });

    newlyApplied.push(migration.name);
  }

  return newlyApplied;
};