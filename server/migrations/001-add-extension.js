export const up = queryInterface => queryInterface
  .sequelize
  .query('CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;');
export const down = () => new Promise(resolve => resolve(1));
