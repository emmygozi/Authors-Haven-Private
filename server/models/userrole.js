module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define('UserRole', {
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});

  UserRole.associate = (models) => {
    const { User, Role } = models;

    UserRole.belongsTo(User, {
      foreignKey: 'userId'
    });

    UserRole.belongsTo(Role, {
      foreignKey: 'roleId'
    });
  };

  return UserRole;
};
