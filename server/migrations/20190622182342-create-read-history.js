module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('ReadHistory', {
    userId: {
      type: Sequelize.UUID,
      allowNull: false
    },
    articleId: {
      type: Sequelize.UUID,
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: queryInterface => queryInterface.dropTable('ReadHistory')
};
