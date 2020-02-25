'use strict';
module.exports = (sequelize, DataTypes) => {
  const gamegroup = sequelize.define('gamegroup', {
    gameId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER
  }, {});
  gamegroup.associate = function(models) {
    // associations can be defined here
  };
  return gamegroup;
};