'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Books extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
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