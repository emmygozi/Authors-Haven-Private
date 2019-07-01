import bcrypt from 'bcrypt';

const salt = process.env.SALT || 5;
// eslint-disable-next-line radix
const SALT_ROUNDS = parseInt(salt);

module.exports = (sequelize, DataTypes) => {
  const VerifyUser = sequelize.define('VerifyUser', {
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
    verifyToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tokenExpiry: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    hooks: {
      beforeCreate: token => VerifyUser.hashToken(token),
      beforeUpdate: token => VerifyUser.hashToken(token)
    }
  });

  VerifyUser.associate = (models) => {
    const { User } = models;

    VerifyUser.belongsTo(User, {
      foreignKey: 'userId'
    });
  };

  VerifyUser.hashToken = async (token) => {
    const hash = await bcrypt.hash(token.dataValues.verifyToken, SALT_ROUNDS);
    await token.setDataValue('verifyToken', hash);
  };

  return VerifyUser;
};
