import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

if (process.env.NODE_ENV === 'local') {
  dotenv.config({ path: './env/local.env' });
}

export default new DataSource ({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + './../../**/*.entity{.ts,.js}'],
  synchronize: false,
  schema: process.env.DATABASE_SCHEMA,
  migrationsRun: true,
  migrationsTableName: 'migration_todo',
  migrations: ['database/migrations/**/*{.ts,.js}'],
  // ssl: {
  //   rejectUnauthorized: false,
  // },
}); 
