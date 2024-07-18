'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Profile);
    }


    getAccountAge() {
      const now = new Date();
      const createdAt = new Date(this.createdAt);
      const diffTime = Math.abs(now - createdAt);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  
      const years = Math.floor(diffDays / 365);
      const months = Math.floor((diffDays % 365) / 30);
      const days = diffDays % 30;
  
      let age = '';
      if (years > 0) age += `${years} year${years > 1 ? 's' : ''} `;
      if (months > 0) age += `${months} month${months > 1 ? 's' : ''} `;
      if (days > 0) age += `${days} day${days > 1 ? 's' : ''}`;
  
      return `Joined ${age.trim()} ago`;
    }
  }

  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate(instance, option) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(instance.password, salt);
        instance.password = hash;
      }
    },
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate((user, options) => {
    user.role = "member";
  });

  return User;
};