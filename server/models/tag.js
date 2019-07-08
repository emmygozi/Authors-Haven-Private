module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    articleSlug: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tagList: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true
    }
  }, {});

  Tag.associate = (models) => {
    const { Article } = models;

    Tag.belongsTo(Article, {
      foreignKey: 'articleSlug',
      as: 'articles'
    });
  };

  return Tag;
};
