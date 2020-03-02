'use strict';
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: "Invalid email address"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [12, 99],
          msg: "Invalid password length. Must be between 12 and 99 characters"
        },
        is: {
          args: /(?=.*?[0-9])(?=.*?[A-Z])(?=.*[a-z]).+/,
          msg: "Missing neccessary password character. Must have at least one uppercase letter, one lowercase letter, and one number to be valid."
        }
      }
    },
    firstName: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 60],
          msg: "Invalid length. Must be between 1 and 60 characters."
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 60],
          msg: "Invalid length. Must be between 1 and 60 characters."
        }
      }
    }
  }, {
    hooks: {
      beforeCreate: (createdUser, options) => {
        if (createdUser && createdUser.password) {
          // Create hash
          let hash = bcrypt.hashSync(createdUser.password, 10);
          // Store hash
          createdUser.password = hash;
        }
      }
    }
  });

  user.associate = function(models) {
    models.user.belongsToMany(models.group, { through: "usergroups" });
    models.user.hasMany(models.group, { onDelete: "cascade", hooks: true });
    models.user.hasMany(models.event, { onDelete: "cascade", hooks: true });
  };

  user.prototype.validPassword = function(passwordTyped) {
    return bcrypt.compareSync(passwordTyped, this.password);
  };

  // Remove password before serializing user data
  user.prototype.toJSON = function() {
    let userData = this.get();
    delete userData.password;

    return userData;
  };

  return user;
};