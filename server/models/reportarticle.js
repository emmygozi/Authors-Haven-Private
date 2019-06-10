module.exports = (sequelize, DataTypes) => {
  const ReportArticle = sequelize.define('ReportArticle', {
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    report: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {});

  ReportArticle.associate = (models) => {
    const { User, Article } = models;

    ReportArticle.belongsTo(User, {
      foreignKey: 'userId',
      as: 'user'
    });

    ReportArticle.belongsTo(Article, {
      foreignKey: 'articleId',
      as: 'article',
    });
  };

  return ReportArticle;
};
