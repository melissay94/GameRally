'use strict';
module.exports = (sequelize, DataTypes) => {
  const gameevent = sequelize.define('gameevent', {
    gameId: DataTypes.INTEGER,
    eventId: DataTypes.INTEGER
  }, {});
  gameevent.associate = function(models) {
    // associations can be defined here
  };
  return gameevent;
};