'use strict';
module.exports = (sequelize, DataTypes) => {
  const group = sequelize.define('group', {
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 60],
          msg: "Invalid length. Must be between 1 and 60 characters."
        }
      }
    },
    description: DataTypes.STRING,
    max_players: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1
      }
    }
  }, {});
  group.associate = function(models) {
    models.group.belongsToMany(models.user, { through: "usergroup" });
    models.group.belongsToMany(models.game, { through: "gamegroup" });
    models.group.hasMany(models.event);
  };
  return group;
};