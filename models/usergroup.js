'use strict';
module.exports = (sequelize, DataTypes) => {
  const usergroup = sequelize.define('usergroup', {
    user_id: DataTypes.INTEGER,
    group_id: DataTypes.INTEGER
  }, {});
  usergroup.associate = function(models) {
    // associations can be defined here
  };
  return usergroup;
};