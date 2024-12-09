const {sql} = require('./conector');

async function getAllBook(req, res) {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;
    const request = new sql.Request();

    request.input('offset', sql.Int, offset);
    request.input('limit', sql.Int, limit);
    try {
        const result = await request.query(
            'SELECT * FROM Books ORDER BY id OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY'
        );
        const rezult = result.recordset
        res.json({
            rezult,
            currentPage: page,
        });
    } catch (err) {
        console.error('Помилка при отриманні записів:', err);
        res.status(500).send('Помилка при отриманні записів');
    }
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
        await request.query(`DELETE
                             FROM Books
                             WHERE id = @id`);
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
        await request.query(`SELECT *
                             FROM Books
                             WHERE id = @id`, (err, results) => {
            res.send(results.recordset);
        });
    } catch (error) {
        console.error('Помилка виведення книги:', error);
        res.status(500).send('Помилка виведення книги');
    }
}

async function getHello(req, res) {
    res.send('Все працює!');
}

module.exports = {getBook, deleteBook, updateBook, getAllBook, addBook, getHello};