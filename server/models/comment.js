module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    articleId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {});

  Comment.associate = (models) => {
    const { Article, User, CommentLike } = models;

    Comment.belongsTo(Article, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE',
    });

    Comment.belongsTo(User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      as: 'author'
    });

    Comment.hasMany(CommentLike, {
      foreignKey: 'commentId',
    });

    Comment.belongsToMany(User, {
      through: CommentLike,
      foreignKey: 'commentId',
      as: 'Like'
    });
  };

  return Comment;
};
