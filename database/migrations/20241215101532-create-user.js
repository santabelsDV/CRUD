'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.DataTypes.INTEGER
            },
            password: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            firstName: {
                type: Sequelize.DataTypes.STRING,
                allowNull: true,
            },
            lastName: {
                type: Sequelize.DataTypes.STRING,
                allowNull: true,
            },
            login: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            createdAt: {
                allowNull: true,
                type: Sequelize.DataTypes.DATE
            },
            role: {
                type: Sequelize.DataTypes.STRING(250),
                allowNull: false,
            },
            accessToken: {
                allowNull: true,
                type: Sequelize.DataTypes.STRING(1000)
            },
            refreshToken: {
                allowNull: true,
                type: Sequelize.DataTypes.STRING(1000)
            },
            updatedAt: {
                allowNull: true,
                type: Sequelize.DataTypes.DATE
            },
            status: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
            },
            updatedCodeAt: {
                allowNull: true,
                type: Sequelize.DATE
            },
            fotoLink:{
                allowNull: true,
                type: Sequelize.DataTypes.STRING
            }
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable('Users');
    }
};