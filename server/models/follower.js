module.exports = (sequelize, DataTypes) => {
  const Follower = sequelize.define('Follower', {
    followerId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    followingId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {});

  Follower.associate = (models) => {
    const { User } = models;

    Follower.belongsTo(User, {
      foreignKey: 'followingId'
    });

    Follower.belongsTo(User, {
      foreignKey: 'followerId'
    });
  };

  return Follower;
};
