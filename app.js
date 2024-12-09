const express = require('express');
const bodyParser = require('body-parser');
const {connectToDB} = require('./database/conector');
const {router,routername} = require('./routes/books');

const app = express();
const port = process.env.PORT || 3000;

connectToDB();
console.log(`Сервер запущено на http://localhost:${port}`);
app.use(bodyParser.json({ limit: "1kb" }));


app.use('/books', router);

app.listen(port, () => {
    console.log(`Сервер працює на порту ${port}`);
});

app.use('/', routername);