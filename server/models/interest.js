module.exports = (sequelize, DataTypes) => {
  const Interest = sequelize.define('Interest', {
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    interest: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});

  Interest.associate = (models) => {
    const { User } = models;

    Interest.belongsTo(User, {
      foreignKey: 'userId'
    });
  };

  return Interest;
};
