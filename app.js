const express = require('express');
const bodyParser = require('body-parser');
const {router, routername} = require('./routes/books');
const {checkConnection}=require('./database/conector');


const app = express();
const port = process.env.PORT || 3000;


console.log(`Сервер запущено на http://localhost:${port}`);
app.use(bodyParser.json({limit: "1kb"}));




app.listen(port, () => {
    console.log(`Сервер працює на порту ${port}`);
});

checkConnection().then(()=>{
    app.use('/books', router);
    app.use('/', routername);
});

