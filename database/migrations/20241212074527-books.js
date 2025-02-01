'use strict';

/** @type {import('sequelize-cli').Migration} */
const table_name = "books";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            table_name,
            {
                id: {
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                    type: Sequelize.DataTypes.INTEGER,
                },
                Name: {
                    type: Sequelize.DataTypes.STRING(250),
                    allowNull: false,
                },
                Pages: {
                    type: Sequelize.DataTypes.INTEGER,
                    allowNull: false,
                },
                Author: {
                    type: Sequelize.DataTypes.STRING(250),
                    allowNull: false,
                },
                Year: {
                    type: Sequelize.DataTypes.DATE,
                    allowNull: false,
                },
            },);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable(table_name);
    }
};
