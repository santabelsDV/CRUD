const express = require('express');
const bodyParser = require('body-parser');
const { connectToDB } = require('./conector');
const bookRoutes = require('./books');

const app = express();
const port = 3000;

connectToDB();
console.log(`Сервер запущено на http://localhost:3000`);
app.use(bodyParser.json());



app.use('/books', bookRoutes);

app.listen(port, () => {
    console.log(`Сервер працює на порту ${port}`);
});
