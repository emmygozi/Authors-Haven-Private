module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('PasswordResets', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    resetPasswordToken: {
      type: Sequelize.STRING,
      allowNull: true
    },
    resetPasswordExpiry: {
      type: Sequelize.DATE,
      allowNull: true
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
  down: queryInterface => queryInterface.dropTable('PasswordResets')
};
