'use strict';
module.exports = (sequelize, DataTypes) => {
  const game = sequelize.define('game', {
    name: DataTypes.STRING,
    link: DataTypes.STRING
  }, {});
  game.associate = function(models) {
    // associations can be defined here
  };
  return game;
};