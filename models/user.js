'use strict';
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    email: {
      type: DataTypes.STRING, 
      validate: {
        isEmail: {
          msg: "Invalid Email Address"
        }
      }},
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 99],
          msg: "Invalid Name Length. Must be betwee 1 and 99 characters"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args:[8, 99],
          msg: "Invalid Password Length. Must be between 8 and 99 characters"
        }
      }
    }
  }, {
    hooks: {
      
      beforeCreate: function(createdUser, options) {
        if (createdUser && createdUser.password) {
          // hash password
          let hash = bcrypt.hashSync(createdUser.password, 10);

          // store hash as user's password
          createdUser.password = hash;
        }
      }
    }
  });

  user.associate = function(models) {
    // associations can be defined here
  };

  // CANNOT BE AN ARROW FUNCTION. Uses keyword this and we don't want it rebinded
  user.prototype.validPassword = function(passwordTyped) {
    return bcrypt.compareSync(passwordTyped, this.password);
  };

  // Remove password before serializing
  user.prototype.toJSON = function() {
    let userData = this.get();
    delete userData.password;

    return userData;
  };

  return user;
};