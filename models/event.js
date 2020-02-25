'use strict';
module.exports = (sequelize, DataTypes) => {
  const event = sequelize.define('event', {
    dateTime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      validate: {
        isAfter: DataTypes.NOW
      }
    },
    description: DataTypes.STRING,
    location: DataTypes.STRING,
    isVirtual: DataTypes.BOOLEAN,
    groupId: DataTypes.INTEGER
  }, {});
  event.associate = function(models) {
    models.event.belongsTo(models.group);
    models.event.belongsToMany(models.game, { through: "gameevents" });
  };
  return event;
};