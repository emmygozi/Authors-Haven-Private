module.exports = (sequelize, DataTypes) => {
  const DroppedToken = sequelize.define('DroppedToken', {
    token: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {});

  return DroppedToken;
};
