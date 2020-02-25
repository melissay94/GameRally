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
    maxPlayers: {
      type: DataTypes.INTEGER,
      validate: {
        min: {
          args: [1],
          msg: "Invalid number of players. Need at least 1."
        }
      }
    }
  }, {});
  group.associate = function(models) {
    models.group.belongsToMany(models.user, { through: "usergroups" });
    models.group.belongsToMany(models.game, { through: "gamegroups" });
    models.group.hasMany(models.event);
  };
  return group;
};