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
    name: {
      type: DataTypes.STRING,
      validate: {
        max: {
          args: [60],
          msg: "Name cannot be more than 60 characters long"
        }
      }
    },
    description: DataTypes.STRING,
    location: DataTypes.STRING,
    isVirtual: DataTypes.BOOLEAN,
    groupId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {});
  event.associate = function(models) {
    models.event.belongsTo(models.group);
    models.event.belongsTo(models.user);
    models.event.belongsToMany(models.game, { through: "gameevents" });
  };
  return event;
};