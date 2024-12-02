const express = require('express');
const sql = require('mssql');
const ip = require('ip');
const app = express();

async function connectToDB() {
    try {
        await sql.connect({
            user: 'Sasha1',
            password: '1111',
            server: 'localhost',
            database: 'Libraries',
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

const port = 3000;
connectToDB();

app.get('/records', (req, res) => {
    console.log('Отримано GET запит для /records');
    sql.query('SELECT * FROM Books', (err, results) => {
        if (err) {
            console.error('Помилка при отриманні записів: ', err);
            res.status(500).send('Помилка при отриманні записів');
            return;
        }
        console.log('Results:', results);
        res.send(results);
    });
});




const myIp = ip.address();
app.listen(port, () => {
    console.log(`Server started on port ${port} \n my IP: ${myIp}`);
});