const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {router, routerName} = require('./routes/books');
const loginRouter = require('./routes/login')
const {checkConnection} = require('./database/conector');
const {verifyToken} = require('./app/service/JWT/verifyToken');
const authRoutes = require('./routes/auth');
const passport = require('./app/service/OAuth/Passport');
const storageApp = require("./localStorage/app.js")
const {routerUser} = require('./routes/userInterface');
const app = express();
const port = process.env.PORT || 3000;



app.use(cors());

app.use(bodyParser.json({limit: "10kb"}));

app.listen(port, (err) => {
    if (err) {
        console.error(`Server startup error: ${err}`);
        return;
    }
    console.log(`The server is located at http://localhost:${port}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use.`);
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
    app.use('/user',verifyToken, routerUser);
    app.use('/', routerName);
});

app.use('/login', loginRouter);
