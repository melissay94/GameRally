'use strict';
module.exports = (sequelize, DataTypes) => {
  const gamegroup = sequelize.define('gamegroup', {
    game_id: DataTypes.INTEGER,
    group_id: DataTypes.INTEGER
  }, {});
  gamegroup.associate = function(models) {
    // associations can be defined here
  };
  return gamegroup;
};