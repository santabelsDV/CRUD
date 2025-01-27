
const {books} = require('../../database/models');

async function getAllBook(req, res) {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const allPages = await books.count();

    const booksWithCondition = await books.findAll({
        order: [['id', 'ASC']],
        limit: limit ,
        offset: offset,
    });

    const results = booksWithCondition.map(book => book.dataValues);

    const currentPage = Math.ceil(allPages / limit);

    res.json({
        results,
        allPages: currentPage,

    });
}

async function addBook(req, res) {
    const {Pages, Name, Author, Year} = req.body;

    try {
        await books.create({
            Pages: Pages,
            Name: Name,
            Author: Author,
            Year: Year
        });

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
        await books.destroy({
            where: {
                id: id
            }
        });

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
        await books.update({
            Pages: Pages,
            Name: Name,
            Author: Author,
            Year: Year
        }, {
        where: {
            id: id
        }
        })
        res.status(200).send('Книгу успішно змінено');
    } catch (error) {
        console.error('Помилка зміни книги:', error);
        res.status(500).send('Помилка ззміни книги');
    }
}

async function getBook(req, res) {
    let id = parseInt(req.params.id, 10);

    try {
        await books.findOne({
            where: {
                id: id
            }
        }).then((result) => {
            res.status(200).send(result);
        });

    } catch (error) {
        console.error('Помилка при отриманні книг:', error);
        res.status(500).send('Помилка сервера');
    }
}

async function getHello(req, res) {
    res.send('Все працює!');
}

module.exports = {getBook, deleteBook, updateBook, getAllBook, addBook, getHello};