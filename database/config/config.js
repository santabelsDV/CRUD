require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE_DEVELOPMENT,
        host: process.env.DB_HOST,
        dialect: "mysql",
        port: process.env.PORT_MIGRATE
    },
    test: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE_TEST,
        host: process.env.DB_HOST,
        dialect: "mysql",
        port: process.env.PORT_MIGRATE
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE_PRODUCTION,
        host: process.env.DB_HOST,
        dialect: "mysql",
        port: process.env.PORT_MIGRATE
    },
};