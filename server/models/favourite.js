module.exports = (sequelize, DataTypes) => {
  const Favourite = sequelize.define('Favourite', {
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    articleId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {});

  Favourite.associate = (models) => {
    const { User, Article } = models;

    Favourite.belongsTo(User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE'
    });

    Favourite.belongsTo(Article, {
      foreignKey: 'articleId',
      as: 'article',
      onDelete: 'CASCADE'
    });
  };

  return Favourite;
};
