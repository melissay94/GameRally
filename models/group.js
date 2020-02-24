'use strict';
module.exports = (sequelize, DataTypes) => {
  const group = sequelize.define('group', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    max_players: DataTypes.INTEGER
  }, {});
  group.associate = function(models) {
    // associations can be defined here
  };
  return group;
};