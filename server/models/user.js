import bcrypt from 'bcrypt';
import { config } from 'dotenv';

config();

// eslint-disable-next-line radix
const SALT_ROUNDS = parseInt(process.env.SALT);

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.CITEXT,
    email: DataTypes.CITEXT,
    bio: DataTypes.STRING,
    image: DataTypes.STRING,
    favorites: DataTypes.INTEGER,
    following: DataTypes.INTEGER,
    password: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: user => User.hashPassword(user),
      beforeUpdate: user => User.hashPassword(user)
    }
  });
  // User.associate = (models) => {
  //   // associations can be defined here
  // };

  User.hashPassword = async (user) => {
    const hash = await bcrypt.hash(user.dataValues.password, SALT_ROUNDS);
    await user.setDataValue('password', hash);
  };

  return User;
};
