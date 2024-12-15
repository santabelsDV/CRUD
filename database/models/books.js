'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Books extends Model {
    static associate(models) {}
  }
  Books.init({
    id: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    Name: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    Pages: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Author: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    Year: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'books',
    tableName: 'books',
    timestamps: false
  });
  return Books;
};