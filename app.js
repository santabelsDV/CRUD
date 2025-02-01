const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {router, routername} = require('./routes/books');
const loginRouter = require('./routes/login')
const {checkConnection} = require('./database/conector');
const {verifyToken} = require('./app/service/JWT/verifyToken');
const authRoutes = require('./routes/auth');
const passport = require('./app/service/OAuth/Passport');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.json({limit: "10kb"}));

app.listen(port, (err) => {
    if (err) {
        console.error(`Помилка запуску сервера: ${err}`);
        return;
    }
    console.log(`Сервер працює за адресою http://localhost:${port}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Порт ${port} вже використовується.`);
    } else {
        console.error(err);
    }
});

// ------------------------------------------------------------------------
app.use(passport.initialize());
app.use('/auth', authRoutes);

// ------------------------------------------------------------------------

checkConnection().then(() => {

    app.use('/books', verifyToken, router);
    app.use('/', routername);

});

app.use('/login', loginRouter);
