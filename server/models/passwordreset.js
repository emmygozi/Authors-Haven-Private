import bcrypt from 'bcrypt';

const salt = process.env.SALT || 5;

const SALT_ROUNDS = parseInt(salt, 10);

module.exports = (sequelize, DataTypes) => {
  const PasswordReset = sequelize.define('PasswordReset', {
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpiry: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    hooks: {
      beforeCreate: token => PasswordReset.hashToken(token),
      beforeUpdate: token => PasswordReset.hashToken(token)
    }
  });

  PasswordReset.associate = (models) => {
    const { User } = models;

    PasswordReset.belongsTo(User, {
      foreignKey: 'userId'
    });
  };

  PasswordReset.hashToken = async (token) => {
    const hash = await bcrypt.hash(token.dataValues.resetPasswordToken, SALT_ROUNDS);
    await token.setDataValue('resetPasswordToken', hash);
  };

  return PasswordReset;
};
