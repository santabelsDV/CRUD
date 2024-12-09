require('dotenv').config();

module.exports = {
    development: {
        username:  process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database:process.env.DB_DATABASE_DEVELOPMENT,
        host: process.env.DB_HOST,
        dialect: "mssql",
        port: process.env.PORT_MIGRATE,
        options: {
            encrypt: process.env.DB_ENCRYPT === 'true',
            trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
        },
    },
    test: {
        username:  process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database:process.env.DB_DATABASE_TEST,
        host: process.env.DB_HOST,
        dialect: "mssql",
        port: process.env.PORT,
        options: {
            encrypt: process.env.DB_ENCRYPT === 'true',
            trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
        },
    },
    production: {
        username:  process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database:process.env.DB_DATABASE_PRODUCTION,
        host: process.env.DB_HOST,
        dialect: "mssql",
        port: process.env.PORT,
        options: {
            encrypt: process.env.DB_ENCRYPT === 'true',
            trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
        },
    },
};
