'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    login: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      allowNull: true,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE
    },
    accessToken: {
      allowNull: true,
      type: DataTypes.STRING
    },
    refreshToken: {
      allowNull: true,
      type: DataTypes.STRING
    },
    role:{
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    updatedCodeAt: {
      allowNull: true,
      type: DataTypes.DATE
    },
    fotoLink: {
      allowNull: true,
      type: DataTypes.STRING
    }

  },{
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: false
  });
  return User;
};