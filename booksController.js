const {sql} = require('./conector');

async function getAllBook(req, res) {
    console.log('Отримано GET запит для /records');
    sql.query('SELECT * FROM Books', (err, results) => {
        if (err) {
            console.error('Помилка при отриманні записів: ', err);
            res.status(500).send('Помилка при отриманні записів');
            return;
        }
        console.log('Results:', results);
        res.send(results.recordset);
    });
}

async function addBook(req, res) {
    const {Pages, Name, Author, Year} = req.body;

    try {
        const request = new sql.Request();

        request.input('pages', sql.Int, Pages);
        request.input('name', sql.NVarChar(255), Name);
        request.input('author', sql.NVarChar(255), Author);
        request.input('year', sql.Date, Year);


        await request.query('INSERT INTO Books (Pages, Name, Author, Year) VALUES (@pages, @name, @author, @year)');

        res.status(200).send('Книгу успішно створено');
    } catch (error) {
        console.error('Помилка створення книги:', error);
        res.status(500).send('Помилка створення книги');
    }
}

async function deleteBook(req, res) {
    let id = parseInt(req.params.id, 10);
    console.log('delete' + id);

    try {
        const request = new sql.Request();
        request.input('id', sql.Int, id);
        await request.query(`DELETE FROM Books WHERE id = @id`);
        res.status(200).send('Книгу успішно видалено');
    } catch (error) {
        console.error('Помилка видалення книги:', error);
        res.status(500).send('Помилка видалення книги');
    }
}

async function updateBook(req, res) {
    const {Pages, Name, Author, Year} = req.body;
    let id = parseInt(req.params.id, 10);


    try {
        const request = new sql.Request();

        request.input('pages', sql.Int, Pages);
        request.input('name', sql.NVarChar(255), Name);
        request.input('author', sql.NVarChar(255), Author);
        request.input('year', sql.Date, Year);
        request.input('id', sql.Int, id);

        await request.query('update Books set Pages = @pages, Name = @name, Author=@author ,Year = @year where id = @id',);

        res.status(200).send('Книгу успішно змінено');
    } catch (error) {
        console.error('Помилка зміни книги:', error);
        res.status(500).send('Помилка ззміни книги');
    }
}

async function getBook(req, res) {
    let id = parseInt(req.params.id, 10);
    console.log('Get: ' + id);

    try {
        const request = new sql.Request();
        request.input('id', sql.Int, id);
        await request.query(`SELECT * FROM Books WHERE id = @id`, (err, results) => {
            res.send(results.recordset);
        });
    } catch (error) {
        console.error('Помилка виведення книги:', error);
        res.status(500).send('Помилка виведення книги');
    }
}

module.exports = {getBook, deleteBook, updateBook, getAllBook, addBook};