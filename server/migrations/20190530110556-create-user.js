module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    username: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    bio: {
      type: Sequelize.STRING,
      allowNull: true
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    favorites: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    following: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    password: {
      type: Sequelize.STRING,
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
  down: queryInterface => queryInterface.dropTable('users')
};
