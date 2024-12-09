const sql = require("mssql");
require('dotenv').config()
async function connectToDB() {
    try {
        await sql.connect({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            server: 'localhost',
            database: process.env.DB_DATABASE_DEVELOPMENT,
            options: {
                encrypt: true,
                trustServerCertificate: true
            }
        });

        console.log('Підключення до бази даних встановлено.');
    } catch (err) {
        console.error('Не вдалося підключитися до бази даних:', err);
    }
}

module.exports = { connectToDB, sql };