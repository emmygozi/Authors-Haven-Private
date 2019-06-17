module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Articles', 'deletedAt', {
    allowNull: true,
    type: Sequelize.DATE
  }),
  down: queryInterface => queryInterface.removeColumn('Articles', 'deletedAt')
};
