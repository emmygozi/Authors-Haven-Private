module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('UserFollowers', {
    followerId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
    }
  }),
  down: queryInterface => queryInterface.dropTable('UserFollowers')
};
