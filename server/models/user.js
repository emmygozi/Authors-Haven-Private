import bcrypt from 'bcrypt';
import { config } from 'dotenv';

config();

const salt = process.env.SALT || 5;
// eslint-disable-next-line radix
const SALT_ROUNDS = parseInt(salt);

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
      Follower, Article, Profile, Social, ReportArticle, Rating, PasswordReset,
      ArticleLike, CommentLike, Role
    } = models;

    User.hasOne(Profile, {
      foreignKey: 'userId',
      as: 'profile'
    });

    User.hasMany(Follower, {
      foreignKey: 'followingId',
      as: 'following',
    });

    User.hasMany(Follower, {
      foreignKey: 'followerId',
      as: 'follower',
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
      foreignKey: 'userId'
    });

    User.hasMany(ArticleLike, {
      foreignKey: 'userId'
    });

    User.hasMany(CommentLike, {
      foreignKey: 'userId'
    });

    User.belongsToMany(Role, {
      through: 'UserRole',
      as: 'role',
      foreignKey: 'userId'
    });
  };

  User.hashPassword = async (user) => {
    const hash = await bcrypt.hash(user.dataValues.password, SALT_ROUNDS);
    await user.setDataValue('password', hash);
  };

  return User;
};
