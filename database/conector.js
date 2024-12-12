const {sequelize} = require('./models');
async function checkConnection() {
    try {
        // Перевірка підключення до бази даних
        await sequelize.authenticate(
            {logging: false}
        );
        console.log('Підключення до бази даних успішне!');
    } catch (error) {
        console.error('Не вдалося підключитися до бази даних:', error);
    }
}



module.exports = {checkConnection };