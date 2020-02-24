'use strict';
module.exports = (sequelize, DataTypes) => {
  const event = sequelize.define('event', {
    datetime: DataTypes.STRING,
    location: DataTypes.STRING,
    group_id: DataTypes.INTEGER
  }, {});
  event.associate = function(models) {
    // associations can be defined here
  };
  return event;
};