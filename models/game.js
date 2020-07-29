'use strict';
module.exports = (sequelize, DataTypes) => {
  const game = sequelize.define('game', {
    name: {
      type: DataTypes.STRING,
      validate: {
        min: {
          args: [1],
          msg: "Invalid length. Must be between 1 and 60 characters."
        }
      }
    },
    link: {
      type: DataTypes.STRING,
      validate: {
        min: {
          args: [1],
          msg: "Invalid length. Must be between 1 and 60 characters."
        }
      }
    }
  }, {});
  game.associate = function(models) {
    models.game.belongsToMany(models.event, { through: "gameevents" });
    models.game.belongsToMany(models.group, { through: "gamegroups" });
  };
  return game;
};
