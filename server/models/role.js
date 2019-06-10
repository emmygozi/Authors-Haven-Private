module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});

  Role.associate = (models) => {
    const { Permission, User } = models;

    Role.belongsToMany(Permission, {
      through: 'PermissionRoles',
      as: 'permissions',
      foreignKey: 'roleId'
    });

    Role.belongsToMany(User, {
      through: 'UserRole',
      as: 'user',
      foreignKey: 'userId'
    });
  };

  return Role;
};
