import bcrypt from 'bcrypt';
import { config } from 'dotenv';

config();

const salt = process.env.SALT || 5;

const SALT_ROUNDS = parseInt(salt, 10);

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    username: {
      type: DataTypes.CITEXT,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.CITEXT,
      allowNull: false,
      unique: true
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    hooks: {
      beforeCreate: user => User.hashPassword(user),
      beforeUpdate: user => User.hashPassword(user)
    }
  });

  User.associate = (models) => {
    const {
      Article, Profile, Social, ReportArticle, Rating, PasswordReset,
      ArticleLike, CommentLike, Comment, Role, VerifyUser
    } = models;

    User.hasOne(Profile, {
      foreignKey: 'userId',
      as: 'profile'
    });

    User.belongsToMany(User, {
      foreignKey: 'followerId',
      otherKey: 'userId',
      through: 'UserFollowers',
      as: 'followed',
      timestamps: false,
    });

    User.belongsToMany(User, {
      foreignKey: 'userId',
      otherKey: 'followerId',
      through: 'UserFollowers',
      as: 'followers',
      timestamps: false,
    });

    User.hasMany(Article, {
      foreignKey: 'userId',
      as: 'article',
    });

    User.belongsToMany(Article, {
      through: Rating,
      foreignKey: 'userId',
      as: 'Ratings',
    });

    User.hasMany(Social, {
      foreignKey: 'userId',
      as: 'social'
    });

    User.hasMany(Rating, {
      foreignKey: 'userId',
      as: 'rating'
    });

    User.hasMany(ReportArticle, {
      foreignKey: 'userId'
    });

    User.hasOne(PasswordReset, {
      foreignKey: 'userId',
      as: 'resetToken'
    });

    User.hasMany(ArticleLike, {
      foreignKey: 'userId'
    });

    User.hasMany(CommentLike, {
      foreignKey: 'userId'
    });

    User.hasMany(Comment, {
      foreignKey: 'userId'
    });

    User.belongsToMany(Article, {
      foreignKey: 'userId',
      otherKey: 'articleId',
      through: 'ReadHistory',
      as: 'history'
    });

    User.belongsToMany(Comment, {
      through: CommentLike,
      foreignKey: 'userId',
      as: 'Like'
    });

    User.belongsToMany(Role, {
      through: 'UserRole',
      as: 'role',
      foreignKey: 'userId'
    });
    User.belongsToMany(Article, {
      foreignKey: 'userId',
      otherKey: 'articleId',
      through: 'ArticleLike',
      as: 'users',
      timestamps: false,
    });
    User.hasOne(VerifyUser, {
      foreignKey: 'userId',
      as: 'verifiedUser'
    });
  };
  User.hashPassword = async (user) => {
    const hash = await bcrypt.hash(user.dataValues.password, SALT_ROUNDS);
    await user.setDataValue('password', hash);
  };

  return User;
};
