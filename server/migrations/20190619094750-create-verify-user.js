

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('VerifyUsers', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false
    },
    userId: {
      type: Sequelize.STRING
    },
    verifyToken: {
      type: Sequelize.STRING
    },
    tokenExpiry: {
      type: Sequelize.DATE
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
  down: queryInterface => queryInterface.dropTable('VerifyUsers')
};
