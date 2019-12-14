import { IMigration } from '@underbase/types';

function validateMigration(migration: IMigration) {
  if (typeof migration.up !== 'function') {
    throw new Error('Migration must supply an up function.');
  }

  if (typeof migration.down !== 'function') {
    throw new Error('Migration must supply a down function.');
  }

  if (typeof migration.version !== 'number') {
    throw new Error('Migration must supply a version number.');
  }

  if (migration.version <= 0) {
    throw new Error('Migration version must be greater than 0');
  }
}

export { validateMigration };
