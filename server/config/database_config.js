import path from 'path';
import { config } from 'dotenv';

config();

export const development = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  dialect: 'postgres'
};

export const test = {
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE_TEST || 'kingsmen_ah_backend_test',
  host: process.env.DB_HOST || '127.0.0.1',
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database_test.sqlite'),
};

export const production = {
  production: {
    use_env_variables: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {
      ssl: true,
    },
    logging: false,
  }
};
