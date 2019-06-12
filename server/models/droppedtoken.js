module.exports = (sequelize, DataTypes) => {
  const DroppedToken = sequelize.define('DroppedToken', {
    token: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {});

  // eslint-disable-next-line no-unused-vars
  DroppedToken.associate = (models) => {
    // associations can be defined here
  };
  return DroppedToken;
};
