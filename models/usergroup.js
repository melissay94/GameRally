'use strict';
module.exports = (sequelize, DataTypes) => {
  const usergroup = sequelize.define('usergroup', {
    userId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER
  }, {});
  usergroup.associate = function(models) {
    // associations can be defined here
  };
  return usergroup;
};