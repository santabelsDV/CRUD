const {sequelize} = require('../app/models');

async function checkConnection() {
    try {
        // Check the connection to the database
        await sequelize.authenticate(
            {logging: false}
        );
        console.log('Connection to the database is successful!');
    } catch (error) {
        console.error('Could not connect to the database:', error);
    }
}

module.exports = {checkConnection};