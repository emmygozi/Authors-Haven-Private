module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    articleId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    ratings: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamp: true,
    paranoid: true
  });

  Rating.associate = (models) => {
    const { User, Article } = models;

    Rating.belongsTo(User, {
      foreignKey: 'userId',
      as: 'user'
    });

    Rating.belongsTo(Article, {
      foreignKey: 'articleId',
      as: 'article',
    });
  };

  return Rating;
};
