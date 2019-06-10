module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define('Permission', {
    access: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});

  Permission.associate = (models) => {
    const { Role } = models;

    Permission.belongsToMany(Role, {
      through: 'PermissionRoles',
      as: 'roles',
      foreignKey: 'permissionId'
    });
  };

  return Permission;
};
