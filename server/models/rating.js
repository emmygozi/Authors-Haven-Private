module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
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
    const { User } = models;

    Rating.belongsTo(User, {
      as: 'rater',
      foreignKey: 'userId',
    });
  };

  return Rating;
};
