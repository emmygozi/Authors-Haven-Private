export const up = () => new Promise(resolve => resolve(1));
export const down = queryInterface => queryInterface.dropTable('Followers');
