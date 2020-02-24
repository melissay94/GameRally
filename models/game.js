'use strict';
module.exports = (sequelize, DataTypes) => {
  const game = sequelize.define('game', {
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 60],
          msg: "Invalid length. Must be between 1 and 60 characters."
        }
      }
    },
    link: {
      type: DataTypes.STRING,
      validate: {
        isUrl: {
          args: true,
          msg: "Invalid url format."
        }
      }
    }
  }, {});
  game.associate = function(models) {
    models.game.belongsToMany(models.event, { through: "gameevent" });
    models.game.belongsToMany(models.group, { through: "gamegroup" });
  };
  return game;
};