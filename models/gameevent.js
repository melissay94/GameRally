'use strict';
module.exports = (sequelize, DataTypes) => {
  const gameevent = sequelize.define('gameevent', {
    game_id: DataTypes.INTEGER,
    event_id: DataTypes.INTEGER
  }, {});
  gameevent.associate = function(models) {
    // associations can be defined here
  };
  return gameevent;
};