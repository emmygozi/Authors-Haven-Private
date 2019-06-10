module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Ratings', {
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
    articleId: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Articles',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    ratings: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: { min: 0, max: 5 },
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    deletedAt: {
      allowNull: true,
      type: Sequelize.DATE
    }
  }),
  down: queryInterface => queryInterface.dropTable('Ratings')
};
